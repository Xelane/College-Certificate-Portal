// app/home/BouncyButton.tsx
"use client";  // Add this line to mark it as a Client Component

import React, { useState } from 'react';

interface BouncyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function BouncyButton({ children, onClick }: BouncyButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    if (onClick) onClick();
    setTimeout(() => setIsClicked(false), 150); // Reset animation after 150ms
  };

  return (
    <button
      onClick={handleClick}
      style={{
        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.15s ease-in-out',
      }}
    >
      {children}
    </button>
  );
}
