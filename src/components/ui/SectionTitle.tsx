import React from 'react';

interface SectionTitleProps {
  icon?: React.ReactNode;
  title: string;
  right?: React.ReactNode;
}

export function SectionTitle({ icon, title, right }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {right}
    </div>
  );
}