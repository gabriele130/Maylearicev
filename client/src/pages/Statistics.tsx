import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  LineChart, 
  Line,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipi per i dati delle statistiche
type WeightStats = {
  totalWeight: number;
  totalPackages: number;
};

type DailyStats = WeightStats & {
  date: string;
};

type PeriodStats = WeightStats & {
  startDate: string;
  endDate: string;
};

type TrendPoint = {
  date: string;
  totalWeight: number;
  totalPackages: number;
};

type DestinationStat = {
  destination: string;
  totalWeight: number;
  count: number;
};

type DestinationStats = {
  period: string;
  startDate: string;
  endDate: string;
  destinations: DestinationStat[];
};

// Colori per i grafici
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#48C9B0', '#F4D03F'];

export default function Statistics() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  
  // Query per ottenere le statistiche giornaliere
  const { data: dailyData, isLoading: dailyLoading } = useQuery<any>({
    queryKey: ['/api/weight-stats/daily'],
    retry: 1
  });

  // Query per ottenere le statistiche settimanali
  const { data: weeklyData, isLoading: weeklyLoading } = useQuery<any>({
    queryKey: ['/api/weight-stats/weekly'],
    retry: 1
  });

  // Query per ottenere le statistiche mensili
  const { data: monthlyData, isLoading: monthlyLoading } = useQuery<any>({
    queryKey: ['/api/weight-stats/monthly'],
    retry: 1
  });

  // Query per ottenere le statistiche dell'andamento
  const { data: trendData, isLoading: trendLoading } = useQuery<any>({
    queryKey: ['/api/weight-stats/trends', { days: 30 }],
    retry: 1
  });

  // Query per ottenere le statistiche per destinazione
  const { data: destinationData, isLoading: destinationLoading } = useQuery<any>({
    queryKey: ['/api/weight-stats/destinations', { period: timeRange }],
    retry: 1
  });

  const formatWeight = (weight: number | undefined) => {
    if (weight === undefined) return '0 kg';
    return `${Number(weight).toLocaleString('it-IT', { maximumFractionDigits: 2 })} kg`;
  };

  const formatPackages = (packages: number | undefined) => {
    if (packages === undefined) return '0';
    return Number(packages).toLocaleString('it-IT');
  };

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = parseISO(dateStr);
      return format(date, 'dd/MM/yyyy', { locale: it });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Statistiche Pesi Trasporti</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Statistiche giornaliere */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Oggi</CardTitle>
            <CardDescription>Statistiche del giorno</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peso totale:</span>
                  <span className="text-2xl font-bold">{formatWeight(dailyData?.totalWeight)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Numero colli:</span>
                  <span className="text-2xl font-bold">{formatPackages(dailyData?.totalPackages)}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            {dailyData?.date ? formatDateShort(dailyData.date) : 'Dati non disponibili'}
          </CardFooter>
        </Card>
        
        {/* Statistiche settimanali */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Settimana</CardTitle>
            <CardDescription>Statistiche settimanali</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peso totale:</span>
                  <span className="text-2xl font-bold">{formatWeight(weeklyData?.totalWeight)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Numero colli:</span>
                  <span className="text-2xl font-bold">{formatPackages(weeklyData?.totalPackages)}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Settimana corrente
          </CardFooter>
        </Card>
        
        {/* Statistiche mensili */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mese</CardTitle>
            <CardDescription>Statistiche mensili</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peso totale:</span>
                  <span className="text-2xl font-bold">{formatWeight(monthlyData?.totalWeight)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Numero colli:</span>
                  <span className="text-2xl font-bold">{formatPackages(monthlyData?.totalPackages)}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Mese corrente
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="trend" className="w-full mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="trend">Andamento Pesi</TabsTrigger>
          <TabsTrigger value="destination">Statistiche per Destinazione</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Pesi Trasportati</CardTitle>
              <CardDescription>Ultimi 30 giorni</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {trendLoading ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : trendData && trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      height={80}
                      tickFormatter={formatDateShort}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                    <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'totalWeight') return [`${value.toLocaleString('it-IT')} kg`, 'Peso totale'];
                        return [`${value.toLocaleString('it-IT')}`, 'Numero colli'];
                      }}
                      labelFormatter={formatDateShort}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalWeight"
                      name="Peso totale"
                      stroke="#0088FE"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalPackages"
                      name="Numero colli"
                      stroke="#00C49F"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  Nessun dato disponibile per questo periodo
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="destination">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Statistiche per Destinazione</CardTitle>
                <CardDescription>Pesi trasportati per città di destinazione</CardDescription>
              </div>
              <Select
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleziona periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Ultimi 7 giorni</SelectItem>
                  <SelectItem value="30days">Ultimi 30 giorni</SelectItem>
                  <SelectItem value="90days">Ultimi 90 giorni</SelectItem>
                  <SelectItem value="1year">Ultimo anno</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-4">
              {destinationLoading ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : destinationData && destinationData.destinations && destinationData.destinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Grafico a barre */}
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={destinationData.destinations}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="destination"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === 'totalWeight') return [`${value.toLocaleString('it-IT')} kg`, 'Peso totale'];
                          return [`${value.toLocaleString('it-IT')}`, 'Numero spedizioni'];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="totalWeight" name="Peso totale" fill="#0088FE" />
                      <Bar dataKey="count" name="Numero spedizioni" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  {/* Grafico a torta per il peso */}
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={destinationData.destinations}
                        dataKey="totalWeight"
                        nameKey="destination"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {destinationData.destinations.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString('it-IT')} kg`, 'Peso totale']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  Nessun dato disponibile per questo periodo
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {destinationData ? (
                <>
                  Periodo: {formatDateShort(destinationData.startDate)} - {formatDateShort(destinationData.endDate)}
                </>
              ) : (
                'Dati non disponibili'
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}