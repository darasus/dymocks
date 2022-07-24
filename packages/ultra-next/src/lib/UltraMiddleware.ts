import { NextRequest, NextResponse } from "next/server";

export const UltraMiddleware = async (
  request: NextRequest,
  response: NextResponse
) => {
  const cookie = request.cookies.get("ultra");
  if (!cookie) {
    const res = await fetch("http://localhost:8787/api/experiment");
    const data = await res.json();
    response.cookies.set("ultra", JSON.stringify(data));
  }
};
