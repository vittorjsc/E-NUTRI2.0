from datetime import datetime, timedelta
from app.models import Goal, Adherence
from app.config import settings


def calculate_imc(weight_kg: float, height_cm: float) -> float:
    """Calcula IMC: peso / (altura_m ^ 2)"""
    height_m = height_cm / 100
    imc = weight_kg / (height_m ** 2)
    return round(imc, 2)


def classify_imc(imc: float) -> str:
    """Classifica IMC segundo padrão OMS (apenas informativo)"""
    if imc < 18.5:
        return "Abaixo do peso"
    elif imc < 25:
        return "Peso normal"
    elif imc < 30:
        return "Sobrepeso"
    elif imc < 35:
        return "Obesidade grau I"
    elif imc < 40:
        return "Obesidade grau II"
    else:
        return "Obesidade grau III"


def suggest_next_return_date(
    goal: Goal,
    adherence: Adherence | None,
    current_date: datetime
) -> datetime:
    """Sugere data de próximo retorno baseado em regras configuráveis"""
    base_days = {
        Goal.EMAGRECIMENTO: settings.RETURN_RULE_EMAGRECIMENTO,
        Goal.HIPERTROFIA: settings.RETURN_RULE_HIPERTROFIA,
        Goal.MANUTENCAO: settings.RETURN_RULE_MANUTENCAO,
        Goal.SAUDE_GERAL: settings.RETURN_RULE_SAUDE_GERAL,
    }
    
    days = base_days.get(goal, 30)
    
    # Reduz intervalo se adesão baixa
    if adherence == Adherence.BAIXA:
        days -= settings.RETURN_RULE_REDUCAO_ADESAO_BAIXA
    
    return current_date + timedelta(days=max(days, 7))  # Mínimo 7 dias


def get_default_templates(goal: Goal) -> dict[str, str]:
    """Retorna templates padrão baseados no objetivo"""
    
    templates = {
        Goal.EMAGRECIMENTO: {
            "diet": """RECOMENDAÇÕES DIETÉTICAS - EMAGRECIMENTO

• Priorize alimentos in natura e minimamente processados
• Consuma 5-6 refeições ao dia em porções moderadas
• Aumente o consumo de fibras (frutas, verduras, legumes)
• Reduza alimentos ultraprocessados e açúcares refinados
• Mantenha hidratação adequada (35ml/kg de peso)
• Prefira métodos de cocção: grelhado, assado, cozido, refogado

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "training": """RECOMENDAÇÕES DE ATIVIDADE FÍSICA - EMAGRECIMENTO

• Pratique exercícios aeróbicos 3-5x/semana (30-60 min)
• Inclua treinamento de força 2-3x/semana
• Caminhadas diárias de 30 minutos são benéficas
• Evite longos períodos sedentários (pausas a cada 1-2h)
• Progressão gradual de intensidade e volume

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "lifestyle": """RECOMENDAÇÕES DE ESTILO DE VIDA - EMAGRECIMENTO

• Durma 7-9 horas por noite
• Gerencie o estresse (meditação, respiração, hobbies)
• Evite refeições tardias (última refeição 2-3h antes de dormir)
• Mantenha rotina regular de horários
• Registre progresso e dificuldades

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual."""
        },
        Goal.HIPERTROFIA: {
            "diet": """RECOMENDAÇÕES DIETÉTICAS - HIPERTROFIA

• Aumente o consumo de proteínas de alto valor biológico
• Distribua proteínas ao longo do dia (1,6-2,2g/kg)
• Consuma carboidratos complexos para energia
• Inclua gorduras saudáveis (azeite, abacate, oleaginosas)
• Hidratação adequada (40ml/kg de peso)
• Refeição pós-treino rica em proteína e carboidrato

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "training": """RECOMENDAÇÕES DE ATIVIDADE FÍSICA - HIPERTROFIA

• Treinamento de força 3-5x/semana
• Priorize exercícios multiarticulares
• Progressão de carga e volume
• Descanso adequado entre treinos (48-72h por grupo muscular)
• Inclua exercícios aeróbicos moderados 2-3x/semana

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "lifestyle": """RECOMENDAÇÕES DE ESTILO DE VIDA - HIPERTROFIA

• Sono de qualidade (7-9h) para recuperação
• Evite estresse crônico
• Alimentação pós-treino em até 2h
• Mantenha consistência no treino e dieta
• Monitore progresso (medidas, força, composição corporal)

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual."""
        },
        Goal.MANUTENCAO: {
            "diet": """RECOMENDAÇÕES DIETÉTICAS - MANUTENÇÃO

• Mantenha alimentação equilibrada e variada
• Consuma todos os grupos alimentares com moderação
• Priorize alimentos in natura
• Hidratação adequada (35ml/kg de peso)
• Evite excessos e restrições extremas
• Pratique alimentação consciente

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "training": """RECOMENDAÇÕES DE ATIVIDADE FÍSICA - MANUTENÇÃO

• Pratique atividade física regular (150 min/semana moderada ou 75 min intensa)
• Combine exercícios aeróbicos e de força
• Escolha atividades que goste para manter adesão
• Varie os estímulos para evitar monotonia
• Mantenha movimento ao longo do dia

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "lifestyle": """RECOMENDAÇÕES DE ESTILO DE VIDA - MANUTENÇÃO

• Mantenha rotina de sono regular (7-9h)
• Gerencie estresse adequadamente
• Mantenha vida social ativa
• Pratique hobbies e atividades prazerosas
• Monitore peso e medidas periodicamente

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual."""
        },
        Goal.SAUDE_GERAL: {
            "diet": """RECOMENDAÇÕES DIETÉTICAS - SAÚDE GERAL

• Alimentação variada e colorida
• Priorize alimentos in natura e minimamente processados
• Consuma frutas, verduras e legumes diariamente
• Hidratação adequada (35ml/kg de peso)
• Evite excessos de açúcar, sal e gordura saturada
• Respeite sinais de fome e saciedade

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "training": """RECOMENDAÇÕES DE ATIVIDADE FÍSICA - SAÚDE GERAL

• Pratique atividade física regular (150 min/semana moderada)
• Combine exercícios aeróbicos, força e flexibilidade
• Escolha atividades prazerosas
• Evite sedentarismo prolongado
• Progressão gradual e segura

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual.""",
            "lifestyle": """RECOMENDAÇÕES DE ESTILO DE VIDA - SAÚDE GERAL

• Sono adequado e regular (7-9h)
• Gerencie estresse (técnicas de relaxamento)
• Mantenha relacionamentos saudáveis
• Evite tabagismo e consumo excessivo de álcool
• Realize check-ups médicos periódicos

IMPORTANTE: Este é um template educativo. Personalize conforme avaliação individual."""
        }
    }
    
    return templates.get(goal, templates[Goal.SAUDE_GERAL])

