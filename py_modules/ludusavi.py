import asyncio
import os
import subprocess
import json
import decky_plugin


class Ludusavi:
    bin_path: str = None
    version: str = None

    initialized: bool = False

    def __init__(self, bin_paths: list[str]):
        for path in bin_paths:
            if self._check_initialized(path):
                break
        self.initialized = True


    def check_game(self, game_name: str):
        try:
            # Find if the game 'game_name' has support for backup.
            cmd = [self.bin_path, 'find', '--api', '--backup', game_name]
            decky_plugin.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

            output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
            data = json.loads(output)
            return data["games"][game_name] is not None
        except subprocess.CalledProcessError as e:
            output = e.output
            return False
        finally:
            decky_plugin.logger.debug(output)

    def backup_game(self, game_name: str):
        cmd = [self.bin_path, 'backup', '--api', '--force', game_name]
        decky_plugin.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

        try:
            output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
        except subprocess.CalledProcessError as e:
            output = e.output
        finally:
            decky_plugin.logger.debug(output)

    async def backup_game_async(self, game_name: str):
        cmd = [self.bin_path, 'backup', '--api', '--force', game_name]
        decky_plugin.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

        # Workaround for flatpacks
        l_env = os.environ.copy()
        if 'XDG_RUNTIME_DIR' not in l_env:
            l_env['XDG_RUNTIME_DIR'] = '/run/user/1000'

        process = await asyncio.create_subprocess_exec(*cmd, env=l_env, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
        stdout, _ = await process.communicate()

        result = stdout.decode()

        decky_plugin.logger.debug(result)
        return json.loads(result)


    def _check_initialized(self, bin_path: str) -> bool:
        try:
            if(bin_path == '/var/lib/flatpak/exports/bin/com.github.mtkennerly.ludusavi'):
                bin_path = 'flatpak run com.github.mtkennerly.ludusavi'
                
            decky_plugin.logger.debug("Trying binary: %s", bin_path)
            
            output = subprocess.check_output([bin_path, '--version'], stderr=subprocess.STDOUT, text=True)
            decky_plugin.logger.info("Using binary: %s", bin_path)
            
            self.bin_path = bin_path
            self.version = output
            
            return True
        except FileNotFoundError:
            return False
