// src/components/DashboardCard.tsx
import React from 'react';

type Props = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string; // 'accent', 'warning', etc.
};

export default function DashboardCard({ title, value, icon, color = 'primary' }: Props) {
  // Define colores de borde para modo claro/oscuro
  const borderColor = {
    accent: 'border-accent dark:border-green-400',
    warning: 'border-warning dark:border-orange-400',
    primary: 'border-primary dark:border-blue-400',
    secondary: 'border-secondary dark:border-gray-700',
  }[color] || 'border-primary dark:border-blue-400';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-4 border-l-4 ${borderColor}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        <div className="text-xl font-bold text-secondary dark:text-white">{value}</div>
      </div>
    </div>
  );
}