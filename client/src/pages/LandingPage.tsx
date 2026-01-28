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
  Lock,
  Star,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[600px] bg-cyan-600/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">MAYLEA</h1>
              <p className="text-[11px] text-white/40 tracking-[0.2em] uppercase">Logistics & Transport</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#servizi" className="text-sm text-white/60 hover:text-white transition-all duration-300 hover:tracking-wide">Servizi</a>
            <a href="#tempi" className="text-sm text-white/60 hover:text-white transition-all duration-300 hover:tracking-wide">Tempi</a>
            <a href="#copertura" className="text-sm text-white/60 hover:text-white transition-all duration-300 hover:tracking-wide">Copertura</a>
            <a href="#contatti" className="text-sm text-white/60 hover:text-white transition-all duration-300 hover:tracking-wide">Contatti</a>
          </nav>
          <Link href="/login">
            <Button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm gap-2 backdrop-blur-sm transition-all duration-300 hover:border-white/20">
              <Lock className="w-3.5 h-3.5" />
              Area Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-40">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/70">Spedizioni Premium in Italia e Europa</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">Trasporti di </span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Eccellenza</span>
              <br />
              <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">per la Tua Azienda</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Da oltre 10 anni siamo il partner di fiducia per imprese che richiedono 
              affidabilità assoluta, puntualità garantita e un servizio personalizzato.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contatti">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white border-0 shadow-xl shadow-blue-500/25 px-8 h-14 text-base gap-3 group transition-all duration-500">
                  Richiedi Preventivo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="tel:09311666849">
                <Button size="lg" className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white px-8 h-14 text-base gap-3 backdrop-blur-sm transition-all duration-300">
                  <Phone className="w-5 h-5" />
                  Chiama Ora
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "10+", label: "Anni di Esperienza" },
              { value: "50K+", label: "Spedizioni Completate" },
              { value: "99%", label: "Clienti Soddisfatti" },
              { value: "24h", label: "Consegna Express" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">{stat.value}</p>
                <p className="text-white/40 mt-2 text-sm tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servizi" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-4">I Nostri Servizi</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Soluzioni di Trasporto Premium
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
              Un ventaglio completo di servizi pensati per ogni esigenza logistica
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Package, title: "Spedizioni Pacchi", desc: "Ritiro a domicilio e consegna garantita per colli di qualsiasi dimensione con tracking in tempo reale." },
              { icon: Boxes, title: "Groupage", desc: "Ottimizza i costi con spedizioni consolidate verso le principali destinazioni nazionali ed europee." },
              { icon: Globe, title: "Internazionali", desc: "Trasporti verso l'Europa e oltre con gestione completa delle pratiche doganali." },
              { icon: Timer, title: "Express 24/48h", desc: "Consegne prioritarie in 24/48 ore per le destinazioni nazionali con garanzia di puntualità." },
              { icon: Shield, title: "Assicurazione", desc: "Copertura assicurativa completa per proteggere le tue merci durante tutto il trasporto." },
              { icon: HeadphonesIcon, title: "Assistenza Dedicata", desc: "Supporto clienti personalizzato per seguirti in ogni fase della spedizione." },
            ].map((service, index) => (
              <Card key={index} className="bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 group overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">{service.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Times Section */}
      <section id="tempi" className="relative py-24 md:py-32 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-4">Tempistiche</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Tempi di Consegna Garantiti
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
              Puntualità e affidabilità sono i pilastri del nostro servizio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Clock, title: "Italia Nord/Centro", time: "24-48 ore", color: "from-blue-500 to-cyan-500", regions: ["Lombardia, Piemonte, Veneto", "Emilia-Romagna, Toscana", "Lazio, Umbria, Marche"] },
              { icon: Truck, title: "Italia Sud e Isole", time: "48-72 ore", color: "from-indigo-500 to-blue-500", regions: ["Campania, Puglia, Calabria", "Sicilia e Sardegna", "Zone disagiate e isole minori"] },
              { icon: Globe, title: "Europa", time: "3-5 giorni", color: "from-purple-500 to-indigo-500", regions: ["Germania, Francia, Spagna", "Belgio, Olanda, Austria", "Polonia, Svizzera, UK"] },
              { icon: Timer, title: "Express Prioritario", time: "24 ore", color: "from-amber-500 to-orange-500", regions: ["Consegna garantita next-day", "Tracking in tempo reale", "Priorità assoluta di carico"] },
            ].map((item, index) => (
              <Card key={index} className="bg-white/[0.02] border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1 text-white">{item.title}</h3>
                      <p className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}>{item.time}</p>
                      <ul className="space-y-2">
                        {item.regions.map((region, i) => (
                          <li key={i} className="flex items-center gap-2 text-white/50 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400/70" />
                            {region}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="copertura" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">Modalità</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Scegli Come Spedire
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
              Flessibilità totale per adattarci alle tue esigenze operative
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Package, title: "Ritiro a Domicilio", desc: "Ritiriamo i tuoi pacchi direttamente a casa o in azienda con una semplice chiamata.", featured: false },
              { icon: Truck, title: "Porta a Porta", desc: "Servizio completo dal ritiro alla consegna. Nessun pensiero, ci occupiamo di tutto.", featured: true },
              { icon: MapPin, title: "Deposito in Sede", desc: "Consegna presso la nostra sede di Rosolini per tariffe ancora più vantaggiose.", featured: false },
            ].map((item, index) => (
              <Card key={index} className={`relative overflow-hidden transition-all duration-500 group ${item.featured ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/40 scale-105' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                {item.featured && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                )}
                <CardContent className="p-10 text-center">
                  {item.featured && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 mb-6">Più Richiesto</Badge>
                  )}
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${item.featured ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25' : 'bg-white/5'}`}>
                    <item.icon className={`w-10 h-10 ${item.featured ? 'text-white' : 'text-white/60'}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-4">Perché Sceglierci</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              L'Eccellenza che Fa la Differenza
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: "Affidabilità", desc: "99% consegne puntuali", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Shield, title: "Sicurezza", desc: "Assicurazione completa", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: HeadphonesIcon, title: "Assistenza", desc: "Supporto sempre attivo", color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: Timer, title: "Velocità", desc: "Express in 24/48h", color: "text-amber-400", bg: "bg-amber-500/10" },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${item.bg} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.15),transparent_50%)]" />
              
              <div className="relative p-12 md:p-16 border border-white/10 rounded-3xl backdrop-blur-xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                    Inizia Oggi
                  </h2>
                  <p className="text-white/50 text-lg font-light max-w-xl mx-auto">
                    Contattaci per un preventivo personalizzato o per qualsiasi informazione sui nostri servizi
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Phone, title: "Telefono", lines: ["0931 1666849", "WhatsApp: 331 3896381"], href: "tel:09311666849" },
                    { icon: MapPin, title: "Sede", lines: ["Via Gonzaga 105", "Rosolini (SR)"], href: null },
                    { icon: Globe, title: "Web", lines: ["www.maylealogistics.it"], href: "https://www.maylealogistics.it" },
                  ].map((contact, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors">
                        <contact.icon className="w-7 h-7 text-white/70" />
                      </div>
                      <h3 className="font-semibold mb-2 text-white">{contact.title}</h3>
                      {contact.lines.map((line, i) => (
                        contact.href ? (
                          <a key={i} href={contact.href} className="block text-white/50 hover:text-white transition-colors text-sm">{line}</a>
                        ) : (
                          <p key={i} className="text-white/50 text-sm">{line}</p>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 bg-black/40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">MAYLEA</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase">Logistics & Transport</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-white/30 text-sm">C.T.D. SRL - Via Gonzaga 105, Rosolini</p>
              <p className="text-white/20 text-xs mt-1">&copy; {new Date().getFullYear()} Tutti i diritti riservati</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
