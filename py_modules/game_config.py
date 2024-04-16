from pathlib import Path
import decky_plugin

cfg_games_file = Path(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR) / "games.json"

def migrate():
    if not cfg_games_file.is_file():
        cfg_games_file.touch()

def set_config(data: str):
    with open(cfg_games_file, 'w') as f:
        f.write(data)

def get_config():
    with open(cfg_games_file, 'r') as f:
        file = f.read()
    decky_plugin.logger.debug(file)
    return file