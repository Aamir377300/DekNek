import Head from 'next/head';

export default function Layout({ children, title = 'TaskFlow Pro' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="TaskFlow Pro — your personal productivity dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
}
