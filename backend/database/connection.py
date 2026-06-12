from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import logging
from config import Config

logger = logging.getLogger(__name__)
_client = None

def get_db():
    global _client
    if _client is None:
        try:
            _client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
            _client.admin.command("ping")
            logger.info("MongoDB connected")
        except ConnectionFailure as e:
            logger.critical("MongoDB connection failed: %s", e)
            raise
    return _client[Config.DB_NAME]

def close_db():
    global _client
    if _client:
        _client.close()
        _client = None
