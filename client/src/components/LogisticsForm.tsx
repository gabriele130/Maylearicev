import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TransportFormData, transportFormSchema, SenderProfile } from "@shared/schema";

interface LogisticsFormProps {
  onFormDataChange: (data: TransportFormData) => void;
}

export default function LogisticsForm({ onFormDataChange }: LogisticsFormProps) {
  // State to store and manage sender profiles
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [saveSenderProfile, setSaveSenderProfile] = useState(false);
  
  // Load sender profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/sender-profiles");
        if (response.ok) {
          const profiles = await response.json();
          setSenderProfiles(profiles);
        }
      } catch (error) {
        console.error("Error loading sender profiles:", error);
      } finally {
        setLoadingProfiles(false);
      }
    };
    
    fetchProfiles();
  }, []);
  
  // Form setup
  const form = useForm<TransportFormData>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      sender: {
        name: "",
        address: "",
        city: "",
        postcode: "",
        phone: "",
        vat: "",
        email: "",
        profileName: "",
      },
      recipient: {
        name: "",
        address: "",
        city: "",
        postcode: "",
        phone: "",
        vat: "",
        email: "",
      },
      package: {
        count: 1,
        weight: 1.0,
        dimensions: "",
        content: "",
        shippingCost: 0,
        paymentMethod: "Contanti",
      },
      insurance: {
        value: 0,
        notes: "",
      },
      profileName: "",
    },
  });
  
  // Handle profile selection
  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId);
    
    if (profileId && profileId !== "new") {
      const selectedProfile = senderProfiles.find(
        (profile: SenderProfile) => profile.id.toString() === profileId
      );
      
      if (selectedProfile) {
        form.setValue("sender", {
          name: selectedProfile.name,
          address: selectedProfile.address,
          city: selectedProfile.city,
          postcode: selectedProfile.postcode,
          phone: selectedProfile.phone,
          vat: selectedProfile.vat || "",
          email: selectedProfile.email || "",
          profileName: selectedProfile.profileName || selectedProfile.name,
        });
      }
    }
  };
  
  // Handle saving a new sender profile
  const handleSaveSenderProfile = async () => {
    const senderData = form.getValues("sender");
    const profileName = form.getValues("profileName") || senderData.name;
    
    try {
      const response = await fetch("/api/sender-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...senderData,
          profileName,
        }),
      });
      
      if (response.ok) {
        const newProfile = await response.json();
        setSenderProfiles([...senderProfiles, newProfile]);
        setSaveSenderProfile(false);
        form.setValue("profileName", "");
        
        // Select the newly created profile
        setSelectedProfileId(newProfile.id.toString());
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  
  // Update preview when form changes
  const onFormChange = () => {
    // Get the current form values and pass them to the parent component
    const currentData = form.getValues();
    onFormDataChange(currentData);
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="pt-6">
        <Form {...form}>
          <form className="space-y-8">
            {/* Sender Profile Selection */}
            <div className="space-y-4">
              <h3 className="text-md font-medium border-b border-gray-200 pb-2">Profili Mittente</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <Select 
                  onValueChange={handleProfileSelect} 
                  value={selectedProfileId || ""}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Seleziona profilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuovo Profilo</SelectItem>
                    {senderProfiles.map((profile: SenderProfile) => (
                      <SelectItem key={profile.id} value={profile.id.toString()}>
                        {profile.profileName || profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="saveSenderProfile"
                    checked={saveSenderProfile}
                    onCheckedChange={(checked) => setSaveSenderProfile(!!checked)}
                  />
                  <label
                    htmlFor="saveSenderProfile"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Salva come nuovo profilo
                  </label>
                </div>
                
                {saveSenderProfile && (
                  <FormField
                    control={form.control}
                    name="profileName"
                    render={({ field }) => (
                      <FormItem className="flex-grow ml-2">
                        <FormControl>
                          <Input placeholder="Nome profilo" {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input type="email" {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input type="email" {...field} value={field.value || ''} />
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
                        <Input type="number" min={1} {...field} value={field.value || 1} />
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
                        <Input type="number" min={0.1} step={0.1} {...field} value={field.value || 0.1} />
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
                        <Input placeholder="L x A x P" {...field} value={field.value || ''} />
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
                        <Textarea rows={2} {...field} value={field.value || ''} />
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
                        <Input type="number" min={0} step={0.01} {...field} value={field.value || 0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="package.paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metodo di Pagamento</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "Contanti"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona metodo di pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Contanti">Contanti</SelectItem>
                          <SelectItem value="Carta">Carta</SelectItem>
                          <SelectItem value="Bonifico">Bonifico</SelectItem>
                          <SelectItem value="Contrassegno">Contrassegno</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input type="number" min={0} step={0.01} {...field} value={field.value || 0} />
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
                        <Textarea rows={2} {...field} value={field.value || ''} />
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
                  type="button"
                  onClick={onFormChange}
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