import invariant from "invariant";
import { baseHeaders } from "./baseHeaders";
import { handleList } from "./handleList";
import { handleSingle } from "./handleSingle";

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/create")) {
    const params = url.searchParams;
    const name = params.get("name");
    const type = params.get("type");
    const model = params.get("model");

    invariant(typeof name === "string", "Name is required");
    invariant(typeof type === "string", "Type is required");
    invariant(typeof model === "string", "Model is required");

    if (type === "single") {
      const result = handleSingle(model);

      return new Response(JSON.stringify(result), {
        headers: baseHeaders,
      });
    }

    if (type === "list") {
      const take = Number(params.get("take")) || undefined;

      const result = handleList({ model, take });

      return new Response(JSON.stringify(result), {
        headers: baseHeaders,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: baseHeaders,
  });
}
