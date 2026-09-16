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
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Busca de cidade"
      className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
    >
      <label htmlFor="city-search" className="mb-2 block text-sm font-medium text-white/80">
        Cidade
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="city-search"
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Ex.: São Paulo"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-night-800 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled}
          aria-busy={disabled}
          className="rounded-lg bg-accent-600 px-5 py-3 font-medium text-white hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent-600"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
