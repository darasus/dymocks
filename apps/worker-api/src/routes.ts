import { Engine } from './lib/exp/Engine'
import { datafile } from '../datafile'
import { storage } from './lib/exp/storage'

export const routes: Record<
  string,
  ((request: Request) => Promise<Response> | Response) | undefined
> = {
  '/api/experiment': async (request: Request) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || undefined
    const countryCode = url.searchParams.get('countryCode') || undefined
    const engine = new Engine({
      datafile,
      ...(userId ? { storage: storage(userId) } : {}),
    })

    const value = await engine.getVariationIds(userId, {
      countryCode,
    })
    return new Response(JSON.stringify(value) || null)
  },
  '/api/experiment/create': () => {
    return new Response(null)
  },
}
