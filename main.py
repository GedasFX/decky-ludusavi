import asyncio
import json
import subprocess
import app_config
import game_config
import decky_plugin
from ludusavi import Ludusavi


decky_plugin.logger.setLevel("DEBUG")

class Plugin:
    ludusavi: Ludusavi

    backup_task: asyncio.Task

    # Check plugin for initialization
    async def get_ludusavi_version(self):
        decky_plugin.logger.debug("Executing: get_ludusavi_version()")
        decky_plugin.logger.debug("bin_path "+  self.ludusavi.bin_path)
        return { "bin_path": self.ludusavi.bin_path, "version": self.ludusavi.version }
    
    async def get_config(self):
        decky_plugin.logger.debug("Executing: get_config()")
        return app_config.get_config()

    async def set_config(self, key: str, value: str):
        decky_plugin.logger.debug("Executing: set_config(%s, %s)", key, value)
        return app_config.set_config(key, value)
    
    async def verify_game_exists(self, game_name: str):
        decky_plugin.logger.debug("Executing: verify_game_exists(%s)", game_name)
        return { "exists": self.ludusavi.check_game(game_name) }
    
    async def backup_game(self, game_name: str):
        decky_plugin.logger.debug("Executing: backup_game(%s)", game_name)
        self.backup_task = asyncio.create_task(self.ludusavi.backup_game_async(game_name))

    async def backup_game_check_finished(self):
        decky_plugin.logger.debug("Executing: backup_game_check_finished()")
        if not self.backup_task.done():
            decky_plugin.logger.debug("Backup task still running")
            return { "completed": False }
        if self.backup_task is None:
            decky_plugin.logger.error("No backup task found!")
            return { "completed": False }
        try:
            result = { "completed": True, "result": self.backup_task.result() }
            decky_plugin.logger.debug("Backup task completed")
            self.backup_task = None
            return result
        except Exception as e:
                decky_plugin.logger.error("Error in backup task: %s", str(e))
                return { "completed": True, "result": None }

    async def get_game_config(self):
        decky_plugin.logger.debug("Executing: get_game_config()")
        return game_config.get_config()

    async def set_game_config(self, cfg: str):
        decky_plugin.logger.debug("Executing: set_game_config(cfg)")
        game_config.set_config(cfg)

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.ludusavi = Ludusavi(['/var/lib/flatpak/exports/bin/com.github.mtkennerly.ludusavi', 'ludusavi', 'ludusavi.exe'])

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        app_config.migrate()
        game_config.migrate()
