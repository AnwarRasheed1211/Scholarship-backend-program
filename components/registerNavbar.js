import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './home.module.css';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

const StaffNavbar = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Fetch the session

  const handleLogout = async () => {
    console.log('Session before signOut:', session); // Log the session before signOut
    await signOut({ callbackUrl: '/' });
  };


  if (router.pathname === '/registerHome') {
    return (
      <nav className={styles.navBar1}>
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
          <Image src="/abac_logo.png" alt="Logo" width={80} height={80} />
              <div className={styles.logoText}>
                AU Scholarship Registrar
              </div>
          </div>
          <div className={styles['imge-container']}>
          {session ? (
              <div className={styles['text2']} onClick={handleLogout}>Log Out</div>
            ) : null}
            <Image src="/work_upload.png" alt="Another Image" width={35} height={35} />
          </div>
        </div>
      </nav>
    );
  }

  return null;
};

export default StaffNavbar;