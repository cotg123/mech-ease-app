import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Clock, Settings, LogOut, Wrench, Bell } from "lucide-react";
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

interface ClientDashboardProps {
  usuario: Usuario;
  agendamentos: Agendamento[];
  onAddAgendamento: (agendamento: Omit<Agendamento, "id" | "status">) => void;
  onLogout: () => void;
  notifications: string[];
  onMarkNotificationRead: () => void;
}

export const ClientDashboard = ({ 
  usuario, 
  agendamentos, 
  onAddAgendamento, 
  onLogout,
  notifications,
  onMarkNotificationRead
}: ClientDashboardProps) => {
  const [servico, setServico] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [data, setData] = useState<Date | undefined>(new Date());
  const [hora, setHora] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  const servicosDisponiveis = [
    "Troca de Óleo",
    "Alinhamento e Balanceamento",
    "Revisão Completa",
    "Freios",
    "Embreagem",
    "Suspensão",
    "Sistema Elétrico",
    "Ar Condicionado",
    "Caixa de Velocidades",
    "Motor"
  ];

  const horariosDisponiveis = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const handleAgendamento = () => {
    if (!servico || !data || !hora) {
      toast({
        title: "Erro no agendamento",
        description: "Preencha serviço, data e horário.",
        variant: "destructive",
      });
      return;
    }

    const novoAgendamento = {
      nome: usuario.nome,
      telefone: usuario.telefone,
      email: usuario.email,
      servico,
      data: format(data, 'dd/MM/yyyy'),
      hora,
      mensagem,
    };

    onAddAgendamento(novoAgendamento);
    
    toast({
      title: "Agendamento realizado!",
      description: `Serviço de ${servico} agendado para ${format(data, 'dd/MM/yyyy')} às ${hora}.`,
    });

    // Reset form
    setServico("");
    setMensagem("");
    setData(new Date());
    setHora("");
  };

  const enviarWhatsApp = () => {
    if (!servico || !data || !hora) {
      toast({
        title: "Erro",
        description: "Complete o agendamento primeiro.",
        variant: "destructive",
      });
      return;
    }

    const numeroOficina = "351910000000";
    const textoWhatsApp = `Olá! Gostaria de agendar um serviço:\n\n` +
      `📋 Serviço: ${servico}\n` +
      `📅 Data: ${format(data!, 'dd/MM/yyyy')}\n` +
      `🕐 Horário: ${hora}\n` +
      `👤 Nome: ${usuario.nome}\n` +
      `📱 Telefone: ${usuario.telefone}\n` +
      `📧 Email: ${usuario.email}\n` +
      `💬 Observações: ${mensagem || "Nenhuma"}`;
    
    const urlWhatsApp = `https://wa.me/${numeroOficina}?text=${encodeURIComponent(textoWhatsApp)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const meusAgendamentos = agendamentos.filter(a => a.nome === usuario.nome);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-semibold">MechEase - Painel do Cliente</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && notifications.length > 0) {
                    onMarkNotificationRead();
                  }
                }}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              
              {showNotifications && (
                <Card className="absolute right-0 top-10 w-80 p-4 shadow-lg z-50">
                  <h3 className="font-semibold mb-2">Notificações</h3>
                  {notifications.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notif, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          {notif}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
            <span className="text-sm text-muted-foreground">Olá, {usuario.nome}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Agendamento Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Agendar Novo Serviço</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo de Serviço</label>
                <Select value={servico} onValueChange={setServico}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicosDisponiveis.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data do Serviço
                </label>
                <Calendar
                  mode="single"
                  selected={data}
                  onSelect={setData}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </label>
                <Select value={hora} onValueChange={setHora}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {horariosDisponiveis.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Descreva o problema ou observações adicionais..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Button onClick={handleAgendamento} className="w-full">
                  Agendar Serviço
                </Button>
                <Button onClick={enviarWhatsApp} variant="outline" className="w-full">
                  📱 Confirmar via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Meus Agendamentos */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Meus Agendamentos</h2>
          
          {meusAgendamentos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Você ainda não possui agendamentos.
            </p>
          ) : (
            <div className="space-y-4">
              {meusAgendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{agendamento.servico}</h3>
                      <p className="text-sm text-muted-foreground">
                        📅 {agendamento.data} às {agendamento.hora}
                      </p>
                      {agendamento.mensagem && (
                        <p className="text-sm">💬 {agendamento.mensagem}</p>
                      )}
                    </div>
                    <Badge variant={
                      agendamento.status === 'pendente' ? 'secondary' :
                      agendamento.status === 'aceite' ? 'default' : 'outline'
                    }>
                      {agendamento.status === 'pendente' ? 'Pendente' :
                       agendamento.status === 'aceite' ? 'Aceite' : 'Concluído'}
                    </Badge>
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