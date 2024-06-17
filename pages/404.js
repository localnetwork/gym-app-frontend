import Page404 from "@/components/statuses/Page404";
import Head from "next/head";

export default function Custom404() {
    return (
        <>
        <Head>
            <title>Page not found | One Kaizen</title>
        </Head>
            <Page404 />
        </>
    )
  }