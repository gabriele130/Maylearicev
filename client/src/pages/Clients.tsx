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
      address: "",
      city: "",
      postcode: "",
      phone: "",
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

  // Create new sender profile
  const createMutation = useMutation({
    mutationFn: async (data: Omit<SenderProfile, "id">) => {
      return apiRequest('/api/sender-profiles', {
        method: 'POST',
        body: JSON.stringify(data),
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
  const onSubmit = (data: Omit<SenderProfile, "id">) => {
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
      address: profile.address,
      city: profile.city,
      postcode: profile.postcode,
      phone: profile.phone,
    });
    setIsAddDialogOpen(true);
  };

  // Open new profile dialog
  const handleAddNew = () => {
    setEditingProfile(null);
    form.reset({
      name: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {senderProfiles?.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{profile.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1 text-sm">
                  <p>{profile.address}</p>
                  <p>{profile.postcode} {profile.city}</p>
                  <p className="text-muted-foreground">Tel: {profile.phone}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Modifica Cliente" : "Aggiungi Nuovo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Annulla</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
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