import '../styles/globals.css'
import {SessionProvider} from 'next-auth/react';
import NavBar from '../components/NavBar';
function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
 <NavBar/> <Component {...pageProps} />
  </SessionProvider>
  )
}

export default MyApp
