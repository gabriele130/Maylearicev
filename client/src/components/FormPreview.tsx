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
  
  // Get current date
  const currentDate = format(new Date(), "dd/MM/yyyy", { locale: it });
  
  // Format delivery date if present
  const deliveryDate = formData.insurance.deliveryDate 
    ? format(new Date(formData.insurance.deliveryDate), "dd/MM/yyyy", { locale: it })
    : "";
  
  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Documento_Trasporto_MLD-${documentId}`,
  });

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h2 className="text-xl font-semibold text-primary">Anteprima Modulo</h2>
          <Button
            onClick={handlePrint}
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
                  <h3 className="font-semibold text-primary">Maylea Logistic & Transport</h3>
                  <p className="text-xs text-gray-600">P.IVA: 12345678901 | Tel: +39 0123 456789</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">ASSICURAZIONE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Valore Assicurato</p>
                    <p>€ {formData.insurance.value?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Consegna Prevista</p>
                    <p>{deliveryDate || "15/11/2023"}</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">NOTE</h4>
                <p className="text-xs">{formData.insurance.notes || "Nessuna nota aggiuntiva"}</p>
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
                  <h3 className="font-semibold text-primary">Maylea Logistic & Transport</h3>
                  <p className="text-xs text-gray-600">P.IVA: 12345678901 | Tel: +39 0123 456789</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">ASSICURAZIONE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Valore Assicurato</p>
                    <p>€ {formData.insurance.value?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Consegna Prevista</p>
                    <p>{deliveryDate || "15/11/2023"}</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-xs font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-2">NOTE</h4>
                <p className="text-xs">{formData.insurance.notes || "Nessuna nota aggiuntiva"}</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border-t border-gray-300 pt-2">
                <p className="text-xs text-center">Firma Mittente</p>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-xs text-center">Firma Destinatario</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
