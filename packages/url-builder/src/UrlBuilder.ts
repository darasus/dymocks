import { UrlBuilderArgs } from "./types";

export class UrlBuilder {
  public url: string;
  private baseUrl = process.env.WORKER_API;

  constructor(args: UrlBuilderArgs) {
    const url = new URL(`${this.baseUrl}/api/create`);
    const params = url.searchParams;

    params.append("name", args.name);
    params.append("type", args.type);

    if (typeof args.take === "number") {
      params.append("take", args.take.toString());
    }

    if ("model" in args) {
      const list = [];

      for (const key in args.model) {
        list.push(`${key}:${args.model[key]}`);
      }

      params.append("model", list.join(","));
    }

    this.url = url.toString();
  }
}
