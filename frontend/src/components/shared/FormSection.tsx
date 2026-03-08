import type { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  description,
  icon: Icon,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className="w-5 h-5 text-brand-600" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {description && (
          <p className="text-sm text-gray-500 ml-7">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
