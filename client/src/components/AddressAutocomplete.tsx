import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Inline useDebounce hook poiché è molto semplice
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidatedData?: (data: {
    isValid: boolean;
    formattedAddress?: string;
    city?: string;
    postcode?: string;
    country?: string;
  }) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  requiredField?: boolean;
}

export function AddressAutocomplete({
  label,
  value,
  onChange,
  onValidatedData,
  error,
  placeholder = "Inserisci l'indirizzo",
  className,
  requiredField = false
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue = useDebounce(value, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Carica i suggerimenti quando l'utente digita
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiRequest(
          "GET", 
          `/api/address-suggestions?q=${encodeURIComponent(debouncedValue)}`
        );
        const data = await response.json();
        
        // Verifica se c'è un errore di API o permessi
        if (data.error && (data.error.includes("403") || data.error.includes("REQUEST_DENIED") || data.error.includes("referer restrictions"))) {
          console.warn("API Google Maps non disponibile - suggerimenti disabilitati");
          setSuggestions([]);
          setIsOpen(false);
          return;
        }
        
        setSuggestions(data.suggestions || []);
        setIsOpen(data.suggestions && data.suggestions.length > 0);
      } catch (error) {
        console.error("Errore nel caricamento dei suggerimenti:", error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  // Valida l'indirizzo quando viene selezionato o confermato
  const validateAddress = async (addressToValidate: string) => {
    if (!addressToValidate) return;
    
    setIsValid(null);
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/validate-address", {
        address: addressToValidate
      });
      
      const data = await response.json();
      
      // Controlla se c'è un errore di permesso o API (403)
      if (data.error && (data.error.includes("403") || data.error.includes("REQUEST_DENIED") || data.error.includes("referer restrictions"))) {
        console.warn("API Google Maps non disponibile - validazione bypassata");
        
        // Consideriamo l'indirizzo valido quando le API non sono disponibili
        setIsValid(true);
        
        if (onValidatedData) {
          onValidatedData({
            isValid: true,
            formattedAddress: addressToValidate,
            // Lasciamo vuoti city, postcode e country, l'utente dovrà inserirli manualmente
          });
        }
        
        toast({
          title: "Indirizzo accettato",
          description: "Verifica manuale richiesta. Servizio di validazione indirizzi temporaneamente non disponibile.",
          variant: "default",
        });
        
        return;
      }
      
      // Gestione normale quando l'API funziona
      setIsValid(data.isValid);
      
      if (data.isValid && onValidatedData) {
        onValidatedData({
          isValid: true,
          formattedAddress: data.formattedAddress,
          city: data.city,
          postcode: data.postcode,
          country: data.country
        });
        
        // Aggiorna l'input con l'indirizzo formattato se disponibile
        if (data.formattedAddress) {
          onChange(data.formattedAddress);
        }
        
        toast({
          title: "Indirizzo valido",
          description: "L'indirizzo è stato verificato con successo.",
          variant: "default",
        });
      } else if (!data.isValid) {
        toast({
          title: "Indirizzo non valido",
          description: data.error || "L'indirizzo non è stato trovato. Verifica i dati inseriti.",
          variant: "destructive",
        });
        
        if (onValidatedData) {
          onValidatedData({ isValid: false });
        }
      }
    } catch (error) {
      console.error("Errore nella validazione dell'indirizzo:", error);
      
      // In caso di errori di rete o server, consideriamo l'indirizzo valido per non bloccare l'utente
      setIsValid(true);
      
      if (onValidatedData) {
        onValidatedData({ 
          isValid: true,
          formattedAddress: addressToValidate 
        });
      }
      
      toast({
        title: "Validazione non disponibile",
        description: "Si è verificato un errore durante la validazione. L'indirizzo è stato accettato ma potrebbe richiedere una verifica manuale.",
        variant: "default", // Usiamo default per un messaggio meno severo rispetto a destructive
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestisce la selezione di un suggerimento
  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setIsOpen(false);
    validateAddress(suggestion);
  };

  // Gestisce la validazione manuale dell'indirizzo
  const handleValidateClick = () => {
    validateAddress(value);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor="address" className="font-medium">
          {label} {requiredField && <span className="text-red-500">*</span>}
        </Label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            disabled={isLoading}
            onClick={handleValidateClick}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <MapPin className="h-3 w-3 mr-1" />
            )}
            Verifica
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center relative">
              <Input
                id="address"
                ref={inputRef}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  setIsValid(null);
                }}
                placeholder={placeholder}
                className={cn(
                  "pr-10",
                  error ? "border-red-300 focus-visible:ring-red-300" : ""
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setIsOpen(false);
                    validateAddress(value);
                  }
                }}
              />
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin absolute right-3 text-gray-400" />
              )}
              {!isLoading && isValid === true && (
                <CheckCircle className="h-4 w-4 absolute right-3 text-green-500" />
              )}
              {!isLoading && isValid === false && (
                <AlertCircle className="h-4 w-4 absolute right-3 text-red-500" />
              )}
            </div>
          </PopoverTrigger>
          
          <PopoverContent
            align="start"
            className="p-0 w-[var(--radix-popover-trigger-width)]"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {suggestions.length > 0 ? (
              <ul className="max-h-[300px] overflow-auto py-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 truncate"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 text-sm text-gray-500">
                {debouncedValue.length < 3 
                  ? "Digita almeno 3 caratteri per cercare" 
                  : "Nessun suggerimento trovato"}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      
      {isValid === true && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Indirizzo verificato
        </Badge>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}