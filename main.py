import asyncio
import config
import decky
from ludusavi import Ludusavi

decky.logger.setLevel("INFO")


class Plugin:
    ludusavi: Ludusavi

    # Check plugin for initialization
    async def get_ludusavi_version(self):
        decky.logger.debug("Executing: get_ludusavi_version()")
        decky.logger.info("bin_path: %s", self.ludusavi.bin_path)
        return {"bin_path": self.ludusavi.bin_path, "version": self.ludusavi.version}

    async def get_config(self, key: str):
        decky.logger.debug("Executing: get_config('%s')", key)
        return config.app_config.getSetting(key)

    async def set_config(self, key: str, value):
        decky.logger.debug("Executing: set_config('%s', '%s')", key, value)
        return config.app_config.setSetting(key, value)

    async def get_game_config(self, key: str):
        decky.logger.debug("Executing: get_game_config('%s')", key)
        return config.game_config.getSetting(key)

    async def set_game_config(self, key: str, value):
        decky.logger.debug("Executing: set_game_config('%s', '%s')", key, value)
        config.game_config.setSetting(key, value)

    async def backup_game(self, game_name: str):
        decky.logger.debug("Executing: backup_game('%s')", game_name)
        asyncio.create_task(self.ludusavi.backup_game_async(game_name))

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.ludusavi = Ludusavi(
            ["flatpak run com.github.mtkennerly.ludusavi", "ludusavi", "ludusavi.exe"]
        )

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        config.migrate()
