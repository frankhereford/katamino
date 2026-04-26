import Head from 'next/head'

export default function HeaderContent (props: { description?: string }): JSX.Element {
  return (
    <Head>
      <title>Katamino</title>
      <meta name='description' content={props.description ?? 'A T3 Stack Experiment'} />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  )
}
