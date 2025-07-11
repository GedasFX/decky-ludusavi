import asyncio
import config
import decky  # type: ignore
from ludusavi import Ludusavi

decky.logger.setLevel("INFO")


class Plugin:
    ludusavi: Ludusavi

    # Check plugin for initialization
    async def get_ludusavi_version(self):
        decky.logger.debug("Executing: get_ludusavi_version()")
        return {"bin_path": self.ludusavi.bin_path, "version": self.ludusavi.version}

    async def install_ludusavi(self):
        decky.logger.debug("Executing: install_ludusavi()")
        asyncio.create_task(self.ludusavi.install())

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

    async def normalize_game_name(self, game_name: str):
        decky.logger.debug("Executing: normalize_game_name('%s')", game_name)
        result = await asyncio.create_task(self.ludusavi.normalize_game_name_async(game_name))
        return result

    async def restore_game(
        self, game_name: str, backup_id: str, preview: bool, api_mode: bool
    ):
        decky.logger.debug(
            "Executing: restore_game('%s', '%s', %b, %b)",
            game_name,
            backup_id,
            preview,
            api_mode,
        )
        asyncio.create_task(
            self.ludusavi.restore_game_async(game_name, backup_id, preview, api_mode)
        )

    async def sync_game_cloud_state(
        self, game_name: str, direction: str, preview: bool, api_mode: bool
    ):
        decky.logger.debug(
            "Executing: sync_game_cloud_state('%s', '%s', %b, %b)",
            game_name,
            direction,
            preview,
            api_mode,
        )
        asyncio.create_task(
            self.ludusavi.sync_game_cloud_state_async(
                game_name, direction, preview, api_mode
            )
        )

    async def get_game_backups(self, game_name: str):
        decky.logger.debug("Executing: get_game_backups('%s')", game_name)
        return await self.ludusavi.get_game_backups(game_name)

    async def get_plugin_logs(self):
        decky.logger.debug("Executing: get_plugin_logs()")
        with open(decky.DECKY_PLUGIN_LOG) as f:
            return f.read()

    async def get_ludusavi_config(self):
        decky.logger.debug("Executing: get_ludusavi_config()")
        return await self.ludusavi.get_config()

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
