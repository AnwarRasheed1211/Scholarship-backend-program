import Head from 'next/head';
import styles from '../components/login.module.css';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession(); // Get user session data
  // Function to determine the redirect URL based on user role
  const getRedirectUrl = (session) => {
    console.log('Session Data:', session);
    
    if (session && session.user && session.user.role) {
      console.log('User Role:', session.user.role);

      if ( session.user.role  == 'student') {
        return '/studentHome';
      } else if ( session.user.role == 'organizer') {
        return '/staffHome';
      } else if ( session.user.role == 'registrar') {
        return '/registerHome';
      }
    }
    // Handle other cases or default redirect
    return '/defaultHome';
  };

  return (
    <>
      <Head>
        <title>Abac Scholarship Web</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles['login-page']}>
        <div className={styles['login-container']}>
          <Image src="/abac_logo.png" alt="Image" width={90} height={90} className={styles['logo-image']} />
          <h2 className={styles['custom-h2']}>Abac Scholarship </h2>
          <div className={styles['buttons-container']}>
            <button
              className={styles['loginbutton']}
              onClick={() => {
                signIn('azure-ad', { callbackUrl: getRedirectUrl(session) }, { prompt: 'login' });
              }}
            >
              Log in
            </button>
          </div>
        </div>
      </main>
    </>
  );
}