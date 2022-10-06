import Head from "next/head";
import "../styles/globals.css";
import Layout from "../components/common/Layout";
import { LicenseInfo as licenseInfo } from "@mui/x-license-pro";

licenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE_KEY);

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Peplink BEA System</title>
        <meta name="description"></meta>
        <link rel="icon" href="/head_icon.svg" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default MyApp;
