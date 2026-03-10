-- Execute no Supabase: SQL Editor → New query → Cole o conteúdo abaixo → Run
-- Adiciona a coluna ip_address na tabela alerts (para limite de 1 alerta por IP a cada 10 min)

ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS ip_address TEXT;

COMMENT ON COLUMN public.alerts.ip_address IS 'IP do cliente no momento do alerta (para rate limit de 10 min)';
