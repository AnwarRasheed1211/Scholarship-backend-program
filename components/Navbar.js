// components/NavBar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './home.module.css';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

const NavBar = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Fetch the session

  const handleLogout = async () => {
    console.log('Session before signOut:', session); // Log the session before signOut
    await signOut({ callbackUrl: '/' });
  };

  if (router.pathname === '/studentHome') {
    return (
      <nav className={styles.navBar}>
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <Image src="/abac_logo.png" alt="Logo" width={80} height={80} />
            <div className={styles.logoText}>
              AU Scholarship Student
            </div>
          </div>
          <div className={styles['imge-container']}>
            {session ? (
              <div className={styles['text2']} onClick={handleLogout}>Log Out</div>
            ) : null}
            <Image src="/profile_red.png" alt="Another Image" width={35} height={35} style={{ borderRadius: '50%' }} />
          </div>
          <div className={styles['text-container']}>
            <Link href={'/profile'}>
              <div className={styles['text']}>Profile Name</div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  return null;
};

export default NavBar;
