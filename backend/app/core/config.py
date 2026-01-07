import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    
    DATABASE_URL = os.getenv("DATABASE_URL","")
    REDIS_URL = os.getenv("REDIS_URL","")
    EXTERNAL_API_KEY = os.getenv("EXTERNAL_API_KEY","")
    EXTERNAL_API_BASE_URL = os.getenv(
        "EXTERNAL_API_BASE_URL",
        "https://example-cricket-api.com"
    )
    RAPID_API_KEY = os.getenv("RAPID_API_KEY", "")
    TWITTER_HOST = os.getenv("TWITTER_HOST", "twitter241.p.rapidapi.com")
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

settings = Settings()
