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
        self._set_env()

        for path in bin_paths:
            if self._try_initialize(*path.split(" ")):
                break

        decky.logger.info("Using Binary: %s", self.bin_path)

    async def backup_game_async(self, game_name: str):
        await self._run_command(
            [*self.bin_path, "backup", "--api", "--force", game_name],
            "backup_game_complete",
        )

    async def _run_command(self, cmd: list[str], event: str):
        decky.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                env=self._env,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
            )
            stdout, _ = await process.communicate()

            json_str = stdout.decode()
            decky.logger.debug(json_str)

            json_end = json_str.rindex("}") + 1
            json_data = json.loads(json_str[:json_end])

            await decky.emit(event, json_data)

            return json_data
        except Exception as e:
            await decky.emit(event, {"errors": {"pluginError": e}})

    def _set_env(self):
        # Fix env for flatpak support.
        self._env = os.environ.copy()

        if "XDG_RUNTIME_DIR" not in self._env:
            self._env["XDG_RUNTIME_DIR"] = "/run/user/1000"
        if "LD_LIBRARY_PATH" in self._env:
            del self._env["LD_LIBRARY_PATH"]

        decky.logger.debug("Using Environment: %s", self._env)

    def _try_initialize(self, *bin_path: str) -> bool:
        try:
            decky.logger.debug("Trying binary: %s", bin_path)
            output = subprocess.check_output(
                [*bin_path, "--version"],
                env=self._env,
                stderr=subprocess.STDOUT,
                text=True,
            )

            decky.logger.debug("Command Output: %s", output)

            self.bin_path = bin_path
            self.version = output

            return True
        except FileNotFoundError as e:
            decky.logger.error(e)
        except subprocess.CalledProcessError as e:
            decky.logger.error(e)
            decky.logger.error(e.output)
            return False
