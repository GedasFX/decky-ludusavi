import logging
from pathlib import Path
import decky_plugin
from logging.handlers import RotatingFileHandler

api_logger = logging.getLogger("Rotating Log")
api_logger.setLevel(logging.DEBUG)

handler = RotatingFileHandler(Path(decky_plugin.DECKY_PLUGIN_LOG_DIR) / "api_calls.log", maxBytes=256_000, backupCount=2)
handler.setFormatter(logging.Formatter('[%(asctime)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))

api_logger.addHandler(handler)

