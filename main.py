import asyncio
import subprocess
import app_config
import decky_plugin
from ludusavi import Ludusavi


decky_plugin.logger.setLevel("DEBUG")

class Plugin:
    ludusavi: Ludusavi

    backup_task: asyncio.Task

    # Check plugin for initialization
    async def get_ludusavi_version(self):
        decky_plugin.logger.debug("Executing: get_ludusavi_version()")
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

    async def backup_game_sync(self, game_name: str):
        decky_plugin.logger.debug("Executing: backup_game_sync(%s)", game_name)
        # self.ludusavi.backup_game(game_name)
        cmd = [
            '/var/lib/flatpak/exports/bin/com.github.mtkennerly.ludusavi',
            'backup',
            '--api',
            '--force',
            'Pokemon - Emerald Version (U)'
        ]

        try:
            # Run the command securely
            process = subprocess.run(cmd, check=True, capture_output=True, text=True, shell=True)

            # Print the output and errors if needed
            decky_plugin.logger.debug("STDOUT: %s", process.stdout)
            decky_plugin.logger.debug("STDERR: %s", process.stderr)

            decky_plugin.logger.debug("wat")

        except subprocess.CalledProcessError as e:
            # Handle errors, if any
            decky_plugin.logger.debug("Error: %s", e)

    async def backup_game_check_finished(self):
        decky_plugin.logger.debug("Executing: backup_game_check_finished()")
        if not self.backup_task.done():
            return { "completed": False }
        
        result = { "completed": True, "result": self.backup_task.result() }
        self.backup_task = None
        return result

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.ludusavi = Ludusavi(['/var/lib/flatpak/exports/bin/com.github.mtkennerly.ludusavi', 'ludusavi', 'ludusavi.exe'])

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        app_config.migrate()
