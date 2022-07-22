import { Storage } from './types'

export const storage = (userId: string): Storage<string> => ({
  get: async (key: string) => {
    const value = await EXPERIMENTS.get(`${userId}:${key}`)
    return value as string
  },
  store: async (key: string, val: string) => {
    await EXPERIMENTS.put(`${userId}:${key}`, val)
  },
})
