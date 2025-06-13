// app/home/page.tsx
import Link from 'next/link';
import React from 'react';
import HomeUI from './HomeUI';
import PageTransition from './PageTransition';
// import PageTransition from './animations';
 // Import page-specific styles

export default function Home() {
//   return (
    
//     <div>
//       <h1>Welcome to the Leaving Certificate Portal</h1>
//       <h2>Select Your Role:</h2>
//       <Link href="/student/login">Student</Link>
//       <br />
//       <Link href="/faculty/login">Faculty</Link>
//     </div>
//   );
// } 
return (
  <PageTransition>
    <HomeUI />
  </PageTransition>
);
}