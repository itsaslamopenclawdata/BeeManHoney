from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BeeManHoney AI"
    API_V1_STR: str = "/api/v1"

    # DATABASE
    DATABASE_URL: str

    # REDIS
    REDIS_URL: str

    # SECURITY - JWT_SECRET must be set in environment
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # AI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # EMAIL - SMTP Configuration
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "BeeManHoney"
    
    # ADMIN EMAIL for notifications
    ADMIN_EMAIL: str = ""

    # Additional config (to match .env)
    APP_NAME: str = "BeeManHoney AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields in .env

settings = Settings()
