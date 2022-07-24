import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UltraMiddleware } from "@ultra/nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await UltraMiddleware(request, response);

  return response;
}
