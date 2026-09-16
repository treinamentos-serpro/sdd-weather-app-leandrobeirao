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
    <form onSubmit={handleSubmit} aria-label="Busca de cidade">
      <label htmlFor="city-search">Cidade</label>
      <input
        id="city-search"
        type="text"
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Cidade"
      />
      <button type="submit" disabled={disabled} aria-label="Buscar">
        Buscar
      </button>
    </form>
  );
}
