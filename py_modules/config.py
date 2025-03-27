import decky  # type: ignore
from settings import SettingsManager  # type: ignore
import shutil
import os

app_config = SettingsManager(
    name="settings", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR
)
game_config = SettingsManager(
    name="games", settings_directory=decky.DECKY_PLUGIN_RUNTIME_DIR
)


def migrate():
    version = app_config.getSetting("version", 0)

    if version <= 0:
        _migrate_v1()


def _migrate_v1():
    app_config.setSetting("auto_backup_toast_enabled", True)

    if os.path.isfile(decky.DECKY_PLUGIN_SETTINGS_DIR + "/games.json"):
        shutil.move(
            decky.DECKY_PLUGIN_SETTINGS_DIR + "/games.json",
            decky.DECKY_PLUGIN_RUNTIME_DIR + "/games.json",
        )

    app_config.setSetting("version", 1)
