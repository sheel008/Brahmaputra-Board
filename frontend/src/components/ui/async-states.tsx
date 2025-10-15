import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-32 w-32'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mx-auto`} />
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ error, onRetry, showRetry = true }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <p className="text-destructive mb-4">{error}</p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Card className="p-8">
      <div className="text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-muted-foreground mb-4">{description}</p>}
        {action && action}
      </div>
    </Card>
  );
}

interface AsyncWrapperProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingMessage?: string;
  showRetry?: boolean;
}

export function AsyncWrapper({ 
  loading, 
  error, 
  onRetry, 
  children, 
  loadingMessage = 'Loading...',
  showRetry = true 
}: AsyncWrapperProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} showRetry={showRetry} />;
  }

  return <>{children}</>;
}

// Custom hook for API calls with loading and error states
export function useAsyncOperation() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const execute = React.useCallback(async <T,>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = React.useCallback(() => {
    setError(null);
  }, []);

  return { loading, error, execute, reset };
}
