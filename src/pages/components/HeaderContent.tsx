import Head from "next/head";

export default function HeaderContent(props: { description?: string }) {

  return (
    <Head>
      <title>Katamino</title>
      <meta name="description" content="A T3 Stack Experiment" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}