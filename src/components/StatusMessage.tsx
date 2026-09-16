import { memo } from 'react';

interface StatusMessageProps {
  kind: 'loading' | 'empty' | 'error';
  message: string;
  retryable?: boolean;
  onRetry?: () => void;
}

function StatusMessageComponent({ kind, message, retryable = false, onRetry }: StatusMessageProps) {
  if (kind === 'loading') {
    return (
      <div
        role="status"
        aria-busy="true"
        className="flex items-center gap-3 rounded-lg border border-accent-400/30 bg-white/5 p-4 text-white shadow-glass backdrop-blur-md"
      >
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-accent-400 border-t-transparent"
        />
        <span>{message}</span>
      </div>
    );
  }

  if (kind === 'empty') {
    return (
      <div
        role="status"
        className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/80 shadow-glass backdrop-blur-md"
      >
        {message}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-white shadow-glass backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <p>{message}</p>
      {retryable && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-lg bg-accent-600 px-4 py-2 font-medium text-white hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export const StatusMessage = memo(StatusMessageComponent);
