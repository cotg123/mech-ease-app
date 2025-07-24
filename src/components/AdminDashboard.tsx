import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, LogOut, Users, Calendar, CheckCircle, Clock, TrendingUp, Euro, Trash2, FileText, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  onDeleteAgendamento: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard = ({ 
  usuario, 
  agendamentos, 
  onAcceptAgendamento, 
  onCompleteAgendamento,
  onDeleteAgendamento,
  onLogout 
}: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'agendamentos' | 'calendario' | 'clientes' | 'relatorios'>('agendamentos');

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

  const handleDeleteAgendamento = (id: string) => {
    onDeleteAgendamento(id);
    toast({
      title: "Agendamento removido!",
      description: "O agendamento foi excluído com sucesso.",
    });
  };

  const renderCalendario = () => (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">📅 Calendário de Agendamentos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agendamentos.map((agendamento) => (
          <Card key={agendamento.id} className="p-4 border-l-4 border-l-primary">
            <div className="space-y-2">
              <p className="font-semibold">{agendamento.data} - {agendamento.hora}</p>
              <p className="text-sm">{agendamento.nome}</p>
              <p className="text-xs text-muted-foreground">{agendamento.servico}</p>
              <Badge variant={agendamento.status === 'pendente' ? 'secondary' : agendamento.status === 'aceite' ? 'default' : 'outline'}>
                {agendamento.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  const renderClientes = () => {
    const clientes = Array.from(new Set(agendamentos.map(a => a.email))).map(email => {
      const agendamentosCliente = agendamentos.filter(a => a.email === email);
      const cliente = agendamentosCliente[0];
      return {
        ...cliente,
        totalAgendamentos: agendamentosCliente.length,
        ultimoAgendamento: agendamentosCliente.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0]
      };
    });

    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">👥 Lista de Clientes</h2>
        <div className="space-y-4">
          {clientes.map((cliente) => (
            <Card key={cliente.email} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{cliente.nome}</h3>
                  <p className="text-sm text-muted-foreground">{cliente.email}</p>
                  <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{cliente.totalAgendamentos} agendamentos</p>
                  <p className="text-xs text-muted-foreground">Último: {cliente.ultimoAgendamento.data}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  };

  const renderRelatorios = () => (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">📊 Relatórios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Status dos Agendamentos</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pendentes:</span>
              <span className="font-bold text-yellow-600">{agendamentos.filter(a => a.status === "pendente").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Aceites:</span>
              <span className="font-bold text-blue-600">{agendamentos.filter(a => a.status === "aceite").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Concluídos:</span>
              <span className="font-bold text-green-600">{agendamentos.filter(a => a.status === "concluido").length}</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Serviços Mais Solicitados</h3>
          <div className="space-y-2">
            {Object.entries(agendamentos.reduce((acc, curr) => {
              acc[curr.servico] = (acc[curr.servico] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)).map(([servico, count]) => (
              <div key={servico} className="flex justify-between">
                <span className="text-sm">{servico}:</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );

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

        {/* Navigation */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Navegação</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant={activeView === 'agendamentos' ? 'default' : 'outline'} 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveView('agendamentos')}
            >
              <CheckCircle className="h-6 w-6 text-primary" />
              <span>Agendamentos</span>
            </Button>
            <Button 
              variant={activeView === 'calendario' ? 'default' : 'outline'} 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveView('calendario')}
            >
              <Calendar className="h-6 w-6 text-primary" />
              <span>Ver Calendário</span>
            </Button>
            <Button 
              variant={activeView === 'clientes' ? 'default' : 'outline'} 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveView('clientes')}
            >
              <Users className="h-6 w-6 text-primary" />
              <span>Clientes</span>
            </Button>
            <Button 
              variant={activeView === 'relatorios' ? 'default' : 'outline'} 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveView('relatorios')}
            >
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Relatórios</span>
            </Button>
          </div>
        </Card>

        {/* Content Area */}
        {activeView === 'agendamentos' && (
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
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
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

                      {/* Delete Button */}
                      <div>
                        <Button 
                          onClick={() => handleDeleteAgendamento(agendamento.id)}
                          size="sm"
                          variant="destructive"
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeView === 'calendario' && renderCalendario()}
        {activeView === 'clientes' && renderClientes()}
        {activeView === 'relatorios' && renderRelatorios()}
      </main>
    </div>
  );
};