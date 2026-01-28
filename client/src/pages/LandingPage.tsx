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
  CheckCircle, 
  ArrowRight,
  Globe,
  Boxes,
  Timer,
  HeadphonesIcon,
  Lock,
  Plane,
  Ship,
  Container,
  Play
} from "lucide-react";

import airFreightImg from "@/assets/images/air-freight.jpg";
import roadTransportImg from "@/assets/images/road-transport.jpg";
import seaFreightImg from "@/assets/images/sea-freight.jpg";
import warehouseImg from "@/assets/images/warehouse.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">MAYLEA</h1>
              <p className="text-[10px] text-gray-500 tracking-[0.15em] uppercase font-medium">Logistics & Transport</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#servizi" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Servizi</a>
            <a href="#trasporti" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Trasporti</a>
            <a href="#tempi" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Tempi</a>
            <a href="#contatti" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Contatti</a>
          </nav>
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2 border-gray-200 hover:border-blue-600 hover:text-blue-600">
              <Lock className="w-3.5 h-3.5" />
              Area Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              {/* Transport mode badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1.5 px-3 py-1">
                  <Plane className="w-3.5 h-3.5" /> Aereo
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5 px-3 py-1">
                  <Truck className="w-3.5 h-3.5" /> Gomma
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 gap-1.5 px-3 py-1">
                  <Ship className="w-3.5 h-3.5" /> Mare
                </Badge>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1.5 px-3 py-1">
                  <Container className="w-3.5 h-3.5" /> Container
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]">
                Spedizioni{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Nazionali</span>
                {" "}e{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Internazionali</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Trasportiamo le tue merci in <strong className="text-gray-800">tutta Italia e nel mondo</strong> via aerea, 
                su gomma e via mare. Container, groupage e carichi completi con puntualità garantita.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Italia + Europa + Mondo</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Express 24/48h</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Assicurazione Inclusa</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contatti">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 px-8 h-13 text-base gap-2 w-full sm:w-auto">
                    Richiedi Preventivo Gratuito
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <a href="tel:09311666849">
                  <Button size="lg" variant="outline" className="border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 h-13 text-base gap-2 w-full sm:w-auto">
                    <Phone className="w-5 h-5" />
                    Chiama Ora
                  </Button>
                </a>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/3]">
                    <img src={airFreightImg} alt="Trasporto Aereo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Via Aerea</span>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/3]">
                    <img src={seaFreightImg} alt="Trasporto Marittimo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Ship className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Via Mare</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/3]">
                    <img src={roadTransportImg} alt="Trasporto su Gomma" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Su Gomma</span>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/3]">
                    <img src={warehouseImg} alt="Magazzino" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Container className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Container</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10+", label: "Anni di Esperienza" },
              { value: "50.000+", label: "Spedizioni Completate" },
              { value: "99%", label: "Clienti Soddisfatti" },
              { value: "24h", label: "Consegna Express" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{stat.value}</p>
                <p className="text-gray-500 mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport Methods Section with Images */}
      <section id="trasporti" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">Modalità di Trasporto</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Spediamo Via Terra, Mare e Cielo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Qualunque sia la tua esigenza, abbiamo la soluzione di trasporto ideale per le tue merci
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: roadTransportImg, icon: Truck, title: "Su Gomma", desc: "Italia ed Europa via strada, consegne rapide e flessibili", color: "emerald" },
              { img: airFreightImg, icon: Plane, title: "Via Aerea", desc: "Spedizioni urgenti worldwide con i principali vettori", color: "blue" },
              { img: seaFreightImg, icon: Ship, title: "Via Mare", desc: "Container FCL e LCL per grandi volumi intercontinentali", color: "purple" },
              { img: warehouseImg, icon: Container, title: "Groupage", desc: "Consolidamento carichi per ottimizzare i costi", color: "amber" },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-${item.color}-500 flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servizi" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">I Nostri Servizi</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Soluzioni Complete per la Tua Logistica
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dalla piccola spedizione al carico completo, gestiamo ogni aspetto del trasporto
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Package, title: "Spedizioni Pacchi", desc: "Ritiro a domicilio e consegna garantita per colli di qualsiasi dimensione.", color: "bg-blue-500" },
              { icon: Boxes, title: "Groupage", desc: "Ottimizza i costi con spedizioni consolidate verso le principali destinazioni.", color: "bg-emerald-500" },
              { icon: Globe, title: "Internazionali", desc: "Trasporti verso l'Europa e oltre con gestione pratiche doganali.", color: "bg-purple-500" },
              { icon: Timer, title: "Express 24/48h", desc: "Consegne prioritarie in 24/48 ore per le destinazioni nazionali.", color: "bg-amber-500" },
              { icon: Shield, title: "Assicurazione", desc: "Copertura assicurativa completa per proteggere le tue merci.", color: "bg-rose-500" },
              { icon: HeadphonesIcon, title: "Assistenza", desc: "Supporto clienti personalizzato per seguirti in ogni fase.", color: "bg-cyan-500" },
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-gray-200">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Times Section */}
      <section id="tempi" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">Tempi di Consegna</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Puntualità Garantita
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rispettiamo sempre i tempi di consegna concordati
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Clock, title: "Italia Nord/Centro", time: "24-48h", regions: ["Lombardia, Piemonte", "Emilia-Romagna, Toscana", "Lazio, Veneto"], color: "blue" },
              { icon: Truck, title: "Italia Sud e Isole", time: "48-72h", regions: ["Campania, Puglia", "Sicilia, Sardegna", "Calabria"], color: "indigo" },
              { icon: Globe, title: "Europa", time: "3-5 giorni", regions: ["Germania, Francia", "Spagna, UK", "Benelux, Austria"], color: "purple" },
              { icon: Plane, title: "Worldwide", time: "5-10 giorni", regions: ["USA, Canada", "Asia, Middle East", "Africa, Oceania"], color: "rose" },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-gray-100">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-${item.color}-100 flex items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className={`text-2xl font-bold text-${item.color}-600 mb-4`}>{item.time}</p>
                  <ul className="space-y-1">
                    {item.regions.map((region, i) => (
                      <li key={i} className="text-gray-500 text-sm">{region}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perché Scegliere Maylea
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              L'eccellenza nel trasporto che fa la differenza per il tuo business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: "Affidabilità", desc: "99% consegne puntuali" },
              { icon: Shield, title: "Sicurezza", desc: "Assicurazione completa" },
              { icon: HeadphonesIcon, title: "Assistenza", desc: "Supporto sempre attivo" },
              { icon: Timer, title: "Velocità", desc: "Express in 24/48h" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-gray-200 shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img src={warehouseImg} alt="Sede Maylea" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <h3 className="text-2xl font-bold mb-2">Contattaci Oggi</h3>
                      <p className="text-blue-100">Preventivo gratuito in 24 ore</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8 md:p-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Telefono</h4>
                        <a href="tel:09311666849" className="text-gray-600 hover:text-blue-600 transition-colors">0931 1666849</a>
                        <p className="text-gray-500 text-sm">WhatsApp: 331 3896381</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Sede Operativa</h4>
                        <p className="text-gray-600">Via Gonzaga 105</p>
                        <p className="text-gray-500 text-sm">Rosolini (SR)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Web</h4>
                        <a href="https://www.maylealogistics.it" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">www.maylealogistics.it</a>
                      </div>
                    </div>
                    <a href="tel:09311666849" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-base gap-2">
                        <Phone className="w-5 h-5" />
                        Chiama per un Preventivo
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold">MAYLEA</p>
                <p className="text-xs text-gray-400">Logistics & Transport</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">C.T.D. SRL - Via Gonzaga 105, Rosolini</p>
              <p className="text-gray-500 text-xs mt-1">&copy; {new Date().getFullYear()} Tutti i diritti riservati</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
