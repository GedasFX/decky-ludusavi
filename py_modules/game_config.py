from pathlib import Path
import decky_plugin

cfg_games_file = Path(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR) / "games.json"

def set_config(data: str):
    with open(cfg_games_file, 'w') as f:
        f.write(data)

def get_config():
    with open(cfg_games_file, 'r') as f:
        return f.read()