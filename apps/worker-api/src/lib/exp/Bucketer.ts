import * as murmurhash from 'murmurhash'
import { Allocation } from './types'

export class Bucketer {
  static HASH_SEED = 1
  static MAX_HASH_VALUE = Math.pow(2, 32) - 1

  private maxBuckets: number

  constructor(maxBuckets: number) {
    this.maxBuckets = maxBuckets
  }

  private computeBucketId(id: string): number {
    const hashValue = murmurhash.v3(id, Bucketer.HASH_SEED)
    const ratio = hashValue / Bucketer.MAX_HASH_VALUE

    return Math.floor(ratio * this.maxBuckets)
  }

  bucket(key: string, allocations: Array<Allocation>): string | null {
    const bucketId = this.computeBucketId(key)
    const allocation = allocations.find(
      (allocation) => bucketId < allocation.rangeEnd,
    )

    if (allocation) {
      return allocation.id
    }

    return null
  }
}
