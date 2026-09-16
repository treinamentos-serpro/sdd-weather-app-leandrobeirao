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
      <div role="status" aria-busy="true">
        {message}
      </div>
    );
  }

  if (kind === 'empty') {
    return <div role="status">{message}</div>;
  }

  return (
    <div role="alert">
      <p>{message}</p>
      {retryable && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-accent-600 px-3 py-2 text-white hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export const StatusMessage = memo(StatusMessageComponent);
