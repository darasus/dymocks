import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";

const client = new QueryClient();

function MyApp({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={client}>
      <div>
        <Link href="/single">
          <a>Single</a>
        </Link>
      </div>
      <div>
        <Link href="/list">
          <a>List</a>
        </Link>
      </div>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
