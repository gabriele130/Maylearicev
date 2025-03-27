import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransportDocument, TransportFormData } from "@shared/schema";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { Eye, Printer, Trash2, FileText, XCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Link } from "wouter";
import FormPreview from "@/components/FormPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const safeFormData = (data: unknown): TransportFormData => {
    if (!data) return {} as TransportFormData;
    try {
      return data as TransportFormData;
    } catch (error) {
      console.error("Error casting formData:", error);
      return {} as TransportFormData;
    }
  };

  // Print document handler
  const handlePrint = () => {
    window.print();
  };

  // Format document creation date
  const formatDate = (dateValue: Date | string) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return format(date, "dd/MM/yyyy", { locale: it });
  };

  // Group documents by month
  const groupedDocuments = documents?.reduce((acc, document) => {
    const date = typeof document.createdAt === 'string' 
      ? new Date(document.createdAt) 
      : document.createdAt as Date;
    
    const monthYear = format(date, "MMMM yyyy", { locale: it });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(document);
    return acc;
  }, {} as Record<string, TransportDocument[]>) || {};

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Archivio Documenti</h1>
        <Button asChild variant="outline" className="flex items-center gap-1 text-primary">
          <Link href="/">
            <FileText className="h-4 w-4" />
            <span>Nuovo Documento</span>
          </Link>
        </Button>
      </div>
      
      {/* Dialog per visualizzare il documento */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto p-0">
            <DialogHeader className="p-4 border-b sticky top-0 z-10 bg-white">
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Documento MLD-{selectedDocument.documentNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handlePrint}
                    className="flex items-center gap-1"
                  >
                    <Printer className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Stampa</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setSelectedDocument(null)}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Chiudi</span>
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 sm:p-6">
              {selectedDocument.formData ? (
                <FormPreview formData={safeFormData(selectedDocument.formData)} />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Impossibile visualizzare i dati del documento.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
          <div className="flex items-center mb-4 gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <p>I documenti vengono conservati per 4 mesi dalla data di creazione.</p>
          </div>
          
          {Object.entries(groupedDocuments).map(([monthYear, monthDocuments]) => (
            <div key={monthYear} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-primary capitalize">{monthYear}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {monthDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gray-50 p-4 pb-2">
                      <CardTitle className="text-md flex justify-between items-center">
                        <Badge variant="outline" className="bg-white font-normal">
                          MLD-{doc.documentNumber}
                        </Badge>
                        <span className="text-sm font-normal text-gray-500">
                          {formatDate(doc.createdAt)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-600">Mittente:</p>
                        <p className="text-sm">{doc.senderName}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-600">Destinatario:</p>
                        <p className="text-sm">{doc.recipientName}</p>
                      </div>
                      {doc.packageContent && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-600">Contenuto:</p>
                          <p className="text-sm line-clamp-1">{doc.packageContent}</p>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="Visualizza"
                          onClick={() => setSelectedDocument(doc)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Visualizza</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="Stampa"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setTimeout(handlePrint, 100);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Printer className="h-4 w-4" />
                          <span className="hidden sm:inline">Stampa</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500 hover:text-red-700 flex items-center gap-1" 
                              title="Elimina"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Elimina</span>
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
      
      {/* Nota: gli stili di stampa sono definiti in index.css */}
    </div>
  );
}