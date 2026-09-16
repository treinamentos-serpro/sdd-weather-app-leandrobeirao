interface StatusMessageProps {
  kind: 'loading' | 'empty' | 'error';
  message: string;
  retryable?: boolean;
  onRetry?: () => void;
}

export function StatusMessage({ kind, message, retryable = false, onRetry }: StatusMessageProps) {
  if (kind === 'loading') {
    return <div role="status" aria-live="polite">Carregando...</div>;
  }

  if (kind === 'empty') {
    return <div role="status" aria-live="polite">{message}</div>;
  }

  return (
    <div role="alert" aria-live="assertive">
      <p>{message}</p>
      {retryable && onRetry && (
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
