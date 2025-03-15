import asyncio
import os
import subprocess
import json
import decky


class Ludusavi:
    bin_path: list[str] = None
    version: str = None

    _env: dict[str, str] = None

    def __init__(self, bin_paths: list[str]):
        self.set_env()

        for path in bin_paths:
            if self._try_initialize(*path.split(' ')):
                break
  
        
    def set_env(self):
        # Fix env for flatpak support.
        self._env = os.environ.copy()

        if 'XDG_RUNTIME_DIR' not in self._env:
            self._env['XDG_RUNTIME_DIR'] = '/run/user/1000'
        if 'LD_LIBRARY_PATH' in self._env:
            del self._env['LD_LIBRARY_PATH']
            
        decky.logger.debug('Using Environment: %s', self._env)

    def check_game(self, game_name: str):
        try:
            # Find if the game 'game_name' has support for backup.
            cmd = [*self.bin_path, 'find', '--api', '--backup', game_name]
            decky.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

            output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
            data = json.loads(output)
            return data["games"][game_name] is not None
        except Exception as e:
            output = e.output
            return False
        finally:
            decky.logger.debug(output)

    async def backup_game_async(self, game_name: str):
        cmd = [*self.bin_path, 'backup', '--api', '--force', game_name]
        decky.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

        process = await asyncio.create_subprocess_exec(*cmd, env=self.env, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
        stdout, _ = await process.communicate()

        result = stdout.decode()

        decky.logger.debug(result)

        decky.emit("backup_game_complete", result)
        return json.loads(result)


    def _try_initialize(self, *bin_path: str) -> bool:
        try:
            decky.logger.debug("Trying binary: %s", bin_path)     
            # output = subprocess.check_output([*bin_path, '--version'], env=self.env, stderr=subprocess.STDOUT, text=True)
            # output = subprocess.check_output(['flatpak', 'run', 'com.github.mtkennerly.ludusavi', '--version'], env={'XDG_DATA_DIRS': '/home/deck/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share:/usr/share', 'XDG_RUNTIME_DIR': '/run/user/1000'}, stderr=subprocess.STDOUT, text=True)
            output = subprocess.check_output([*bin_path, '--version'], env=self._env, stderr=subprocess.STDOUT, text=True)
            decky.logger.info("Using binary: %s", bin_path)
            decky.logger.debug("Command Output:  %s",output)
            
            self.bin_path = bin_path
            self.version = output

            return True
        except FileNotFoundError as e:
            decky.logger.error(e)
        except subprocess.CalledProcessError as e:
            decky.logger.error(e)
            decky.logger.error(e.output)
            return False
