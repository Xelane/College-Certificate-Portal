// app/layout.tsx
import './global.css'; // Import global styles
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode; // Define the type for children prop
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
