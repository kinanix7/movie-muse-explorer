
import React from 'react';
import { Film } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative">
        <Film className={`${sizeClasses[size]} text-primary animate-pulse`} />
        <div className={`absolute inset-0 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spinner ${sizeClasses[size]}`}></div>
      </div>
      <p className="text-muted-foreground text-sm animate-pulse-opacity">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
