import React from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {children}
    </div>
  );
}