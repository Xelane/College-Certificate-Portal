// app/home/HomeUI.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './Home.module.css';
import logo from './mitlogo.png'; // Make sure this path is correct
import BouncyButton from './BouncyButton';
import React from 'react';
export default function HomeUI() {
  return (
    <div className={styles.container}>
      <Image src={logo} alt="MIT WPU Logo" className={styles.logo} />
      <h1>Welcome to Our Leaving Certificate Portal!</h1>
      <h2>Select Your Role:</h2>
      <div className={styles.roleButtons}>
        <Link href="/student/login">
          <BouncyButton>Student</BouncyButton>
        </Link>
        <Link href="/faculty/login">
          <BouncyButton>Faculty</BouncyButton>
        </Link>
      </div>
    </div>
  );
}