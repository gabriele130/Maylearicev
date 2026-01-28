import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Package, 
  Clock, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  ArrowRight,
  Globe,
  Boxes,
  Timer,
  HeadphonesIcon,
  Lock
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[hsl(210,78%,28%)] rounded-lg flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[hsl(210,78%,28%)]">MAYLEA</h1>
              <p className="text-xs text-gray-500">Logistics & Transport</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#servizi" className="text-gray-600 hover:text-[hsl(210,78%,28%)] transition-colors">Servizi</a>
            <a href="#tempi" className="text-gray-600 hover:text-[hsl(210,78%,28%)] transition-colors">Tempi</a>
            <a href="#copertura" className="text-gray-600 hover:text-[hsl(210,78%,28%)] transition-colors">Copertura</a>
            <a href="#contatti" className="text-gray-600 hover:text-[hsl(210,78%,28%)] transition-colors">Contatti</a>
          </nav>
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="w-4 h-4" />
              Area Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(210,78%,28%)] via-[hsl(210,78%,35%)] to-[hsl(210,78%,25%)] text-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white hover:bg-white/30">
              Spedizioni Sicure in Tutta Italia e Europa
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Spedizioni Veloci, Sicure e Affidabili
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Da oltre 10 anni il tuo partner di fiducia per trasporti nazionali e internazionali. 
              Affidabilità, puntualità e cura del cliente sono i nostri valori fondamentali.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contatti">
                <Button size="lg" className="bg-white text-[hsl(210,78%,28%)] hover:bg-gray-100 gap-2 w-full sm:w-auto">
                  Richiedi Preventivo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="tel:09311666849">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                  <Phone className="w-5 h-5" />
                  Chiama Ora
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[hsl(210,78%,28%)]">10+</p>
              <p className="text-gray-600 mt-1">Anni di Esperienza</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[hsl(210,78%,28%)]">50.000+</p>
              <p className="text-gray-600 mt-1">Spedizioni Completate</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[hsl(210,78%,28%)]">99%</p>
              <p className="text-gray-600 mt-1">Clienti Soddisfatti</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[hsl(210,78%,28%)]">24/48h</p>
              <p className="text-gray-600 mt-1">Consegna Italia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servizi" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">I Nostri Servizi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Offriamo soluzioni complete per ogni esigenza di trasporto, dalla piccola spedizione al carico completo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[hsl(210,78%,28%)]/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-[hsl(210,78%,28%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Spedizioni Pacchi</h3>
                <p className="text-gray-600">
                  Spedizioni di pacchi e colli di qualsiasi dimensione con ritiro a domicilio e consegna garantita.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[hsl(210,78%,28%)]/10 rounded-lg flex items-center justify-center mb-4">
                  <Boxes className="w-6 h-6 text-[hsl(210,78%,28%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Groupage</h3>
                <p className="text-gray-600">
                  Servizio di groupage per ottimizzare i costi con spedizioni consolidate verso le principali destinazioni.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[hsl(210,78%,28%)]/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-[hsl(210,78%,28%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Spedizioni Internazionali</h3>
                <p className="text-gray-600">
                  Trasporti verso l'Europa e oltre con gestione completa delle pratiche doganali.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[hsl(210,78%,28%)]/10 rounded-lg flex items-center justify-center mb-4">
                  <Timer className="w-6 h-6 text-[hsl(210,78%,28%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Express 24/48h</h3>
                <p className="text-gray-600">
                  Consegne express in 24/48 ore per le destinazioni nazionali con tracciamento in tempo reale.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[hsl(210,78%,28%)]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[hsl(210,78%,28%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assicurazione Merce</h3>
                <p className="text-gray-600">
                  Copertura assicurativa completa per proteggere le tue merci durante tutto il trasporto.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[hsl(210,78%,28%)]/10 rounded-lg flex items-center justify-center mb-4">
                  <HeadphonesIcon className="w-6 h-6 text-[hsl(210,78%,28%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assistenza Dedicata</h3>
                <p className="text-gray-600">
                  Supporto clienti dedicato per seguirti in ogni fase della spedizione con professionalità.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Delivery Times Section */}
      <section id="tempi" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tempi di Consegna</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Garantiamo tempi di consegna certi e affidabili per tutte le destinazioni.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[hsl(210,78%,28%)]/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[hsl(210,78%,28%)] rounded-full flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Italia Nord/Centro</h3>
                      <p className="text-[hsl(210,78%,28%)] font-bold text-2xl">24-48 ore</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lombardia, Piemonte, Veneto
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Emilia-Romagna, Toscana
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lazio, Umbria, Marche
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[hsl(210,78%,28%)]/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[hsl(210,78%,28%)] rounded-full flex items-center justify-center">
                      <Truck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Italia Sud e Isole</h3>
                      <p className="text-[hsl(210,78%,28%)] font-bold text-2xl">48-72 ore</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Campania, Puglia, Calabria
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Sicilia e Sardegna
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Zone disagiate e isole minori
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[hsl(210,78%,28%)]/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[hsl(210,78%,28%)] rounded-full flex items-center justify-center">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Europa</h3>
                      <p className="text-[hsl(210,78%,28%)] font-bold text-2xl">3-5 giorni</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Germania, Francia, Spagna
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Belgio, Olanda, Austria
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Polonia, Svizzera, UK
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[hsl(210,78%,28%)]/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                      <Timer className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Express Prioritario</h3>
                      <p className="text-orange-500 font-bold text-2xl">24 ore</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Consegna garantita next-day
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Tracking in tempo reale
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Priorità di carico
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="copertura" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Modalità di Spedizione</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scegli la modalità più adatta alle tue esigenze tra le nostre opzioni di trasporto.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-[hsl(210,78%,28%)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ritiro a Domicilio</h3>
                <p className="text-gray-600 mb-4">
                  Ritiriamo i tuoi pacchi direttamente a casa o in azienda. Basta una chiamata per organizzare il ritiro.
                </p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Gratuito sopra i 50kg
                </Badge>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-[hsl(210,78%,28%)]">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-[hsl(210,78%,28%)]">Più Richiesto</Badge>
                <div className="w-20 h-20 bg-[hsl(210,78%,28%)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Porta a Porta</h3>
                <p className="text-gray-600 mb-4">
                  Servizio completo dal ritiro alla consegna. Nessun pensiero, ci occupiamo di tutto noi.
                </p>
                <Badge className="bg-[hsl(210,78%,28%)]/10 text-[hsl(210,78%,28%)] hover:bg-[hsl(210,78%,28%)]/10">
                  Assicurazione Inclusa
                </Badge>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-[hsl(210,78%,28%)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Deposito in Sede</h3>
                <p className="text-gray-600 mb-4">
                  Consegna i pacchi presso la nostra sede di Rosolini. Ideale per spedizioni frequenti.
                </p>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Tariffe Agevolate
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perché Scegliere Maylea</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La nostra esperienza e dedizione ci rendono il partner ideale per le tue spedizioni.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Affidabilità</h3>
              <p className="text-gray-600 text-sm">
                99% delle consegne effettuate nei tempi previsti
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sicurezza</h3>
              <p className="text-gray-600 text-sm">
                Assicurazione completa su tutte le spedizioni
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Assistenza</h3>
              <p className="text-gray-600 text-sm">
                Supporto clienti sempre disponibile
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Velocità</h3>
              <p className="text-gray-600 text-sm">
                Consegne express in 24/48 ore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-16 md:py-24 bg-[hsl(210,78%,28%)] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contattaci</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Siamo a tua disposizione per preventivi e informazioni. Contattaci tramite i canali che preferisci.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Telefono</h3>
                <a href="tel:09311666849" className="text-white/90 hover:text-white transition-colors block">
                  0931 1666849
                </a>
                <a href="https://wa.me/393313896381" className="text-green-300 hover:text-green-200 transition-colors block mt-1">
                  WhatsApp: 331 3896381
                </a>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sede Operativa</h3>
                <p className="text-white/90">
                  Via Gonzaga 105<br />
                  Rosolini (SR)
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Web</h3>
                <a href="https://www.maylealogistics.it" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors block">
                  www.maylealogistics.it
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[hsl(210,78%,28%)] rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">MAYLEA</h3>
                  <p className="text-xs text-gray-400">Logistics & Transport</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                C.T.D. SRL<br />
                Via Gonzaga 105 – Rosolini
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servizi</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Spedizioni Nazionali</li>
                <li>Spedizioni Internazionali</li>
                <li>Express 24/48h</li>
                <li>Groupage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contatti</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Tel: 0931 1666849</li>
                <li>WhatsApp: 331 3896381</li>
                <li>www.maylealogistics.it</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} MAYLEA Logistics & Transport - C.T.D. SRL. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
