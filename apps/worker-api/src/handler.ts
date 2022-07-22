import { routes } from './routes'

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const handler = routes[url.pathname]

  if (!handler) {
    return new Response('Not found', { status: 404 })
  }

  return handler(request)
}
