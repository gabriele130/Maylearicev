import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransportDocument, TransportFormData } from "@shared/schema";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { Eye, Printer, Trash2, Share } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Link } from "wouter";
import FormPreview from "@/components/FormPreview";
import { useReactToPrint } from "react-to-print";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function Archive() {
  // State for selected document (for viewing/printing)
  const [selectedDocument, setSelectedDocument] = useState<TransportDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<TransportDocument | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch transport documents - documents are auto-deleted after 4 months
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['/api/transport-documents'],
    queryFn: getQueryFn<TransportDocument[]>({ on401: "throw" }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/transport-documents/${id}`, {
        method: 'DELETE'
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transport-documents'] });
      toast({
        title: "Documento eliminato",
        description: "Il documento è stato eliminato con successo.",
      });
      setDocumentToDelete(null);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare il documento. Riprova più tardi.",
        variant: "destructive",
      });
    }
  });

  // Cast formData to TransportFormData type
  const safeFormData = (data: any): TransportFormData => {
    if (!data) return {} as TransportFormData;
    return data as TransportFormData;
  };

  // Print document handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `MLD-${selectedDocument?.documentNumber || "documento"}`,
    onAfterPrint: () => setSelectedDocument(null),
  });

  // View document handler
  const handleViewDocument = (doc: TransportDocument) => {
    setSelectedDocument(doc);
  };

  // Format document creation date
  const formatDate = (dateValue: Date | string) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return format(date, "dd/MM/yyyy", { locale: it });
  };

  // Group documents by month
  const groupedDocuments = documents?.reduce((acc, document) => {
    const date = new Date(document.createdAt as unknown as string);
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
      
      {/* Modal per visualizzare il documento */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Documento MLD-{selectedDocument.documentNumber}</h2>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handlePrint}
                  className="flex items-center gap-1"
                >
                  <Printer className="h-4 w-4" /> Stampa
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedDocument(null)}
                >
                  Chiudi
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div ref={printRef}>
                {selectedDocument.formData && (
                  <FormPreview formData={safeFormData(selectedDocument.formData)} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Area stampa nascosta */}
      {selectedDocument && (
        <div className="hidden">
          <div ref={printRef}>
            {selectedDocument.formData && (
              <FormPreview formData={safeFormData(selectedDocument.formData)} />
            )}
          </div>
        </div>
      )}
      
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="Visualizza"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="Stampa"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setTimeout(handlePrint, 300);
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500 hover:text-red-700" 
                              title="Elimina"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questa azione non può essere annullata. Il documento verrà eliminato permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteMutation.mutate(doc.id)}
                              >
                                {deleteMutation.isPending ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full" />
                                ) : "Elimina"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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