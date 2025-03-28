import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, subDays } from "date-fns";
import { it } from "date-fns/locale";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Euro, ChevronDown, ChevronUp, Truck, Map, CreditCard } from "lucide-react";

type PeriodOption = "7days" | "30days" | "90days" | "1year";

type RevenueStats = {
  totalAmount: number;
  count: number;
};

type DailyStats = RevenueStats & {
  date: string;
};

type PeriodStats = RevenueStats & {
  startDate: string;
  endDate: string;
  period?: string;
};

type TrendPoint = {
  date: string;
  totalAmount: number;
  count: number;
};

type PaymentMethodStat = {
  paymentMethod: string;
  totalAmount: number;
  count: number;
};

type PaymentMethodStats = {
  period: string;
  startDate: string;
  endDate: string;
  paymentMethods: PaymentMethodStat[];
};

type DestinationStat = {
  destination: string;
  totalAmount: number;
  count: number;
};

type DestinationStats = {
  period: string;
  startDate: string;
  endDate: string;
  destinations: DestinationStat[];
};

// Colori per i grafici
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function IncomeStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("30days");
  const [activeTab, setActiveTab] = useState("summary");
  const [compareMode, setCompareMode] = useState(false);
  
  // Dati giornalieri (oggi)
  const today = new Date();
  const { data: dailyData } = useQuery({
    queryKey: ["/api/revenue-stats/daily", format(today, "yyyy-MM-dd")],
    queryFn: async () => {
      const res = await fetch(`/api/revenue-stats/daily?date=${format(today, "yyyy-MM-dd")}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<DailyStats>;
    }
  });
  
  // Dati settimanali (questa settimana)
  const { data: weeklyData } = useQuery({
    queryKey: ["/api/revenue-stats/weekly", format(today, "yyyy-MM-dd")],
    queryFn: async () => {
      const res = await fetch(`/api/revenue-stats/weekly?date=${format(today, "yyyy-MM-dd")}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<PeriodStats>;
    }
  });
  
  // Dati mensili (questo mese)
  const { data: monthlyData } = useQuery({
    queryKey: ["/api/revenue-stats/monthly", format(today, "yyyy-MM-dd")],
    queryFn: async () => {
      const res = await fetch(`/api/revenue-stats/monthly?date=${format(today, "yyyy-MM-dd")}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<PeriodStats>;
    }
  });
  
  // Dati del mese precedente (per confronto)
  const lastMonth = startOfMonth(subDays(startOfMonth(today), 1));
  const { data: lastMonthData } = useQuery({
    queryKey: ["/api/revenue-stats/monthly", format(lastMonth, "yyyy-MM-dd")],
    queryFn: async () => {
      const res = await fetch(`/api/revenue-stats/monthly?date=${format(lastMonth, "yyyy-MM-dd")}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<PeriodStats>;
    },
    enabled: compareMode
  });
  
  // Dati trend nel tempo
  const { data: trendsData } = useQuery({
    queryKey: ["/api/revenue-stats/trends", 30],
    queryFn: async () => {
      const res = await fetch("/api/revenue-stats/trends?days=30");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<{period: string, data: TrendPoint[]}>;
    }
  });
  
  // Dati per metodo di pagamento
  const { data: paymentMethodsData } = useQuery({
    queryKey: ["/api/revenue-stats/payment-methods", selectedPeriod],
    queryFn: async () => {
      const res = await fetch(`/api/revenue-stats/payment-methods?period=${selectedPeriod}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<PaymentMethodStats>;
    }
  });
  
  // Dati per destinazione
  const { data: destinationsData } = useQuery({
    queryKey: ["/api/revenue-stats/destinations", selectedPeriod],
    queryFn: async () => {
      const res = await fetch(`/api/revenue-stats/destinations?period=${selectedPeriod}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<DestinationStats>;
    }
  });
  
  // Calcola le percentuali di variazione mensile
  const calculateMonthlyChange = () => {
    if (!monthlyData || !lastMonthData || !lastMonthData.totalAmount) return { percentage: 0, isPositive: true };
    
    const change = monthlyData.totalAmount - lastMonthData.totalAmount;
    const percentage = lastMonthData.totalAmount ? Math.round((change / lastMonthData.totalAmount) * 100) : 0;
    
    return {
      percentage,
      isPositive: percentage >= 0
    };
  };
  
  const monthlyChange = compareMode ? calculateMonthlyChange() : { percentage: 0, isPositive: true };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Statistiche Entrate</h1>
        <Button 
          variant="outline" 
          onClick={() => setCompareMode(!compareMode)}
          className="flex items-center gap-2"
        >
          {compareMode ? "Nascondi confronto" : "Confronta con periodo precedente"}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="summary" className="text-lg">Riepilogo</TabsTrigger>
          <TabsTrigger value="trends" className="text-lg">Andamento</TabsTrigger>
          <TabsTrigger value="details" className="text-lg">Dettagli</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          {/* Cards di riepilogo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Giornaliero</CardTitle>
                <CardDescription>
                  {format(today, "d MMMM yyyy", { locale: it })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold">
                      {dailyData?.totalAmount ? `€${dailyData.totalAmount.toFixed(2)}` : "€0.00"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dailyData?.count || 0} spedizioni
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Settimanale</CardTitle>
                <CardDescription>
                  {weeklyData?.period || "Questa settimana"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold">
                      {weeklyData?.totalAmount ? `€${weeklyData.totalAmount.toFixed(2)}` : "€0.00"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {weeklyData?.count || 0} spedizioni
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Mensile</CardTitle>
                <CardDescription>
                  {monthlyData?.period || `${format(startOfMonth(today), "MMMM yyyy", { locale: it })}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold">
                      {monthlyData?.totalAmount ? `€${monthlyData.totalAmount.toFixed(2)}` : "€0.00"}
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm text-muted-foreground mr-2">
                        {monthlyData?.count || 0} spedizioni
                      </p>
                      
                      {compareMode && (
                        <div className={`flex items-center text-sm ${monthlyChange.isPositive ? "text-green-500" : "text-red-500"}`}>
                          {monthlyChange.isPositive ? (
                            <ChevronUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(monthlyChange.percentage)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Media giornaliera e Totale pacchi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Giornaliera</CardTitle>
                <CardDescription>
                  Entrate medie per giorno negli ultimi 30 giorni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {trendsData?.data && trendsData.data.length > 0 
                    ? `€${(trendsData.data.reduce((sum, point) => sum + point.totalAmount, 0) / trendsData.data.length).toFixed(2)}`
                    : "€0.00"
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Numero totale spedizioni</CardTitle>
                <CardDescription>
                  Numero totale di spedizioni negli ultimi 30 giorni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {trendsData?.data 
                    ? trendsData.data.reduce((sum, point) => sum + point.count, 0)
                    : 0
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          {/* Grafico andamento entrate */}
          <Card>
            <CardHeader>
              <CardTitle>Andamento Entrate</CardTitle>
              <CardDescription>
                Entrate giornaliere negli ultimi 30 giorni
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {trendsData?.data && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendsData.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return format(date, "dd/MM");
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Importo']}
                      labelFormatter={(value) => `Data: ${format(new Date(value), "dd/MM/yyyy")}`}
                    />
                    <Legend />
                    <Bar dataKey="totalAmount" name="Importo (€)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Grafico numero spedizioni */}
          <Card>
            <CardHeader>
              <CardTitle>Numero Spedizioni</CardTitle>
              <CardDescription>
                Numero di spedizioni giornaliere negli ultimi 30 giorni
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {trendsData?.data && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendsData.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return format(date, "dd/MM");
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [value, 'Spedizioni']}
                      labelFormatter={(value) => `Data: ${format(new Date(value), "dd/MM/yyyy")}`}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Numero Spedizioni" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <div className="flex justify-end mb-4">
            <Select value={selectedPeriod} onValueChange={(value: string) => setSelectedPeriod(value as PeriodOption)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 giorni</SelectItem>
                <SelectItem value="30days">30 giorni</SelectItem>
                <SelectItem value="90days">90 giorni</SelectItem>
                <SelectItem value="1year">1 anno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Grafico a torta metodi di pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Metodi di Pagamento
                  </CardTitle>
                  <CardDescription>
                    Distribuzione entrate per metodo di pagamento
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                {paymentMethodsData?.paymentMethods && paymentMethodsData.paymentMethods.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData.paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalAmount"
                        nameKey="paymentMethod"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodsData.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Importo']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Nessun dato disponibile</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Grafico a barre destinazioni principali */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Map className="mr-2 h-5 w-5" />
                    Destinazioni Principali
                  </CardTitle>
                  <CardDescription>
                    Entrate per destinazione di spedizione
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                {destinationsData?.destinations && destinationsData.destinations.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={destinationsData.destinations.slice(0, 5)} // Mostra solo le top 5
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="destination" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Importo']}
                      />
                      <Legend />
                      <Bar dataKey="totalAmount" name="Importo (€)" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Nessun dato disponibile</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Tabella metodi di pagamento e destinazioni */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dettaglio Metodi di Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metodo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spedizioni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentMethodsData?.paymentMethods?.map((method, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">{method.paymentMethod}</td>
                          <td className="px-4 py-2 whitespace-nowrap">€{method.totalAmount.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{method.count}</td>
                        </tr>
                      ))}
                      {!paymentMethodsData?.paymentMethods?.length && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-center text-sm text-gray-500">
                            Nessun dato disponibile
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dettaglio Destinazioni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinazione</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spedizioni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {destinationsData?.destinations?.map((dest, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">{dest.destination}</td>
                          <td className="px-4 py-2 whitespace-nowrap">€{dest.totalAmount.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{dest.count}</td>
                        </tr>
                      ))}
                      {!destinationsData?.destinations?.length && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-center text-sm text-gray-500">
                            Nessun dato disponibile
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}