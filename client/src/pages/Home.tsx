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
    profileName: "",
  });

  // Mutation for saving transport document
  const saveDocumentMutation = useMutation({
    mutationFn: async (data: TransportFormData) => {
      return apiRequest("/api/transport-documents", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Documento salvato",
        description: "Il documento di trasporto è stato salvato con successo.",
      });
      // Invalidate query cache to refresh any document lists
      queryClient.invalidateQueries({ queryKey: ['/api/transport-documents'] });
      // If we're saving sender profile, also refresh that list
      if (formData.saveSender) {
        queryClient.invalidateQueries({ queryKey: ['/api/sender-profiles'] });
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
    // Validate form data
    if (!formData.sender.name || !formData.recipient.name) {
      toast({
        title: "Dati incompleti",
        description: "Per favore, completa i campi obbligatori prima di salvare.",
        variant: "destructive",
      });
      return;
    }
    
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
      {/* Header */}
      <header className="bg-primary text-white shadow-md print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold">Maylea Logistic & Transport</h1>
          </div>
          <nav className="flex gap-3">
            <Button 
              variant="secondary" 
              className="text-primary" 
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Stampa Modulo
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSaveDocument}
              disabled={saveDocumentMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveDocumentMutation.isPending ? "Salvataggio..." : "Salva Documento"}
            </Button>
          </nav>
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
