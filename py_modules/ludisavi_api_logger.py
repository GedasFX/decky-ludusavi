import logging
# import decky_plugin
from logging.handlers import RotatingFileHandler

api_logger = logging.getLogger("Rotating Log")
api_logger.setLevel(logging.INFO)

handler = RotatingFileHandler("/home/user/tmp/logdir/a", maxBytes=256_000, backupCount=2)
handler.setFormatter(logging.Formatter('[%(asctime)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))

api_logger.addHandler(handler)

