import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecipientProfile, TransportDocument } from "@shared/schema";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { recipientProfileSchema } from "@shared/schema";
import { Trash2, PencilLine, Plus, FileText, BarChart3, TrendingUp, Euro } from "lucide-react";

export default function Recipients() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<RecipientProfile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<RecipientProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form setup with validation
  const form = useForm({
    resolver: zodResolver(recipientProfileSchema),
    defaultValues: {
      name: "",
      profileName: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
      vat: "",
      email: "",
    },
  });

  // Fetch all recipient profiles
  const {
    data: recipientProfiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/api/recipient-profiles'],
    queryFn: getQueryFn<RecipientProfile[]>({ on401: "throw" }),
  });

  // Define type for form data
  type ProfileFormData = {
    name: string;
    profileName: string;
    address: string;
    city: string;
    postcode: string;
    phone: string;
    vat: string;
    email: string;
  };

  // Create new recipient profile
  const createMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Preparazione dei dati per la richiesta API - Rimuoviamo createdAt perché verrà gestito dal server
      const profileData = {
        ...data,
        vat: data.vat && data.vat.trim() !== '' ? data.vat : null,
        email: data.email && data.email.trim() !== '' ? data.email : null
      };
      
      console.log("Sending profile data:", profileData);
      
      return apiRequest('/api/recipient-profiles', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipient-profiles'] });
      toast({
        title: "Destinatario salvato",
        description: "Il destinatario è stato aggiunto con successo.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    },
  });

  // Delete recipient profile
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/recipient-profiles/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipient-profiles'] });
      toast({
        title: "Destinatario eliminato",
        description: "Il destinatario è stato rimosso con successo.",
      });
    },
    onError: (error: any) => {
      // Se il profilo non è trovato (404), è probabilmente già stato eliminato
      // quindi non mostriamo un errore ma aggiorniamo la lista
      if (error?.response?.status === 404) {
        queryClient.invalidateQueries({ queryKey: ['/api/recipient-profiles'] });
        return;
      }
      
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    },
  });

  // Update recipient profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number, profileData: ProfileFormData }) => {
      // Assicurati che i campi opzionali siano null se non presenti
      const profileData = {
        ...data.profileData,
        vat: data.profileData.vat && data.profileData.vat.trim() !== '' ? data.profileData.vat : null,
        email: data.profileData.email && data.profileData.email.trim() !== '' ? data.profileData.email : null
      };
      
      return apiRequest(`/api/recipient-profiles/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipient-profiles'] });
      toast({
        title: "Destinatario aggiornato",
        description: "Il destinatario è stato aggiornato con successo.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento. Riprova.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileFormData) => {
    if (editingProfile) {
      updateMutation.mutate({ 
        id: editingProfile.id, 
        profileData: data 
      });
      setEditingProfile(null);
    } else {
      createMutation.mutate(data);
    }
  };

  // Open edit dialog with existing data
  const handleEdit = (profile: RecipientProfile) => {
    setEditingProfile(profile);
    form.reset({
      name: profile.name,
      profileName: profile.profileName,
      address: profile.address,
      city: profile.city,
      postcode: profile.postcode,
      phone: profile.phone,
      vat: profile.vat || "",
      email: profile.email || "",
    });
    setIsAddDialogOpen(true);
  };

  // Open new profile dialog
  const handleAddNew = () => {
    setEditingProfile(null);
    form.reset({
      name: "",
      profileName: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
      vat: "",
      email: "",
    });
    setIsAddDialogOpen(true);
  };
  
  // Funzione per aprire la finestra di conferma eliminazione
  const handleConfirmDelete = (profile: RecipientProfile) => {
    setProfileToDelete(profile);
    setIsDeleteDialogOpen(true);
  };
  
  // Funzione per eseguire l'eliminazione dopo la conferma
  const handleDelete = () => {
    if (profileToDelete) {
      deleteMutation.mutate(profileToDelete.id);
      setIsDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Destinatari</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nuovo Destinatario
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Errore nel caricamento dei destinatari</p>
          </CardContent>
        </Card>
      ) : recipientProfiles?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Nessun destinatario salvato</p>
            <p className="text-gray-500 mb-4">Aggiungi il tuo primo destinatario per utilizzarlo nei tuoi documenti di trasporto</p>
            <Button onClick={handleAddNew}>Aggiungi Destinatario</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipientProfiles?.map((profile) => (
            <RecipientProfileCard 
              key={profile.id} 
              profile={profile} 
              onEdit={handleEdit} 
              onDelete={handleConfirmDelete} 
            />
          ))}
        </div>
      )}

      {/* Add/Edit Recipient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent 
          className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" 
          aria-describedby="client-form-description"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Modifica Destinatario" : "Aggiungi Nuovo Destinatario"}
            </DialogTitle>
            <div className="text-sm text-muted-foreground" id="client-form-description">
              Inserisci i dettagli del destinatario per salvarlo nel sistema
            </div>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4 py-2">
                {/* Dati principali */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-primary mb-2">Dati principali</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome / Azienda</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome o ragione sociale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profileName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome del profilo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome identificativo del profilo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Indirizzo */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-primary mb-2">Indirizzo</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indirizzo</FormLabel>
                          <FormControl>
                            <Input placeholder="Via e numero civico" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CAP</FormLabel>
                            <FormControl>
                              <Input placeholder="00000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Città</FormLabel>
                            <FormControl>
                              <Input placeholder="Città" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contatti */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-primary mb-2">Contatti</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Numero di telefono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Indirizzo email" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Dati fiscali */}
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2">Dati fiscali</h3>
                  <FormField
                    control={form.control}
                    name="vat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>P.IVA / Codice Fiscale</FormLabel>
                        <FormControl>
                          <Input placeholder="Partita IVA o Codice Fiscale" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Annulla</Button>
                </DialogClose>
                <Button type="submit">Salva</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo destinatario? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProfileToDelete(null)}>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Componente per la card del profilo destinatario con statistiche e transazioni
interface RecipientProfileCardProps {
  profile: RecipientProfile;
  onEdit: (profile: RecipientProfile) => void;
  onDelete: (profile: RecipientProfile) => void;
}

function RecipientProfileCard({ profile, onEdit, onDelete }: RecipientProfileCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1year");
  
  // Fetch transactions for this recipient
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: [`/api/recipient-profiles/${profile.id}/transactions`],
    queryFn: getQueryFn<TransportDocument[]>({ on401: "throw" }),
  });
  
  // Fetch financials for this recipient
  const { data: financials, isLoading: financialsLoading } = useQuery({
    queryKey: [`/api/recipient-profiles/${profile.id}/financials`, selectedPeriod],
    queryFn: async ({ queryKey }) => {
      const [_, period] = queryKey;
      const response = await fetch(`/api/recipient-profiles/${profile.id}/financials?period=${period}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  return (
    <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-start">
          <span className="text-primary">{profile.name}</span>
          <span className="text-xs bg-gray-100 rounded-full px-2 py-1">{profile.profileName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0 pt-0">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="transactions">
              <FileText className="h-4 w-4 mr-1" /> Transazioni
            </TabsTrigger>
            <TabsTrigger value="financials">
              <Euro className="h-4 w-4 mr-1" /> Finanza
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-1 text-sm">
            <div className="flex items-start gap-1">
              <div className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div>
                <p>{profile.address}</p>
                <p>{profile.postcode} {profile.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </div>
              <p className="text-muted-foreground">{profile.phone}</p>
            </div>
            {profile.email && (
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-xs truncate">{profile.email}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="transactions">
            {transactionsLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="max-h-[200px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Mittente</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.documentNumber}</TableCell>
                        <TableCell>{formatDate(doc.createdAt.toString())}</TableCell>
                        <TableCell className="truncate">{doc.senderName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground p-4">
                Nessuna transazione trovata
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="financials">
            <div className="space-y-2">
              <div className="w-full">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Ultimi 30 giorni</SelectItem>
                    <SelectItem value="90days">Ultimi 90 giorni</SelectItem>
                    <SelectItem value="6months">Ultimi 6 mesi</SelectItem>
                    <SelectItem value="1year">Ultimo anno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {financialsLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : financials ? (
                <div className="space-y-2 py-2">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(financials.startDate)} - {formatDate(financials.endDate)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs font-medium text-muted-foreground">Totale</div>
                        <div className="text-lg font-semibold text-primary">{formatCurrency(financials.totalAmount)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs font-medium text-muted-foreground">Spedizioni</div>
                        <div className="text-lg font-semibold">{financials.count}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground p-4">
                  Nessun dato finanziario trovato
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8"
          onClick={() => onEdit(profile)}
        >
          <PencilLine className="h-4 w-4 mr-1" /> Modifica
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 text-red-500 hover:text-red-700"
          onClick={() => onDelete(profile)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Elimina
        </Button>
      </CardFooter>
    </Card>
  );
}