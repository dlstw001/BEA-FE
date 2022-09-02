import '../styles/globals.css';
import Layout from '../components/common/Layout';
import { LicenseInfo as licenseInfo } from '@mui/x-license-pro';

licenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE_KEY);

function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}

export default MyApp;
