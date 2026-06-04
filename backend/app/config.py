import json
import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


def _get_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_list(name: str, default: list[str]) -> list[str]:
    value = os.getenv(name)
    if not value:
        return default

    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return [str(item).rstrip("/") for item in parsed if str(item).strip()]
    except json.JSONDecodeError:
        pass

    return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]


class Settings:
    def __init__(self) -> None:
        self.environment = (os.getenv("ENVIRONMENT") or "development").strip().lower()
        self.app_name = os.getenv("APP_NAME") or "Hotel Restaurant API"
        self.api_v1_prefix = os.getenv("API_V1_PREFIX") or "/api"
        self.database_url = os.getenv("DATABASE_URL") or (
            "postgresql://user:password@localhost:5432/hotel_restaurant"
        )
        self.db_echo = _get_bool("DB_ECHO", False)
        self.secret_key = os.getenv("SECRET_KEY") or None
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM") or "HS256"
        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or "1440"
        )
        self.backend_cors_origins = _get_list(
            "BACKEND_CORS_ORIGINS",
            ["http://localhost:3000"],
        )
        self.enable_docs = _get_bool("ENABLE_DOCS", self.environment != "production")
        self.auto_create_tables = _get_bool(
            "AUTO_CREATE_TABLES", self.environment != "production"
        )
        self.firebase_service_account_key_path = (
            os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH") or None
        )
        self.firebase_service_account_key_json = (
            os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_JSON") or None
        )

        if not self.secret_key:
            if self.environment == "production":
                raise RuntimeError(
                    "SECRET_KEY must be set when ENVIRONMENT=production."
                )
            self.secret_key = "dev-only-secret-key-change-before-deploy"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
