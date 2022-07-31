import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function MyApp({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={client}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
