export interface Storage<T> {
  get(id: string): Promise<T | null>
  store(id: string, value: T | null): Promise<void>
}

export interface Experiment {
  id: string
  percentage: number
  variations: Array<Variation>
  audience?: Record<string, any>
}

export interface Variation {
  id: string
  percentage: number
}

export interface Feature {
  id: string
  percentage: number
  data?: Record<string, any>
  audience?: Record<string, any>
}

export interface Allocation {
  id: string
  rangeEnd: number
}

export interface Datafile {
  experiments?: { [id: string]: Experiment }
  features?: { [id: string]: Feature }
}

export interface Datafile {
  experiments?: {
    [id: string]: Experiment
  }
  features?: {
    [id: string]: Feature
  }
}
