import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransportDocument } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Eye, Printer, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Link } from "wouter";

export default function Archive() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

  // Fetch transport documents - documents are auto-deleted after 4 months
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['/api/transport-documents'],
    queryFn: getQueryFn<TransportDocument[]>({ on401: "throw" }),
  });

  // Format document creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: it });
  };

  // Group documents by month
  const groupedDocuments = documents?.reduce((acc, document) => {
    const date = new Date(document.createdAt);
    const monthYear = format(date, "MMMM yyyy", { locale: it });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(document);
    return acc;
  }, {} as Record<string, TransportDocument[]>) || {};

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Archivio Documenti</h1>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Errore nel caricamento dei documenti</p>
          </CardContent>
        </Card>
      ) : documents?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nessun documento trovato nell'archivio</p>
            <Button className="mt-4" asChild>
              <Link href="/">Crea Nuovo Documento</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-gray-500 mb-4">
            I documenti vengono conservati per 4 mesi dalla data di creazione.
          </p>
          
          {Object.entries(groupedDocuments).map(([monthYear, monthDocuments]) => (
            <div key={monthYear} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-primary">{monthYear}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {monthDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 p-4 pb-2">
                      <CardTitle className="text-md flex justify-between items-center">
                        <span>MLD-{doc.documentNumber}</span>
                        <span className="text-sm font-normal text-gray-500">
                          {formatDate(doc.createdAt)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <p className="text-sm font-semibold">Mittente:</p>
                        <p className="text-sm">{doc.senderName}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-semibold">Destinatario:</p>
                        <p className="text-sm">{doc.recipientName}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-semibold">Contenuto:</p>
                        <p className="text-sm line-clamp-1">{doc.packageContent}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button size="sm" variant="outline" title="Visualizza">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" title="Stampa">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" title="Elimina">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}