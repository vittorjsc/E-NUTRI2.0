from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./enutri.db"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ENCRYPTION_KEY: str = "dev-encryption-key-change-in-production"
    JWT_SECRET_KEY: str = "dev-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # Return date rules (in days)
    RETURN_RULE_EMAGRECIMENTO: int = 14
    RETURN_RULE_HIPERTROFIA: int = 21
    RETURN_RULE_MANUTENCAO: int = 30
    RETURN_RULE_SAUDE_GERAL: int = 30
    RETURN_RULE_REDUCAO_ADESAO_BAIXA: int = 7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

