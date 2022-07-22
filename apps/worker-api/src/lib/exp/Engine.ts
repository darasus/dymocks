import { AudienceEvaluator } from './AudienceEvaluator'
import { Bucketer } from './Bucketer'
import { Config } from './Config'
import { Datafile, Feature, Storage } from './types'

export class Engine {
  static readonly TOTAL_BUCKETS = 10000
  static readonly TRAFFIC_ALLOCATION_SALT = 'tas'

  private config: Config
  private bucketer: Bucketer
  private evaluator: AudienceEvaluator
  private userId?: string
  private attributes?: Record<string, any>
  private storage?: Storage<string>
  private cache: { [id: string]: string } = {}

  constructor({
    datafile,
    userId,
    attributes,
    storage,
  }: {
    datafile: Datafile
    storage?: Storage<string>
    userId?: string
    attributes?: Record<string, any>
  }) {
    this.config = new Config(datafile, Engine.TOTAL_BUCKETS)
    this.bucketer = new Bucketer(Engine.TOTAL_BUCKETS)
    this.evaluator = new AudienceEvaluator()
    this.storage = storage
    this.userId = userId
    this.attributes = attributes
  }

  private computeKey(id: string, userId = '', salt = ''): string {
    return (userId || this.userId || '').concat(id).concat(salt)
  }

  private getForcedVariation(experimentId: string): string | undefined {
    console.log(JSON.stringify(this.cache))
    return this.cache[experimentId]
  }

  getUserId(): string | undefined {
    return this.userId
  }

  getAttributes(): Record<string, any> | undefined {
    return this.attributes
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  setAttributes(attributes: Record<string, any> = {}): void {
    this.attributes = attributes
  }

  setForcedVariation(experimentId: string, variationId: string): void {
    this.cache[experimentId] = variationId
  }

  isFeatureEnabled(
    featureId: string,
    userId?: string,
    attributes?: Record<string, any>,
  ): boolean | null {
    const key = this.computeKey(featureId, userId)
    const feature = this.config.getFeature(featureId)

    if (!feature) {
      return null
    }

    const { audience } = feature
    const allocation = this.config.getFeatureAllocation(featureId)

    if (
      !allocation ||
      !this.evaluator.evaluate(audience, attributes || this.attributes)
    ) {
      return null
    }

    return !!this.bucketer.bucket(key, [allocation])
  }

  getFeature(featureId: string): Feature {
    return this.config.getFeature(featureId)
  }

  getEnabledFeatures(
    userId?: string,
    attributes?: Record<string, any>,
  ): { [featureId: string]: boolean } {
    const features = this.config.getFeatures()

    return Object.keys(features).reduce((features, featureId) => {
      return {
        ...features,
        [featureId]: this.isFeatureEnabled(featureId, userId, attributes),
      }
    }, {})
  }

  async getVariationId(
    experimentId: string,
    userId?: string,
    attributes?: Record<string, any>,
  ): Promise<string | null> {
    let variationId =
      this.getForcedVariation(experimentId) ||
      (await this.storage?.get(experimentId))

    if (variationId) {
      return variationId
    }

    const experiment = this.config.getExperiment(experimentId)

    if (!experiment) {
      return null
    }

    const { audience } = experiment

    if (!this.evaluator.evaluate(audience, attributes || this.attributes)) {
      return null
    }

    let key = this.computeKey(
      experimentId,
      userId,
      Engine.TRAFFIC_ALLOCATION_SALT,
    )
    const allocation = this.config.getExperimentAllocation(experimentId)

    if (!allocation || !this.bucketer.bucket(key, [allocation])) {
      return null
    }

    key = this.computeKey(experimentId, userId)
    const allocations = this.config.getExperimentAllocations(experimentId)

    variationId = this.bucketer.bucket(key, allocations)
    await this.storage?.store(experimentId, variationId)

    return variationId
  }

  async getVariationIds(
    userId?: string,
    attributes?: Record<string, any>,
  ): Promise<{ [experimentId: string]: string }> {
    const experiments = this.config.getExperiments()
    const keys = Object.keys(experiments)
    const results = await Promise.all(
      keys.map((key) => this.getVariationId(key, userId, attributes)),
    )

    return keys.reduce((experiments, experimentId, i) => {
      return {
        ...experiments,
        [experimentId]: results[i],
      }
    }, {})
  }
}
