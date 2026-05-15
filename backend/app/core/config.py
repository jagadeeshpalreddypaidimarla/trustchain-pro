import os

class Settings:
    APP_NAME: str = "TrustChain Pro API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/trustchain"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/trustchain"
    REDIS_URL: str = "redis://localhost:6379/0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    SECRET_KEY: str = "trustchain-pro-secret-key-2025"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    RATE_LIMIT_PER_MINUTE: int = 60
    ALLOWED_ORIGINS: str = "http://localhost:3000"

settings = Settings()