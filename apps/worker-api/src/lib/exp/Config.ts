import { Allocation, Datafile, Experiment, Feature } from './types'

export class Config {
  private datafile: Datafile
  private maxBuckets: number

  constructor(datafile: Datafile, maxBuckets: number) {
    this.datafile = datafile
    this.maxBuckets = maxBuckets
  }

  private computeRangeEnd(percentage: number): number {
    return Math.floor((percentage * this.maxBuckets) / 100)
  }

  getExperiments(): { [id: string]: Experiment } {
    const { experiments = {} } = this.datafile
    return experiments
  }

  getExperiment(id: string): Experiment {
    const experiments = this.getExperiments()
    return experiments[id]
  }

  getFeatures(): { [id: string]: Feature } {
    const { features = {} } = this.datafile
    return features
  }

  getFeature(id: string): Feature {
    const features = this.getFeatures()
    return features[id]
  }

  getFeatureAllocation(id: string): Allocation | undefined {
    const feature = this.getFeature(id)

    if (!feature) {
      return
    }

    const rangeEnd = this.computeRangeEnd(feature.percentage)

    return { id, rangeEnd }
  }

  getExperimentAllocation(id: string): Allocation | undefined {
    const experiment = this.getExperiment(id)

    if (!experiment) {
      return
    }

    const rangeEnd = this.computeRangeEnd(experiment.percentage)

    return { id, rangeEnd }
  }

  getExperimentAllocations(id: string): Array<Allocation> {
    const experiment = this.getExperiment(id)
    let acc = 0

    return experiment.variations.map(({ id, percentage }) => {
      acc += percentage
      const rangeEnd = this.computeRangeEnd(acc)

      return { id, rangeEnd }
    })
  }
}
