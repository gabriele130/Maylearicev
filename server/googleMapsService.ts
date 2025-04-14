import { Client, GeocodeRequest, GeocodeResponse } from '@googlemaps/google-maps-services-js';

if (!process.env.GOOGLE_MAPS_API_KEY) {
  console.error("GOOGLE_MAPS_API_KEY non trovata nelle variabili d'ambiente");
}

const client = new Client({});

export interface AddressValidationResult {
  isValid: boolean;
  formattedAddress?: string;
  city?: string;
  postcode?: string;
  country?: string;
  error?: string;
}

export async function validateAddress(
  address: string, 
  city?: string, 
  postcode?: string, 
  country?: string
): Promise<AddressValidationResult> {
  try {
    // Costruisci l'indirizzo completo per una migliore precisione
    let searchAddress = address;
    if (city) searchAddress += `, ${city}`;
    if (postcode) searchAddress += `, ${postcode}`;
    if (country) searchAddress += `, ${country}`;
    
    const request: GeocodeRequest = {
      params: {
        address: searchAddress,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        language: 'it' // Preferenza per risultati in italiano
      }
    };

    const response = await client.geocode(request);
    
    // Controlla se sono stati trovati risultati
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      // Estrai i dati dai risultati
      const result = response.data.results[0];
      
      // Estrai i dettagli dell'indirizzo dai componenti
      let resultCity = '';
      let resultPostcode = '';
      let resultCountry = '';
      
      for (const component of result.address_components) {
        // Utilizziamo la tipizzazione corretta, trattando i tipi come stringhe generiche
        const types = component.types as string[];
        if (types.includes('locality') || types.includes('administrative_area_level_3')) {
          resultCity = component.long_name;
        }
        if (types.includes('postal_code')) {
          resultPostcode = component.long_name;
        }
        if (types.includes('country')) {
          resultCountry = component.long_name;
        }
      }
      
      return {
        isValid: true,
        formattedAddress: result.formatted_address,
        city: resultCity,
        postcode: resultPostcode,
        country: resultCountry
      };
    } else {
      // Nessun risultato trovato
      return {
        isValid: false,
        error: `Indirizzo non trovato: ${response.data.status}`
      };
    }
  } catch (error: any) {
    console.error('Errore durante la validazione dell\'indirizzo:', error);
    return {
      isValid: false,
      error: error.message || 'Errore sconosciuto durante la validazione dell\'indirizzo'
    };
  }
}

export async function suggestAddresses(query: string): Promise<string[]> {
  try {
    const request: GeocodeRequest = {
      params: {
        address: query,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        language: 'it'
      }
    };

    const response = await client.geocode(request);
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results.map(result => result.formatted_address);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Errore durante il suggerimento degli indirizzi:', error);
    return [];
  }
}