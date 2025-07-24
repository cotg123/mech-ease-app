import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Clock, Settings, LogOut, User, Wrench } from "lucide-react";
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
  status: "pendente" | "confirmado" | "concluido";
}

const Index = () => {
  const [usuario, setUsuario] = useState<Usuario>({ nome: "", telefone: "", email: "", senha: "", tipo: "cliente" });
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [servico, setServico] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [data, setData] = useState<Date | undefined>(new Date());
  const [hora, setHora] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [tela, setTela] = useState<"login" | "agendamento" | "painel-mecanico" | "configuracao">("login");
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
    "Cambio",
    "Motor"
  ];

  const horariosDisponiveis = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const logar = () => {
    if (usuario.nome && usuario.senha && usuario.tipo) {
      setUsuarioLogado(usuario);
      if (usuario.tipo === "cliente") {
        setTela("agendamento");
      } else {
        setTela("painel-mecanico");
      }
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${usuario.nome}!`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
    }
  };

  const sair = () => {
    setUsuarioLogado(null);
    setTela("login");
    setUsuario({ nome: "", telefone: "", email: "", senha: "", tipo: "cliente" });
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleAgendamento = () => {
    if (!servico || !data || !hora) {
      toast({
        title: "Erro no agendamento",
        description: "Preencha serviço, data e horário.",
        variant: "destructive",
      });
      return;
    }

    const novoAgendamento: Agendamento = {
      id: Date.now().toString(),
      nome: usuarioLogado?.nome || "",
      telefone: usuarioLogado?.telefone || "",
      email: usuarioLogado?.email || "",
      servico,
      data: format(data, 'dd/MM/yyyy'),
      hora,
      mensagem,
      status: "pendente"
    };

    setAgendamentos([...agendamentos, novoAgendamento]);
    
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

    const numeroOficina = "5511999999999"; // Número da oficina
    const textoWhatsApp = `Olá! Gostaria de agendar um serviço:\n\n` +
      `📋 Serviço: ${servico}\n` +
      `📅 Data: ${format(data!, 'dd/MM/yyyy')}\n` +
      `🕐 Horário: ${hora}\n` +
      `👤 Nome: ${usuarioLogado?.nome}\n` +
      `📱 Telefone: ${usuarioLogado?.telefone}\n` +
      `📧 Email: ${usuarioLogado?.email}\n` +
      `💬 Observações: ${mensagem || "Nenhuma"}`;
    
    const urlWhatsApp = `https://wa.me/${numeroOficina}?text=${encodeURIComponent(textoWhatsApp)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <Wrench className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold">MechEase</h1>
          <p className="text-muted-foreground">Agendamento de Serviços Mecânicos</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={usuario.nome}
              onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <Input
              value={usuario.telefone}
              onChange={(e) => setUsuario({...usuario, telefone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={usuario.email}
              onChange={(e) => setUsuario({...usuario, email: e.target.value})}
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Senha</label>
            <Input
              type="password"
              value={usuario.senha}
              onChange={(e) => setUsuario({...usuario, senha: e.target.value})}
              placeholder="Sua senha"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Tipo de Usuário</label>
            <Select value={usuario.tipo} onValueChange={(value: "cliente" | "mecanico") => setUsuario({...usuario, tipo: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente
                  </div>
                </SelectItem>
                <SelectItem value="mecanico">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Mecânico
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={logar} className="w-full">
            Entrar
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderAgendamento = () => (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-semibold">MechEase</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, {usuarioLogado?.nome}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela("configuracao")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Agendar Serviço</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </main>
    </div>
  );

  const renderPainelMecanico = () => (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-semibold">MechEase - Painel do Mecânico</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Mecânico: {usuarioLogado?.nome}</span>
            <Button variant="ghost" size="sm" onClick={sair}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Agendamentos</h2>
          
          {agendamentos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum agendamento encontrado.
            </p>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Cliente</label>
                      <p className="font-medium">{agendamento.nome}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.telefone}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Serviço</label>
                      <p className="font-medium">{agendamento.servico}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Data/Hora</label>
                      <p className="font-medium">{agendamento.data}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.hora}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Status</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        agendamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        agendamento.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {agendamento.status}
                      </span>
                    </div>
                  </div>
                  {agendamento.mensagem && (
                    <div className="mt-3 pt-3 border-t">
                      <label className="text-xs text-muted-foreground">Observações</label>
                      <p className="text-sm">{agendamento.mensagem}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );

  const renderConfiguracao = () => (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-semibold">MechEase - Configurações</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações</h2>
          <div className="space-y-4">
            <Button 
              onClick={() => setTela("agendamento")} 
              variant="outline" 
              className="w-full justify-start"
            >
              Voltar ao Agendamento
            </Button>
            <Button 
              onClick={sair} 
              variant="destructive" 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );

  if (tela === "login") return renderLogin();
  if (tela === "painel-mecanico") return renderPainelMecanico();
  if (tela === "configuracao") return renderConfiguracao();
  return renderAgendamento();
};

export default Index;
