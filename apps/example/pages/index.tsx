import { GetServerSideProps } from "next";
import { Button } from "ui";
import { getUltra } from "@ultra/nextjs";

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Button />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log({ getServerSidePropsCookies: getUltra(ctx) });

  return { props: {} };
};
