import { GetServerSidePropsContext } from "next";
import { parseCookie } from "./parseCookie";

export const getUltra = (context: GetServerSidePropsContext) => {
  const cookieSet = context.res.getHeader("Set-Cookie");
  const { ultra } = parseCookie(Array.isArray(cookieSet) ? cookieSet[0] : "");
  const cookie = ultra || context.req.cookies.ultra;

  if (cookie) {
    return JSON.parse(cookie);
  }

  return null;
};
