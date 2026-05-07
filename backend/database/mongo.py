from motor.motor_asyncio import AsyncIOMotorClient
from config import get_settings

settings = get_settings()

_client: AsyncIOMotorClient | None = None

async def connect_mongo():
    global _client
    try:
        _client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=3000)
        await _client.admin.command("ping")
        print("[OK] MongoDB connected")
    except Exception as e:
        print(f"[WARN] MongoDB unavailable ({e}) - AI analysis storage disabled")
        _client = None

async def close_mongo():
    global _client
    if _client:
        _client.close()

def get_mongo_db():
    if _client is None:
        return None
    return _client[settings.mongodb_db_name]

def get_collection(name: str):
    db = get_mongo_db()
    if db is None:
        return None
    return db[name]
