import asyncio
import os
import subprocess
import json
import decky


class Ludusavi:
    bin_path: str = None
    version: str = None

    initialized: bool = False
    env: dict[str, str] = None

    def __init__(self, bin_paths: list[str]):
        self.set_env()
        for path in bin_paths:
            if self._check_initialized(path):
                break
        self.initialized = True
  
        
    def set_env(self):
        #flatpak env variables
        self.Env = os.environ.copy()

        if 'XDG_RUNTIME_DIR' not in self.Env:
            self.Env['XDG_RUNTIME_DIR'] = '/run/user/1000'
        if 'WAYLAND_DISPLAY' not in self.Env:
            self.Env['WAYLAND_DISPLAY'] = 'gamescope-0'
        if 'LIBRARY_PATH' not in self.Env:
            self.Env['LIBRARY_PATH'] = '/usr/lib/x86_64-linux-gnu'

    def check_game(self, game_name: str):
        try:
            # Find if the game 'game_name' has support for backup.
            cmd = [self.bin_path, 'find', '--api', '--backup', game_name]
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
        cmd = [self.bin_path, 'backup', '--api', '--force', game_name]
        decky.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

        process = await asyncio.create_subprocess_exec(*cmd, env=self.env, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
        stdout, _ = await process.communicate()

        result = stdout.decode()

        decky.logger.debug(result)
        
        decky.emit("backup_game_complete", result)
        return json.loads(result)


    def _check_initialized(self, bin_path: str) -> bool:
        try:
            decky.logger.debug("Trying binary: %s", bin_path)     
            output = subprocess.check_output([bin_path, '--version'], env=self.Env, stderr=subprocess.STDOUT, text=True)
            decky.logger.info("Using binary: %s", bin_path)
            decky.logger.debug("Command Output:  %s",output) 
            
            self.bin_path = bin_path
            self.version = output
            
            return True
        except Exception as e:
            decky.logger.error(e)
            return False
