from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path


BASEDIR = Path(__file__).parent.parent


class Settings(BaseSettings):
    jwt_secret: str = Field(alias="SECRET_KEY")
    origins: list[str] = Field(alias="ORIGINS")
    db_name: str = Field(alias="POSTGRES_DB")
    db_user: str = Field(alias="POSTGRES_USER")
    db_password: str = Field(alias="POSTGRES_PASSWORD")
    db_host: str = Field(alias="POSTGRES_HOST")
    db_port: int = Field(alias="POSTGRES_PORT")
    debug: bool = Field(alias="DEBUG")

    model_config = SettingsConfigDict(env_file=".env")

    SettingsConfigDict(env_file=BASEDIR / ".env")

    @property
    def database_url(self) -> str:
        return (f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:"
                f"{self.db_port}/{self.db_name}")

settings = Settings()

