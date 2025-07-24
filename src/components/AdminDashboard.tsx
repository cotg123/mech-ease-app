import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, LogOut, Users, Calendar, CheckCircle, Clock, TrendingUp, Euro } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Usuario {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  tipo: "cliente" | "mecanico";
}

interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  servico: string;
  data: string;
  hora: string;
  mensagem: string;
  status: "pendente" | "aceite" | "concluido";
}

interface AdminDashboardProps {
  usuario: Usuario;
  agendamentos: Agendamento[];
  onAcceptAgendamento: (id: string) => void;
  onCompleteAgendamento: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard = ({ 
  usuario, 
  agendamentos, 
  onAcceptAgendamento, 
  onCompleteAgendamento,
  onLogout 
}: AdminDashboardProps) => {
  const { toast } = useToast();

  const stats = [
    {
      title: "Total de Agendamentos",
      value: agendamentos.length,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Pendentes",
      value: agendamentos.filter(a => a.status === "pendente").length,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Aceites",
      value: agendamentos.filter(a => a.status === "aceite").length,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Concluídos",
      value: agendamentos.filter(a => a.status === "concluido").length,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const handleAcceptAgendamento = (id: string) => {
    onAcceptAgendamento(id);
    toast({
      title: "Agendamento aceite!",
      description: "O cliente foi notificado.",
    });
  };

  const handleCompleteAgendamento = (id: string) => {
    onCompleteAgendamento(id);
    toast({
      title: "Serviço concluído!",
      description: "Agendamento marcado como concluído.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold">MechEase - Painel Administrativo</h1>
              <p className="text-xs text-muted-foreground">Gestão de Agendamentos</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{usuario.nome}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Ver Calendário</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Clientes</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Euro className="h-6 w-6 text-primary" />
              <span>Relatórios</span>
            </Button>
          </div>
        </Card>

        {/* Agendamentos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Agendamentos</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {agendamentos.filter(a => a.status === "pendente").length} Pendentes
              </Badge>
              <Badge variant="default">
                {agendamentos.filter(a => a.status === "aceite").length} Aceites
              </Badge>
            </div>
          </div>
          
          {agendamentos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                    {/* Cliente Info */}
                    <div>
                      <h3 className="font-semibold">{agendamento.nome}</h3>
                      <p className="text-sm text-muted-foreground">{agendamento.telefone}</p>
                      <p className="text-xs text-muted-foreground">{agendamento.email}</p>
                    </div>

                    {/* Serviço */}
                    <div>
                      <p className="font-medium">{agendamento.servico}</p>
                      {agendamento.mensagem && (
                        <p className="text-sm text-muted-foreground truncate">
                          💬 {agendamento.mensagem}
                        </p>
                      )}
                    </div>

                    {/* Data/Hora */}
                    <div>
                      <p className="font-medium">📅 {agendamento.data}</p>
                      <p className="text-sm text-muted-foreground">🕐 {agendamento.hora}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge variant={
                        agendamento.status === 'pendente' ? 'secondary' :
                        agendamento.status === 'aceite' ? 'default' : 'outline'
                      }>
                        {agendamento.status === 'pendente' ? 'Pendente' :
                         agendamento.status === 'aceite' ? 'Aceite' : 'Concluído'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {agendamento.status === 'pendente' && (
                        <Button 
                          onClick={() => handleAcceptAgendamento(agendamento.id)}
                          size="sm"
                          className="w-full"
                        >
                          Aceitar
                        </Button>
                      )}
                      {agendamento.status === 'aceite' && (
                        <Button 
                          onClick={() => handleCompleteAgendamento(agendamento.id)}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          Concluir
                        </Button>
                      )}
                      {agendamento.status === 'concluido' && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Concluído
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};