import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { SenderProfile } from "@shared/schema";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { senderProfileSchema } from "@shared/schema";
import { Trash2, PencilLine, Plus } from "lucide-react";

export default function Clients() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SenderProfile | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form setup with validation
  const form = useForm({
    resolver: zodResolver(senderProfileSchema),
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

  // Fetch all sender profiles
  const {
    data: senderProfiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/api/sender-profiles'],
    queryFn: getQueryFn<SenderProfile[]>({ on401: "throw" }),
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

  // Create new sender profile
  const createMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Convert form data to expected API format
      const profileData = {
        ...data,
        vat: data.vat || null,
        email: data.email || null,
        createdAt: new Date()
      };
      
      return apiRequest('/api/sender-profiles', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sender-profiles'] });
      toast({
        title: "Cliente salvato",
        description: "Il cliente è stato aggiunto con successo.",
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

  // Delete sender profile
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/sender-profiles/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sender-profiles'] });
      toast({
        title: "Cliente eliminato",
        description: "Il cliente è stato rimosso con successo.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileFormData) => {
    if (editingProfile) {
      // Update profile mutation would go here
      setEditingProfile(null);
    } else {
      createMutation.mutate(data);
    }
  };

  // Open edit dialog with existing data
  const handleEdit = (profile: SenderProfile) => {
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

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Clienti</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nuovo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Errore nel caricamento dei clienti</p>
          </CardContent>
        </Card>
      ) : senderProfiles?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Nessun cliente salvato</p>
            <p className="text-gray-500 mb-4">Aggiungi il tuo primo cliente per utilizzarlo nei tuoi documenti di trasporto</p>
            <Button onClick={handleAddNew}>Aggiungi Cliente</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {senderProfiles?.map((profile) => (
            <Card key={profile.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span className="text-primary">{profile.name}</span>
                  <span className="text-xs bg-gray-100 rounded-full px-2 py-1">{profile.profileName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="space-y-1 text-sm">
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
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-end gap-2 pt-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8"
                  onClick={() => handleEdit(profile)}
                >
                  <PencilLine className="h-4 w-4 mr-1" /> Modifica
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-red-500 hover:text-red-700"
                  onClick={() => deleteMutation.mutate(profile.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Elimina
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent 
          className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" 
          aria-describedby="client-form-description"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Modifica Cliente" : "Aggiungi Nuovo Cliente"}
            </DialogTitle>
            <div className="text-sm text-muted-foreground" id="client-form-description">
              Inserisci i dettagli del cliente per salvarlo nel sistema
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
                            <Input placeholder="Numero di telefono" {...field} />
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
                          <FormLabel>Email (opzionale)</FormLabel>
                          <FormControl>
                            <Input placeholder="Indirizzo email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Dati fiscali */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-primary mb-2">Dati fiscali</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="vat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partita IVA (opzionale)</FormLabel>
                          <FormControl>
                            <Input placeholder="Partita IVA o Codice Fiscale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">Annulla</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createMutation.isPending && (
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                  )}
                  {editingProfile ? "Aggiorna" : "Salva"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}