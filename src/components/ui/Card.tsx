import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl shadow p-4 bg-white/5 border border-white/10 ${className}`}>
      {children}
    </div>
  );
}