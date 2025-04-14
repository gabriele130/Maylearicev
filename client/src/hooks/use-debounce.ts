import { useState, useEffect } from 'react';

/**
 * Un hook personalizzato che ritarda l'aggiornamento di un valore.
 * Utile per prevenire richieste API troppo frequenti durante la digitazione.
 * 
 * @param value Il valore da aggiornare con ritardo
 * @param delay Il ritardo in millisecondi (default: 500ms)
 * @returns Il valore aggiornato dopo il ritardo
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Imposta un timer per aggiornare il valore dopo il ritardo
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Pulisci il timer se il valore cambia prima del termine del ritardo
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}