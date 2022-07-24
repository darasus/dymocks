import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps }: any) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
