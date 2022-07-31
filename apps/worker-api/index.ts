import { handleRequest } from "./src/handler";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await handleRequest(request);
    } catch (e) {
      return new Response(`${e}`);
    }
  },
};
