import { useState } from "react";
import { Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogisticsForm from "@/components/LogisticsForm";
import FormPreview from "@/components/FormPreview";
import { TransportFormData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TransportFormData>({
    sender: {
      profileName: "",
      name: "",
      vat: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
      email: "",
    },
    recipient: {
      profileName: "",
      name: "",
      vat: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
      email: "",
    },
    package: {
      count: 1,
      weight: 0.1,
      dimensions: "",
      content: "",
      shippingCost: 0,
      paymentMethod: "Contanti",
    },
    insurance: {
      value: 0,
      notes: "",
    },
    saveSender: false,
    saveRecipient: false,
    profileName: "",
    recipientProfileName: "",
  });

  // Mutation for saving transport document
  const saveDocumentMutation = useMutation({
    mutationFn: async (data: TransportFormData) => {
      return apiRequest("POST", "/api/transport-documents", data);
    },
    onSuccess: () => {
      toast({
        title: "Documento salvato",
        description: "Il documento di trasporto è stato salvato con successo.",
      });
      // Invalidate query cache to refresh any document lists
      queryClient.invalidateQueries({ queryKey: ['/api/transport-documents'] });
      // If we're saving sender/recipient profile, also refresh those lists
      if (formData.saveSender) {
        queryClient.invalidateQueries({ queryKey: ['/api/sender-profiles'] });
      }
      if (formData.saveRecipient) {
        queryClient.invalidateQueries({ queryKey: ['/api/recipient-profiles'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Si è verificato un errore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveDocument = () => {
    // Validate form data - controllo più completo dei campi obbligatori
    const errors = [];
    
    // Controllo campi mittente
    if (!formData.sender.name) errors.push("Nome mittente");
    if (!formData.sender.address) errors.push("Indirizzo mittente");
    if (!formData.sender.city) errors.push("Città mittente");
    if (!formData.sender.postcode) errors.push("CAP mittente");
    if (!formData.sender.phone) errors.push("Telefono mittente");
    
    // Controllo campi destinatario
    if (!formData.recipient.name) errors.push("Nome destinatario");
    if (!formData.recipient.address) errors.push("Indirizzo destinatario");
    if (!formData.recipient.city) errors.push("Città destinatario");
    if (!formData.recipient.postcode) errors.push("CAP destinatario");
    if (!formData.recipient.phone) errors.push("Telefono destinatario");
    
    // Controllo campi pacco
    if (!formData.package.content) errors.push("Descrizione contenuto");
    
    if (errors.length > 0) {
      toast({
        title: "Campi obbligatori mancanti",
        description: `Completa i seguenti campi: ${errors.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    // Log what we're trying to save for debugging
    console.log("Tentativo di salvataggio documento:", JSON.stringify(formData));
    
    // Save the document
    saveDocumentMutation.mutate(formData);
  };

  // Simple print function using window.print()
  const handlePrint = () => {
    window.print();
  };

  const handleFormDataChange = (data: TransportFormData) => {
    setFormData(data);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Mobile optimized */}
      <header className="bg-primary text-white shadow-md print:hidden">
        <div className="container mx-auto px-2 py-3 md:px-4 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="hidden md:flex md:items-center">
              <h1 className="text-xl md:text-2xl font-semibold">Maylea Logistic & Transport</h1>
            </div>
            <nav className="flex flex-wrap justify-center w-full md:w-auto gap-2 md:gap-3">
              <Button 
                variant="secondary" 
                className="text-primary flex-1 md:flex-none min-w-[140px] h-12 md:h-auto px-3 rounded-lg" 
                onClick={handlePrint}
              >
                <Printer className="md:mr-2 h-5 w-5 md:h-4 md:w-4" />
                <span className="ml-2 text-sm font-medium">Stampa</span>
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none min-w-[140px] h-12 md:h-auto px-3 rounded-lg"
                onClick={handleSaveDocument}
                disabled={saveDocumentMutation.isPending}
              >
                <Save className="md:mr-2 h-5 w-5 md:h-4 md:w-4" />
                <span className="ml-2 text-sm font-medium">
                  {saveDocumentMutation.isPending ? "Salvataggio..." : "Salva"}
                </span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="print:hidden">
            <LogisticsForm onFormDataChange={handleFormDataChange} />
          </div>

          {/* Preview Section */}
          <div id="print-container">
            <FormPreview formData={formData} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8 print:hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© {new Date().getFullYear()} Maylea Logistic & Transport - Tutti i diritti riservati</p>
            </div>
            <div>
              <p className="text-sm">Assistenza: supporto@maylealt.com | Tel: +39 0123 456789</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
