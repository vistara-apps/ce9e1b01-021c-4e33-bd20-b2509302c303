'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <Loader2 className={cn('animate-spin text-accent', sizeClasses[size])} />
      {text && (
        <p className="text-muted text-sm">{text}</p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ isVisible, text, className }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      className
    )}>
      <div className="glass-card p-8">
        <LoadingSpinner size="lg" text={text || 'Loading...'} />
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  className,
  onClick,
  disabled,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'btn-primary flex items-center space-x-2',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{isLoading ? (loadingText || 'Loading...') : children}</span>
    </button>
  );
}

