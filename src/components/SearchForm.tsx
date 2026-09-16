import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function SearchForm({ value, onChange, onSubmit, disabled = false }: SearchFormProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(inputValue.trim());
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    onChange(nextValue);
  };

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="Busca de cidade" className="space-y-2">
      <label htmlFor="city-search">Cidade</label>
      <input
        id="city-search"
        type="text"
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
        className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled}
        aria-busy={disabled}
        className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent-600"
      >
        Buscar
      </button>
    </form>
  );
}
