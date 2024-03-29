import Head from 'next/head';
import styles from '../components/login.module.css';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get user session data
  const [redirectUrl, setRedirectUrl] = useState(null); // State to store redirect URL

  // Function to determine the redirect URL based on user role
  const getRedirectUrl = async (email) => {
    if (email === 'vms0403@au.edu') {
      return '/menu'; // Redirect to registerHome page if email matches
    } else {
      // Fetch email from MongoDB and check if it matches the user's email
      if (email.match(/^u\d+@au\.edu$/)) {
        return '/studentHome'; // Redirect to student page if email matches the pattern
      } else {
        return '/staffHome'; // Default redirect to staff page
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const email = session.user.email;
      getRedirectUrl(email).then((url) => {
        router.push(url); // Use router.push() for client-side navigation
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [status, session]);

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
          <h2 className={styles['custom-h2']}>AU Scholarship </h2>
          <div className={styles['buttons-container']}>
            <button
              className={styles['loginbutton']}
              onClick={() => {
                signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' });
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