import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransportFormData } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface FormPreviewProps {
  formData: TransportFormData;
}

export default function FormPreview({ formData }: FormPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Generate random document number
  const documentId = Math.floor(Math.random() * 9000) + 1000;
  
  // Get current date formatted for the document
  const currentDate = format(new Date(), "dd/MM/yyyy", { locale: it });
  
  // Handle print functionality
  const handlePrint = useReactToPrint({
    documentTitle: `Documento_Trasporto_MLD-${documentId}`,
    // Use this function to return the reference to the printable content
    contentRef: printRef,
  });

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h2 className="text-xl font-semibold text-primary">Anteprima Modulo</h2>
          <Button
            onClick={() => handlePrint()}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Stampa
          </Button>
        </div>

        <div 
          ref={printRef}
          className="border border-gray-300 rounded-lg p-4 print-section"
        >
          {/* Company Copy */}
          <div className="border-b border-gray-400 pb-6 mb-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-primary text-white p-2 rounded">
                  <span className="font-bold text-lg">ML&T</span>
                </div>
                <div className="ml-2">
                  <h3 className="font-semibold text-primary">MAYLEA – Logistics & Transport</h3>
                  <p className="text-xs text-gray-600">C.T.D. SRL</p>
                  <p className="text-xs text-gray-600">Via Gonzaga 105 – Rosolini, Tel: 09311666849</p>
                  <p className="text-xs text-gray-600">Via Risorgimento 4/C – Modica, Tel: 09321882200</p>
                  <p className="text-xs text-gray-600">whatsapp: 331 3896381</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">COPIA AZIENDA</p>
                <p className="text-xs text-gray-600">Documento di Trasporto</p>
                <p className="text-xs font-medium">N. MLD-{documentId}</p>
                <p className="text-xs text-gray-600">Data: {currentDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Sender Info (Company Copy) */}
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">MITTENTE</h4>
                <p className="text-sm font-medium">{formData.sender.name || "Nome Mittente"}</p>
                <p className="text-xs">{formData.sender.address || "Via Esempio, 123"}</p>
                <p className="text-xs">{formData.sender.postcode || "12345"} {formData.sender.city || "Città"}</p>
                <p className="text-xs">Tel: {formData.sender.phone || "0123 456789"}</p>
              </div>

              {/* Recipient Info (Company Copy) */}
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">DESTINATARIO</h4>
                <p className="text-sm font-medium">{formData.recipient.name || "Nome Destinatario"}</p>
                <p className="text-xs">{formData.recipient.address || "Via Destinazione, 456"}</p>
                <p className="text-xs">{formData.recipient.postcode || "67890"} {formData.recipient.city || "Città Arrivo"}</p>
                <p className="text-xs">Tel: {formData.recipient.phone || "0123 987654"}</p>
              </div>
            </div>

            {/* Package Details (Company Copy) */}
            <div className="border border-gray-300 rounded p-2 mb-4">
              <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">DETTAGLI SPEDIZIONE</h4>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <p className="font-semibold">N. Colli</p>
                  <p>{formData.package.count || 1}</p>
                </div>
                <div>
                  <p className="font-semibold">Peso (kg)</p>
                  <p>{formData.package.weight?.toLocaleString('it-IT') || "10,5"}</p>
                </div>
                <div>
                  <p className="font-semibold">Dimensioni (cm)</p>
                  <p>{formData.package.dimensions || "30x20x15"}</p>
                </div>
              </div>
              <div className="text-xs">
                <p className="font-semibold">Contenuto</p>
                <p>{formData.package.content || "Descrizione del contenuto del pacco"}</p>
              </div>
            </div>

            {/* Insurance and Notes (Company Copy) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">ASSICURAZIONE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Valore Assicurato</p>
                    <p>€ {formData.insurance.value?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data Documento</p>
                    <p>{currentDate}</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">NOTE</h4>
                <p className="text-xs">{formData.insurance.notes || "Nessuna nota aggiuntiva"}</p>
              </div>
            </div>
            
            {/* Payment Method and Total (Company Copy) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">MODALITÀ DI PAGAMENTO</h4>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Contanti</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Carta</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Bonifico</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Contrassegno</span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">IMPORTO TOTALE SPEDIZIONE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Spedizione</p>
                    <p>€ {(formData.package.shippingCost || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Totale</p>
                    <p className="font-bold">€ {(formData.package.shippingCost || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Copy */}
          <div className="mb-4">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-primary text-white p-2 rounded">
                  <span className="font-bold text-lg">ML&T</span>
                </div>
                <div className="ml-2">
                  <h3 className="font-semibold text-primary">MAYLEA – Logistics & Transport</h3>
                  <p className="text-xs text-gray-600">C.T.D. SRL</p>
                  <p className="text-xs text-gray-600">Via Gonzaga 105 – Rosolini, Tel: 09311666849</p>
                  <p className="text-xs text-gray-600">Via Risorgimento 4/C – Modica, Tel: 09321882200</p>
                  <p className="text-xs text-gray-600">whatsapp: 331 3896381</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">COPIA CLIENTE</p>
                <p className="text-xs text-gray-600">Documento di Trasporto</p>
                <p className="text-xs font-medium">N. MLD-{documentId}</p>
                <p className="text-xs text-gray-600">Data: {currentDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Sender Info (Client Copy) */}
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">MITTENTE</h4>
                <p className="text-sm font-medium">{formData.sender.name || "Nome Mittente"}</p>
                <p className="text-xs">{formData.sender.address || "Via Esempio, 123"}</p>
                <p className="text-xs">{formData.sender.postcode || "12345"} {formData.sender.city || "Città"}</p>
                <p className="text-xs">Tel: {formData.sender.phone || "0123 456789"}</p>
              </div>

              {/* Recipient Info (Client Copy) */}
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">DESTINATARIO</h4>
                <p className="text-sm font-medium">{formData.recipient.name || "Nome Destinatario"}</p>
                <p className="text-xs">{formData.recipient.address || "Via Destinazione, 456"}</p>
                <p className="text-xs">{formData.recipient.postcode || "67890"} {formData.recipient.city || "Città Arrivo"}</p>
                <p className="text-xs">Tel: {formData.recipient.phone || "0123 987654"}</p>
              </div>
            </div>

            {/* Package Details (Client Copy) */}
            <div className="border border-gray-300 rounded p-2 mb-4">
              <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">DETTAGLI SPEDIZIONE</h4>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <p className="font-semibold">N. Colli</p>
                  <p>{formData.package.count || 1}</p>
                </div>
                <div>
                  <p className="font-semibold">Peso (kg)</p>
                  <p>{formData.package.weight?.toLocaleString('it-IT') || "10,5"}</p>
                </div>
                <div>
                  <p className="font-semibold">Dimensioni (cm)</p>
                  <p>{formData.package.dimensions || "30x20x15"}</p>
                </div>
              </div>
              <div className="text-xs">
                <p className="font-semibold">Contenuto</p>
                <p>{formData.package.content || "Descrizione del contenuto del pacco"}</p>
              </div>
            </div>

            {/* Insurance and Notes (Client Copy) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">ASSICURAZIONE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Valore Assicurato</p>
                    <p>€ {formData.insurance.value?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data Documento</p>
                    <p>{currentDate}</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">NOTE</h4>
                <p className="text-xs">{formData.insurance.notes || "Nessuna nota aggiuntiva"}</p>
              </div>
            </div>
            
            {/* Payment Method and Total (Client Copy) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">MODALITÀ DI PAGAMENTO</h4>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Contanti</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Carta</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Bonifico</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 border border-gray-500 rounded-sm mr-1"></div>
                    <span>Contrassegno</span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">IMPORTO TOTALE SPEDIZIONE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Spedizione</p>
                    <p>€ {(formData.package.shippingCost || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Totale</p>
                    <p className="font-bold">€ {(formData.package.shippingCost || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legal Disclaimer */}
            <div className="border border-gray-300 rounded p-2 mb-4">
              <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">LIMITAZIONI DI RESPONSABILITÀ</h4>
              <p className="text-[9px] text-gray-700 leading-tight">
                Il mittente dichiara di accettare le condizioni generali di trasporto affisse presso gli uffici Maylea Logistics & Transport. La responsabilità vettoriale è limitata 
                a 1 € al kg di merce trasportata moltiplicata per il peso lordo della merce danneggiata o smarrita (Art. 1696 c.c.). 
                Maggiore responsabilità potrà essere assunta dal vettore solo mediante specifica pattuizione scritta e previo pagamento del corrispettivo supplementare per la copertura assicurativa.
              </p>
            </div>
            
            {/* Recipient Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold">Per MAYLEA Logistics & Transport</p>
                <div className="mt-2 border-b border-gray-400 h-8"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}