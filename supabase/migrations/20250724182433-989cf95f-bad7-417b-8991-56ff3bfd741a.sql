-- Criar tipo enum para tipo de usuário
CREATE TYPE public.user_type AS ENUM ('cliente', 'mecanico');

-- Criar tipo enum para status do agendamento
CREATE TYPE public.appointment_status AS ENUM ('pendente', 'aceite', 'concluido');

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT NOT NULL,
  tipo user_type NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  servico TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  mensagem TEXT,
  status appointment_status NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Mecânicos podem ver todos os perfis" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND tipo = 'mecanico'
  )
);

-- Políticas RLS para agendamentos
CREATE POLICY "Clientes podem ver seus próprios agendamentos" 
ON public.agendamentos 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Clientes podem criar agendamentos" 
ON public.agendamentos 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Clientes podem atualizar seus próprios agendamentos" 
ON public.agendamentos 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Mecânicos podem ver todos os agendamentos" 
ON public.agendamentos 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND tipo = 'mecanico'
  )
);

CREATE POLICY "Mecânicos podem atualizar todos os agendamentos" 
ON public.agendamentos 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND tipo = 'mecanico'
  )
);

CREATE POLICY "Mecânicos podem deletar agendamentos" 
ON public.agendamentos 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND tipo = 'mecanico'
  )
);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email, tipo)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email), 
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'tipo')::user_type, 'cliente')
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir usuário mecânico padrão para testes
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'mecanico@oficina.pt',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nome": "João Silva", "tipo": "mecanico"}'::jsonb
);

-- Inserir perfil do mecânico
INSERT INTO public.profiles (user_id, nome, email, telefone, tipo)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'João Silva',
  'mecanico@oficina.pt',
  '+351 912 345 678',
  'mecanico'
);