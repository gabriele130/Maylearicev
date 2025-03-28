import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransportFormData } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Printer } from "lucide-react";
import logoPath from "../assets/Logo_def_MAYLEA_marrone_su_bianco__2_-removebg-preview.png";

interface FormPreviewProps {
  formData: TransportFormData;
}

export default function FormPreview({ formData }: FormPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Generate random document number
  const documentId = Math.floor(Math.random() * 9000) + 1000;
  
  // Get current date formatted for the document
  const currentDate = format(new Date(), "dd/MM/yyyy", { locale: it });
  
  // Funzione ottimizzata per la stampa su dispositivi mobili e desktop
  const handlePrint = () => {
    if (isMobile) {
      // Su mobile, creiamo una nuova finestra ottimizzata per la stampa
      const printContent = printRef.current?.outerHTML || '';
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Documento di Trasporto</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @page {
                  size: A4 portrait;
                  margin: 0;
                  padding: 0;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  font-family: Arial, Calibri, Roboto, sans-serif;
                  overflow: hidden;
                }
                .print-container {
                  transform: translateX(-50%) scale(0.99);
                  transform-origin: top center;
                  width: 210mm;
                  height: 297mm;
                  margin: 0;
                  padding: 0;
                  overflow: visible;
                  position: absolute;
                  top: 0;
                  left: 50%;
                }
                .print-section {
                  width: 210mm;
                  height: 297mm;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  flex-direction: column;
                  page-break-inside: avoid;
                  page-break-after: avoid;
                  overflow: visible;
                }
                .print-section > div:first-child {
                  position: relative;
                  height: 143mm;
                  max-height: 143mm;
                  padding: 2mm;
                  margin-bottom: 6mm;
                  border-bottom: 1px dashed #aaa;
                  overflow: hidden;
                }
                .print-section > div:last-child {
                  position: relative;
                  height: 143mm;
                  max-height: 143mm;
                  padding: 2mm;
                  overflow: hidden;
                }
                /* Testo dimensionato per leggibilità ottimale */
                .print-section {
                  font-size: 9pt;
                }
                .print-section h3 {
                  font-weight: 700;
                  line-height: 1.2;
                  font-size: 10pt;
                  margin: 0;
                }
                .print-section h4 {
                  font-weight: 700;
                  line-height: 1.2;
                  font-size: 9pt;
                  margin: 0;
                }
                .print-section p, 
                .print-section div {
                  line-height: 1.2;
                  margin: 0;
                  padding: 0;
                  text-align: left;
                }
              </style>
            </head>
            <body onload="window.print();window.setTimeout(window.close, 1000)">
              <div class="print-container">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      // Su desktop, utilizziamo il comando standard
      window.print();
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-center items-center mb-4 print:hidden print-hide">
          <Button
            id="print-button"
            onClick={handlePrint}
            className="bg-primary text-white hover:bg-primary/90 px-16 py-8 text-2xl font-bold rounded-lg"
            title="Stampa"
          >
            <Printer className="h-8 w-8 mr-3" />
            <span>STAMPA</span>
          </Button>
        </div>

        <div 
          ref={printRef}
          className="border border-gray-300 rounded-lg p-2 print-section text-[9pt] mt-2 w-full max-w-[700px] mx-auto"
        >
          {/* Company Copy */}
          <div className="border-b border-gray-400 pb-3 mb-3">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className="p-1 rounded">
                  <img 
                    src={logoPath}
                    alt="Maylea Logistics & Transport Logo"
                    className="h-8 w-auto" 
                  />
                </div>
                <div className="ml-2">
                  <h3 className="font-semibold text-primary text-[12px]">MAYLEA – Logistics & Transport</h3>
                  <p className="text-[9px] text-gray-700">C.T.D. SRL</p>
                  <p className="text-[9px] text-gray-700">Via Gonzaga 105 – Rosolini, Tel: 09311666849</p>
                  <p className="text-[9px] text-gray-700">Via Risorgimento 4/C – Modica, Tel: 09321882200</p>
                  <p className="text-[9px] text-gray-700">whatsapp: 331 3896381</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[10px]">COPIA AZIENDA</p>
                <p className="text-[9px] text-gray-700">Documento di Trasporto</p>
                <p className="text-[9px] font-medium">N. MLD-{documentId}</p>
                <p className="text-[9px] text-gray-700">Data: {currentDate}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              {/* Sender Info (Company Copy) */}
              <div className="border border-gray-300 rounded p-2 flex-1">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">MITTENTE</h4>
                <p className="text-[10px] font-medium">{formData.sender.name || "Nome Mittente"}</p>
                <p className="text-[9px]">{formData.sender.address || "Via Esempio, 123"}</p>
                <p className="text-[9px]">{formData.sender.postcode || "12345"} {formData.sender.city || "Città"}</p>
                <p className="text-[9px]">Tel: {formData.sender.phone || "0123 456789"}</p>
              </div>

              {/* Recipient Info (Company Copy) */}
              <div className="border border-gray-300 rounded p-2 flex-1">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">DESTINATARIO</h4>
                <p className="text-[10px] font-medium">{formData.recipient.name || "Nome Destinatario"}</p>
                <p className="text-[9px]">{formData.recipient.address || "Via Destinazione, 456"}</p>
                <p className="text-[9px]">{formData.recipient.postcode || "67890"} {formData.recipient.city || "Città Arrivo"}</p>
                <p className="text-[9px]">Tel: {formData.recipient.phone || "0123 987654"}</p>
              </div>
            </div>

            {/* Package Details and Insurance (Company Copy) */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">DETTAGLI SPEDIZIONE</h4>
                <div className="grid grid-cols-3 gap-1 text-[9px] mb-1">
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
                <div className="text-[9px]">
                  <p className="font-semibold">Contenuto</p>
                  <p>{formData.package.content || "Descrizione del contenuto del pacco"}</p>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">ASSICURAZIONE</h4>
                <div className="grid grid-cols-2 gap-1 text-[9px] mb-1">
                  <div>
                    <p className="font-semibold">Valore Assicurato</p>
                    <p>€ {formData.insurance.value?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data Documento</p>
                    <p>{currentDate}</p>
                  </div>
                </div>
                <div className="text-[9px]">
                  <p className="font-semibold">Note</p>
                  <p>{formData.insurance.notes || "Nessuna nota aggiuntiva"}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Method and Total (Company Copy) */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">MODALITÀ DI PAGAMENTO</h4>
                <div className="flex flex-wrap gap-1 text-[9px] mt-1">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Contanti' ? 'bg-black' : ''}`}></div>
                    <span>Contanti</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Carta' ? 'bg-black' : ''}`}></div>
                    <span>Carta</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Bonifico' ? 'bg-black' : ''}`}></div>
                    <span>Bonifico</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Contrassegno' ? 'bg-black' : ''}`}></div>
                    <span>Contrassegno</span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">IMPORTO TOTALE SPEDIZIONE</h4>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
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

            {/* Disclaimer and Signature (Company Copy) */}
            <div className="grid grid-cols-2 gap-2 mb-1">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">LIMITAZIONI DI RESPONSABILITÀ</h4>
                <p className="text-[8px] text-gray-700 leading-tight">
                  Il mittente dichiara di accettare le condizioni generali di trasporto di MAYLEA – Logistics & Transport e solleva l'azienda da ogni responsabilità per smarrimento, danneggiamento, ritardo o eventi non direttamente imputabili alla stessa. In caso di merci assicurate, il rimborso sarà effettuato solo previa verifica delle condizioni e nei limiti indicati.
                </p>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">FIRMA PER ACCETTAZIONE</h4>
                <div className="flex flex-col justify-between h-[50px]">
                  <p className="text-[8px] text-gray-700 mb-1">Il mittente riconosce e accetta le condizioni di trasporto.</p>
                  <div className="border-t border-gray-400 pt-1 mt-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Copy */}
          <div className="mb-1">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className="p-1 rounded">
                  <img 
                    src={logoPath}
                    alt="Maylea Logistics & Transport Logo"
                    className="h-8 w-auto" 
                  />
                </div>
                <div className="ml-2">
                  <h3 className="font-semibold text-primary text-[12px]">MAYLEA – Logistics & Transport</h3>
                  <p className="text-[9px] text-gray-700">C.T.D. SRL</p>
                  <p className="text-[9px] text-gray-700">Via Gonzaga 105 – Rosolini, Tel: 09311666849</p>
                  <p className="text-[9px] text-gray-700">Via Risorgimento 4/C – Modica, Tel: 09321882200</p>
                  <p className="text-[9px] text-gray-700">whatsapp: 331 3896381</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[10px]">COPIA CLIENTE</p>
                <p className="text-[9px] text-gray-700">Documento di Trasporto</p>
                <p className="text-[9px] font-medium">N. MLD-{documentId}</p>
                <p className="text-[9px] text-gray-700">Data: {currentDate}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              {/* Sender Info (Client Copy) */}
              <div className="border border-gray-300 rounded p-2 flex-1">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">MITTENTE</h4>
                <p className="text-[10px] font-medium">{formData.sender.name || "Nome Mittente"}</p>
                <p className="text-[9px]">{formData.sender.address || "Via Esempio, 123"}</p>
                <p className="text-[9px]">{formData.sender.postcode || "12345"} {formData.sender.city || "Città"}</p>
                <p className="text-[9px]">Tel: {formData.sender.phone || "0123 456789"}</p>
              </div>

              {/* Recipient Info (Client Copy) */}
              <div className="border border-gray-300 rounded p-2 flex-1">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">DESTINATARIO</h4>
                <p className="text-[10px] font-medium">{formData.recipient.name || "Nome Destinatario"}</p>
                <p className="text-[9px]">{formData.recipient.address || "Via Destinazione, 456"}</p>
                <p className="text-[9px]">{formData.recipient.postcode || "67890"} {formData.recipient.city || "Città Arrivo"}</p>
                <p className="text-[9px]">Tel: {formData.recipient.phone || "0123 987654"}</p>
              </div>
            </div>

            {/* Package Details and Insurance (Client Copy) */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">DETTAGLI SPEDIZIONE</h4>
                <div className="grid grid-cols-3 gap-1 text-[9px] mb-1">
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
                <div className="text-[9px]">
                  <p className="font-semibold">Contenuto</p>
                  <p>{formData.package.content || "Descrizione del contenuto del pacco"}</p>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">ASSICURAZIONE</h4>
                <div className="grid grid-cols-2 gap-1 text-[9px] mb-1">
                  <div>
                    <p className="font-semibold">Valore Assicurato</p>
                    <p>€ {formData.insurance.value?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data Documento</p>
                    <p>{currentDate}</p>
                  </div>
                </div>
                <div className="text-[9px]">
                  <p className="font-semibold">Note</p>
                  <p>{formData.insurance.notes || "Nessuna nota aggiuntiva"}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Method and Total (Client Copy) */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">MODALITÀ DI PAGAMENTO</h4>
                <div className="flex flex-wrap gap-1 text-[9px] mt-1">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Contanti' ? 'bg-black' : ''}`}></div>
                    <span>Contanti</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Carta' ? 'bg-black' : ''}`}></div>
                    <span>Carta</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Bonifico' ? 'bg-black' : ''}`}></div>
                    <span>Bonifico</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 border border-gray-500 rounded-sm mr-1 ${formData.package.paymentMethod === 'Contrassegno' ? 'bg-black' : ''}`}></div>
                    <span>Contrassegno</span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">IMPORTO TOTALE SPEDIZIONE</h4>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
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

            {/* Disclaimer and Signature (Client Copy) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">LIMITAZIONI DI RESPONSABILITÀ</h4>
                <p className="text-[8px] text-gray-700 leading-tight">
                  Il mittente dichiara di accettare le condizioni generali di trasporto di MAYLEA – Logistics & Transport e solleva l'azienda da ogni responsabilità per smarrimento, danneggiamento, ritardo o eventi non direttamente imputabili alla stessa. In caso di merci assicurate, il rimborso sarà effettuato solo previa verifica delle condizioni e nei limiti indicati.
                </p>
              </div>
              <div className="border border-gray-300 rounded p-2">
                <h4 className="text-[9px] font-semibold bg-gray-100 -mt-2 -mx-2 px-2 py-1 mb-1">FIRMA PER ACCETTAZIONE</h4>
                <div className="flex flex-col justify-between h-[50px]">
                  <p className="text-[8px] text-gray-700 mb-1">Il mittente riconosce e accetta le condizioni di trasporto.</p>
                  <div className="border-t border-gray-400 pt-1 mt-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}