import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Phone, MapPin, Clock, Star, Users, Award, Zap, PaintBucket, ThumbsUp, TrendingUp, Settings, Truck } from "lucide-react";
import heroImage from "@/assets/workshop-hero.jpg";
import servicesImage from "@/assets/services-grid.jpg";

interface HomePageProps {
  onLogin: () => void;
}

export const HomePage = ({ onLogin }: HomePageProps) => {
  const services = [
    { 
      name: "Chapa e Pintura", 
      description: "Serviços completos de funilaria e pintura automotiva com acabamento profissional", 
      icon: PaintBucket,
      details: [
        "Reparação de riscos e amolgadelas",
        "Pintura completa ou parcial",
        "Polimento e enceramento",
        "Proteção de pintura",
        "Orçamento gratuito"
      ]
    },
    { 
      name: "Check-up Auto", 
      description: "Revisão completa do seu veículo com diagnóstico detalhado", 
      icon: ThumbsUp,
      details: [
        "Verificação de 50+ pontos",
        "Teste de sistemas eletrônicos",
        "Análise de fluidos",
        "Estado de pneus e freios",
        "Relatório detalhado"
      ]
    },
    { 
      name: "Diagnósticos Auto", 
      description: "Diagnóstico avançado com equipamentos de última geração", 
      icon: TrendingUp,
      details: [
        "Scanner OBD2 avançado",
        "Teste de performance do motor",
        "Análise de emissões",
        "Diagnóstico de falhas",
        "Relatório técnico completo"
      ]
    },
    { 
      name: "Revisões", 
      description: "Manutenção preventiva e revisões programadas", 
      icon: Settings,
      details: [
        "Troca de óleo e filtros",
        "Revisão de freios",
        "Verificação de suspensão",
        "Manutenção preventiva",
        "Garantia de serviço"
      ]
    },
    { 
      name: "Reboque", 
      description: "Serviço de reboque 24h para emergências", 
      icon: Truck,
      details: [
        "Disponível 24h/7 dias",
        "Cobertura em todo Portugal",
        "Equipamento especializado",
        "Profissionais qualificados",
        "Preços competitivos"
      ]
    }
  ];

  const handleServiceClick = (service: any) => {
    const message = `Olá! Gostaria de agendar o serviço de ${service.name}. 

📋 Detalhes do serviço:
${service.details.map((detail: string, index: number) => `${index + 1}. ${detail}`).join('\n')}

Por favor, me informem sobre disponibilidade e valores.

Obrigado!`;

    const whatsappNumber = "351910000000";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

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
              Temos oficinas próprias e uma equipa de profissionais que vão ao encontro das necessidades dos nossos clientes, esperamos por si!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {services.slice(0, 4).map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{service.name}</h4>
                  <p className="text-muted-foreground text-sm mb-6">{service.description}</p>
                  <Button 
                    onClick={() => handleServiceClick(service)}
                    className="w-full bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                    variant="outline"
                  >
                    ⏰ AGENDAR SERVIÇO
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Fifth service centered below */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              {services.slice(4).map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index + 4} className="p-8 hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{service.name}</h4>
                    <p className="text-muted-foreground text-sm mb-6">{service.description}</p>
                    <Button 
                      onClick={() => handleServiceClick(service)}
                      className="w-full bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                      variant="outline"
                    >
                      ⏰ AGENDAR SERVIÇO
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-12">
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