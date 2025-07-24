import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wrench, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Usuario {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  tipo: "cliente" | "mecanico";
}

interface LoginFormProps {
  onLogin: (usuario: Usuario) => void;
  onBack: () => void;
}

export const LoginForm = ({ onLogin, onBack }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "cadastro">("login");
  const [usuario, setUsuario] = useState<Usuario>({ 
    nome: "", 
    telefone: "", 
    email: "", 
    senha: "", 
    tipo: "cliente" 
  });
  const { toast } = useToast();

  const handleLogin = () => {
    if (!usuario.nome || !usuario.senha) {
      toast({
        title: "Erro no login",
        description: "Preencha nome e senha.",
        variant: "destructive",
      });
      return;
    }

    onLogin(usuario);
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo, ${usuario.nome}!`,
    });
  };

  const handleCadastro = () => {
    if (!usuario.nome || !usuario.telefone || !usuario.email || !usuario.senha) {
      toast({
        title: "Erro no cadastro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    onLogin(usuario);
    toast({
      title: "Cadastro realizado com sucesso!",
      description: `Bem-vindo, ${usuario.nome}!`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <Wrench className="mx-auto h-12 w-12 text-primary mb-2" />
            <h1 className="text-2xl font-bold">MechEase</h1>
            <p className="text-muted-foreground text-sm">Acesso ao Sistema</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "cadastro")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={usuario.nome}
                onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
                placeholder="Seu nome completo"
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
              <label className="text-sm font-medium">Tipo de Conta</label>
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
            
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </TabsContent>

          <TabsContent value="cadastro" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo *</label>
              <Input
                value={usuario.nome}
                onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Telefone *</label>
              <Input
                value={usuario.telefone}
                onChange={(e) => setUsuario({...usuario, telefone: e.target.value})}
                placeholder="+351 910 000 000"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={usuario.email}
                onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Senha *</label>
              <Input
                type="password"
                value={usuario.senha}
                onChange={(e) => setUsuario({...usuario, senha: e.target.value})}
                placeholder="Crie uma senha"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Tipo de Conta</label>
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
            
            <Button onClick={handleCadastro} className="w-full">
              Criar Conta
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};