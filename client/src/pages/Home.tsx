import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogisticsForm from "@/components/LogisticsForm";
import FormPreview from "@/components/FormPreview";
import { useReactToPrint } from "react-to-print";
import { TransportFormData } from "@shared/schema";

export default function Home() {
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
    },
    insurance: {
      value: 0,
      deliveryDate: "",
      notes: "",
    },
    saveSender: false,
    profileName: "",
  });

  const handlePrint = useReactToPrint({
    content: () => document.getElementById('print-container') as HTMLElement,
    documentTitle: "Documento_Trasporto",
  });

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
          <nav>
            <Button 
              variant="secondary" 
              className="text-primary" 
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Stampa Modulo
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
