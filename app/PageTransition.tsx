// app/home/PageTransition.tsx
"use client";  // Add this line to mark it as a Client Component

import React, { useState, useEffect, ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false); // Clean up on component unmount
  }, []);

  return (
    <div className={isVisible ? 'fade-in' : ''}>
      {children}
    </div>
  );
}
