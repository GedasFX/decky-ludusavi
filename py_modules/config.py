import decky
from settings import SettingsManager

app_config = SettingsManager(name="settings", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR)
game_config = SettingsManager(name="games", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR)
