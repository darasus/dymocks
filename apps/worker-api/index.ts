import { handleRequest } from "./src/handler";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
