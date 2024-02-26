import React from 'react'
import NavBar from '@/components/Navbar'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import "@uploadthing/react/styles.css";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  
  return (
    <>
    <NavBar />
    <SessionProvider session={session}>
    <Component {...pageProps} />
   </SessionProvider>
   </>

  )
}