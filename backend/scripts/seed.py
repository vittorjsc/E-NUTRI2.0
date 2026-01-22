"""
Script para criar dados de exemplo (seed)
Cria 1 profissional e 2 pacientes com check-ins
"""
import sys
from pathlib import Path

# Adiciona o diretório raiz ao path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, select
from app.database import engine, init_db
from app.models import Professional, Patient, CheckIn, Sex, ActivityLevel, Goal, Adherence
from app.security import get_password_hash
from app.utils import calculate_imc, suggest_next_return_date
from datetime import datetime, timedelta
from uuid import uuid4


def seed():
    """Cria dados de exemplo"""
    init_db()
    
    with Session(engine) as session:
        # Verifica se já existe profissional
        statement = select(Professional).where(Professional.email == "nutri@example.com")
        existing = session.exec(statement).first()
        
        if existing:
            print("Dados de seed já existem. Use 'python scripts/seed.py --reset' para resetar.")
            return
        
        # Cria profissional
        professional = Professional(
            id=uuid4(),
            name="Dr. Nutricionista Exemplo",
            email="nutri@example.com",
            password_hash=get_password_hash("nutri123"),
            created_at=datetime.utcnow()
        )
        session.add(professional)
        session.commit()
        session.refresh(professional)
        
        print(f"✓ Profissional criado: {professional.email} (senha: nutri123)")
        
        # Paciente 1: Emagrecimento
        patient1 = Patient(
            id=uuid4(),
            professional_id=professional.id,
            full_name="Maria Silva",
            birth_date=datetime(1990, 5, 15),
            sex=Sex.FEMININO,
            height_cm=165.0,
            activity_level=ActivityLevel.SEDENTARIO,
            goal=Goal.EMAGRECIMENTO,
            notes="Paciente iniciando acompanhamento nutricional.",
            cpf_last4="1234",
            created_at=datetime.utcnow() - timedelta(days=60),
            updated_at=datetime.utcnow() - timedelta(days=60)
        )
        session.add(patient1)
        session.commit()
        session.refresh(patient1)
        
        print(f"✓ Paciente 1 criado: {patient1.full_name}")
        
        # Check-ins do paciente 1
        dates = [
            datetime.utcnow() - timedelta(days=60),
            datetime.utcnow() - timedelta(days=30),
            datetime.utcnow() - timedelta(days=14),
        ]
        weights = [75.0, 73.5, 72.0]
        
        for i, (date, weight) in enumerate(zip(dates, weights)):
            imc = calculate_imc(weight, patient1.height_cm)
            next_return = suggest_next_return_date(
                patient1.goal,
                Adherence.MEDIA if i < 2 else Adherence.ALTA,
                date
            )
            
            checkin = CheckIn(
                id=uuid4(),
                patient_id=patient1.id,
                date=date,
                weight_kg=weight,
                waist_cm=90.0 - (i * 2),
                hip_cm=100.0 - (i * 1.5),
                body_fat_pct=28.0 - (i * 1.5),
                adherence=Adherence.MEDIA if i < 2 else Adherence.ALTA,
                observations=f"Consulta {i+1}: Evolução positiva." if i > 0 else "Consulta inicial.",
                imc=imc,
                recommendation_template_diet="Priorizar alimentos in natura, reduzir processados.",
                recommendation_template_training="Caminhadas 30min/dia, 5x/semana.",
                recommendation_template_lifestyle="Dormir 8h, reduzir estresse.",
                next_return_date=next_return,
                created_at=date
            )
            session.add(checkin)
        
        session.commit()
        print(f"  ✓ 3 check-ins criados para {patient1.full_name}")
        
        # Paciente 2: Hipertrofia
        patient2 = Patient(
            id=uuid4(),
            professional_id=professional.id,
            full_name="João Santos",
            birth_date=datetime(1985, 8, 20),
            sex=Sex.MASCULINO,
            height_cm=180.0,
            activity_level=ActivityLevel.ALTO,
            goal=Goal.HIPERTROFIA,
            notes="Atleta amador buscando ganho de massa muscular.",
            cpf_last4="5678",
            created_at=datetime.utcnow() - timedelta(days=45),
            updated_at=datetime.utcnow() - timedelta(days=45)
        )
        session.add(patient2)
        session.commit()
        session.refresh(patient2)
        
        print(f"✓ Paciente 2 criado: {patient2.full_name}")
        
        # Check-ins do paciente 2
        dates2 = [
            datetime.utcnow() - timedelta(days=45),
            datetime.utcnow() - timedelta(days=21),
        ]
        weights2 = [70.0, 72.5]
        
        for i, (date, weight) in enumerate(zip(dates2, weights2)):
            imc = calculate_imc(weight, patient2.height_cm)
            next_return = suggest_next_return_date(
                patient2.goal,
                Adherence.ALTA,
                date
            )
            
            checkin = CheckIn(
                id=uuid4(),
                patient_id=patient2.id,
                date=date,
                weight_kg=weight,
                waist_cm=85.0,
                hip_cm=95.0,
                body_fat_pct=15.0 + (i * 0.5),
                adherence=Adherence.ALTA,
                observations=f"Consulta {i+1}: Ganho de massa conforme esperado." if i > 0 else "Consulta inicial.",
                imc=imc,
                recommendation_template_diet="Aumentar proteínas, carboidratos pós-treino.",
                recommendation_template_training="Treino de força 4x/semana, progressão de carga.",
                recommendation_template_lifestyle="Sono 8h, recuperação adequada.",
                next_return_date=next_return,
                created_at=date
            )
            session.add(checkin)
        
        session.commit()
        print(f"  ✓ 2 check-ins criados para {patient2.full_name}")
        
        print("\n✅ Seed concluído com sucesso!")
        print("\nCredenciais de acesso:")
        print("  Email: nutri@example.com")
        print("  Senha: nutri123")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Resetar dados existentes")
    args = parser.parse_args()
    
        if args.reset:
        with Session(engine) as session:
            # Deleta tudo (cuidado em produção!)
            from sqlmodel import text
            session.exec(text("DELETE FROM checkins"))
            session.exec(text("DELETE FROM patients"))
            session.exec(text("DELETE FROM professionals"))
            session.commit()
        print("Dados resetados.")
    
    seed()

