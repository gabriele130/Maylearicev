import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { transportFormSchema, type TransportFormData, type SenderProfile } from "@shared/schema";

interface LogisticsFormProps {
  onFormDataChange: (data: TransportFormData) => void;
}

export default function LogisticsForm({ onFormDataChange }: LogisticsFormProps) {
  const { toast } = useToast();
  const [saveSenderProfile, setSaveSenderProfile] = useState(false);

  // Get saved sender profiles
  const { data: senderProfiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['/api/sender-profiles'],
  });

  // Create new sender profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async (profile: Omit<SenderProfile, "id" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/sender-profiles", profile);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profilo salvato",
        description: "Il profilo mittente è stato salvato con successo.",
      });
      // Refresh profiles list
      queryClient.invalidateQueries({ queryKey: ['/api/sender-profiles'] });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Impossibile salvare il profilo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Initialize form with default values
  const form = useForm<TransportFormData>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
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
      },
      insurance: {
        value: 0,
        notes: "",
      },
      saveSender: false,
      profileName: "",
    },
  });

  // Update preview when form changes
  const onFormChange = form.handleSubmit((data) => {
    onFormDataChange(data);
  });

  // Handle loading saved profile
  const handleLoadProfile = (profileId: string) => {
    if (!profileId) return;
    
    const selectedProfile = senderProfiles.find(
      (profile: SenderProfile) => profile.id.toString() === profileId
    );
    
    if (selectedProfile) {
      form.setValue("sender", {
        ...selectedProfile,
        profileName: selectedProfile.profileName || "",
      });
      
      // Trigger form update to refresh preview
      onFormChange();
      
      toast({
        title: "Profilo caricato",
        description: `Il profilo '${selectedProfile.profileName}' è stato caricato.`,
      });
    }
  };

  // Handle saving sender profile
  const handleSaveSenderProfile = () => {
    const senderData = form.getValues("sender");
    const profileName = form.getValues("profileName");
    
    if (!profileName) {
      toast({
        title: "Nome profilo mancante",
        description: "Per favore inserisci un nome per questo profilo",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all required sender fields are filled
    if (!senderData.name || !senderData.address || !senderData.city || 
        !senderData.postcode || !senderData.phone) {
      toast({
        title: "Dati incompleti",
        description: "Per favore completa tutti i campi obbligatori del mittente",
        variant: "destructive",
      });
      return;
    }
    
    // Create profile object
    const profileData = {
      ...senderData,
      profileName,
    };
    
    // Save profile
    createProfileMutation.mutate(profileData);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Inserimento Dati di Trasporto</h2>
        
        <Form {...form}>
          <form onChange={onFormChange} className="space-y-6">
            {/* Saved Profiles Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-md font-medium">Profili Mittente Salvati:</h3>
                
                <Select onValueChange={handleLoadProfile}>
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Seleziona un profilo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProfiles ? (
                      <SelectItem value="loading" disabled>Caricamento...</SelectItem>
                    ) : senderProfiles.length === 0 ? (
                      <SelectItem value="empty" disabled>Nessun profilo salvato</SelectItem>
                    ) : (
                      senderProfiles.map((profile: SenderProfile) => (
                        <SelectItem key={profile.id} value={profile.id.toString()}>
                          {profile.profileName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                <Button
                  type="button"
                  onClick={() => handleLoadProfile(form.getValues("sender.id")?.toString() || "")}
                  className="bg-primary text-white px-3 py-2 hover:bg-primary/90"
                >
                  Carica
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="save-sender"
                  checked={saveSenderProfile}
                  onCheckedChange={(checked) => {
                    setSaveSenderProfile(!!checked);
                    form.setValue("saveSender", !!checked);
                  }}
                />
                <label htmlFor="save-sender" className="text-sm">Salva questo mittente per uso futuro</label>
                
                {saveSenderProfile && (
                  <FormField
                    control={form.control}
                    name="profileName"
                    render={({ field }) => (
                      <FormItem className="flex-grow ml-2">
                        <FormControl>
                          <Input placeholder="Nome profilo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {saveSenderProfile && (
                  <Button
                    type="button"
                    onClick={handleSaveSenderProfile}
                    variant="outline"
                    size="sm"
                  >
                    Salva Profilo
                  </Button>
                )}
              </div>
            </div>

            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium border-b border-gray-200 pb-2">Dati Mittente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sender.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Ragione Sociale *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sender.vat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.IVA/Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sender.address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Indirizzo *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sender.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sender.postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sender.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sender.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Recipient Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium border-b border-gray-200 pb-2">Dati Destinatario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recipient.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Ragione Sociale *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient.vat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.IVA/Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient.address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Indirizzo *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient.postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recipient.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Package Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium border-b border-gray-200 pb-2">Dettagli Spedizione</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="package.count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero Colli *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="package.weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg) *</FormLabel>
                      <FormControl>
                        <Input type="number" min={0.1} step={0.1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="package.dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensioni (cm)</FormLabel>
                      <FormControl>
                        <Input placeholder="L x A x P" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="package.content"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>Descrizione Contenuto *</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="package.shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo Spedizione (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Insurance and Notes */}
            <div className="space-y-4">
              <h3 className="text-md font-medium border-b border-gray-200 pb-2">Assicurazione e Note</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="insurance.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valore Assicurato (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                

                
                <FormField
                  control={form.control}
                  name="insurance.notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Note Aggiuntive</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">* Campi obbligatori</p>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6"
                >
                  Aggiorna Anteprima
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
