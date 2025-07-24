import { useState } from "react";
import { HomePage } from "@/components/HomePage";
import { LoginForm } from "@/components/LoginForm";
import { ClientDashboard } from "@/components/ClientDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
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

const Index = () => {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [tela, setTela] = useState<"home" | "login" | "cliente" | "admin">("home");
  const [notifications, setNotifications] = useState<string[]>([]);
  const { toast } = useToast();

  const handleLogin = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
    if (usuario.tipo === "cliente") {
      setTela("cliente");
    } else {
      setTela("admin");
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    setTela("home");
    setNotifications([]);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleAcceptAgendamento = (id: string) => {
    const agendamentoAtualizado = agendamentos.map(agendamento => 
      agendamento.id === id 
        ? { ...agendamento, status: "aceite" as const }
        : agendamento
    );
    setAgendamentos(agendamentoAtualizado);
    
    const agendamento = agendamentos.find(a => a.id === id);
    if (agendamento) {
      // Adicionar notificação para o cliente
      const notificacao = `✅ Agendamento aceite! Serviço de ${agendamento.servico} confirmado para ${agendamento.data} às ${agendamento.hora}.`;
      setNotifications(prev => [...prev, notificacao]);
    }
  };

  const handleCompleteAgendamento = (id: string) => {
    const agendamentoAtualizado = agendamentos.map(agendamento => 
      agendamento.id === id 
        ? { ...agendamento, status: "concluido" as const }
        : agendamento
    );
    setAgendamentos(agendamentoAtualizado);
  };

  const handleAddAgendamento = (agendamentoData: Omit<Agendamento, "id" | "status">) => {
    const novoAgendamento: Agendamento = {
      id: Date.now().toString(),
      ...agendamentoData,
      status: "pendente"
    };

    setAgendamentos(prev => [...prev, novoAgendamento]);
  };

  const handleMarkNotificationRead = () => {
    setNotifications([]);
  };

  // Renderização baseada no estado da tela
  if (tela === "home") {
    return <HomePage onLogin={() => setTela("login")} />;
  }

  if (tela === "login") {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        onBack={() => setTela("home")} 
      />
    );
  }

  if (tela === "cliente" && usuarioLogado) {
    return (
      <ClientDashboard
        usuario={usuarioLogado}
        agendamentos={agendamentos}
        onAddAgendamento={handleAddAgendamento}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />
    );
  }

  if (tela === "admin" && usuarioLogado) {
    return (
      <AdminDashboard
        usuario={usuarioLogado}
        agendamentos={agendamentos}
        onAcceptAgendamento={handleAcceptAgendamento}
        onCompleteAgendamento={handleCompleteAgendamento}
        onLogout={handleLogout}
      />
    );
  }

  return <HomePage onLogin={() => setTela("login")} />;
};

export default Index;
