import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Web() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  console.log({ isLoaded, userId, sessionId });

  return (
    <div>
      <div>
        <div>{`userId ${userId}`}</div>
        <div>{`sessionId ${sessionId}`}</div>
      </div>
      <Link href="/sign-up">
        <a>Login</a>
      </Link>
    </div>
  );
}
