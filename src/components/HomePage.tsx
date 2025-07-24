import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Phone, MapPin, Clock, Star, Users, Award, Zap } from "lucide-react";
import heroImage from "@/assets/workshop-hero.jpg";
import servicesImage from "@/assets/services-grid.jpg";

interface HomePageProps {
  onLogin: () => void;
}

export const HomePage = ({ onLogin }: HomePageProps) => {
  const services = [
    { name: "Troca de Óleo", description: "Serviço completo de troca de óleo e filtros", icon: "🛢️" },
    { name: "Alinhamento", description: "Alinhamento e balanceamento de rodas", icon: "⚖️" },
    { name: "Freios", description: "Manutenção e reparo do sistema de freios", icon: "🛑" },
    { name: "Motor", description: "Diagnóstico e reparo de motor", icon: "🔧" },
    { name: "Suspensão", description: "Reparo completo da suspensão", icon: "🏗️" },
    { name: "Ar Condicionado", description: "Manutenção do sistema de climatização", icon: "❄️" }
  ];

  const stats = [
    { number: "500+", label: "Clientes Satisfeitos", icon: Users },
    { number: "15+", label: "Anos de Experiência", icon: Award },
    { number: "98%", label: "Taxa de Satisfação", icon: Star },
    { number: "24h", label: "Resposta Rápida", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">MechEase Portugal</h1>
                <p className="text-xs text-muted-foreground">Oficina Mecânica Profissional</p>
              </div>
            </div>
            <Button onClick={onLogin} size="lg">
              Agendar Serviço
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 text-white">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold mb-6">
                Serviços Mecânicos de <span className="text-primary">Excelência</span>
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Mais de 15 anos de experiência em manutenção e reparo automotivo em Portugal. 
                Agende seu serviço com facilidade e confiança.
              </p>
              <div className="flex gap-4">
                <Button onClick={onLogin} size="lg" className="bg-primary hover:bg-primary/90">
                  Agendar Agora
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                  Ver Serviços
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Nossos Serviços</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma gama completa de serviços mecânicos com equipamentos modernos 
              e profissionais qualificados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{service.name}</h4>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <img 
              src={servicesImage} 
              alt="Nossos serviços"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Telefone</h4>
              <p className="text-muted-foreground">+351 910 000 000</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Localização</h4>
              <p className="text-muted-foreground">Lisboa, Portugal</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Horário</h4>
              <p className="text-muted-foreground">Seg-Sex: 8h-17h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-semibold">MechEase Portugal</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 MechEase Portugal. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};