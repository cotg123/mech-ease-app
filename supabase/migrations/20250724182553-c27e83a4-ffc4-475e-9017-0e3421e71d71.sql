-- Criar função security definer para verificar tipo de usuário
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS user_type AS $$
  SELECT tipo FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

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

CREATE POLICY "Usuários podem inserir seus próprios perfis" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Mecânicos podem ver todos os perfis" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (public.get_current_user_type() = 'mecanico');

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
USING (public.get_current_user_type() = 'mecanico');

CREATE POLICY "Mecânicos podem atualizar todos os agendamentos" 
ON public.agendamentos 
FOR UPDATE 
TO authenticated 
USING (public.get_current_user_type() = 'mecanico');

CREATE POLICY "Mecânicos podem deletar agendamentos" 
ON public.agendamentos 
FOR DELETE 
TO authenticated 
USING (public.get_current_user_type() = 'mecanico');