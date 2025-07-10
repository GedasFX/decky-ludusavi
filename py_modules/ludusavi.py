import asyncio
import os
import subprocess
import json
import decky  # type: ignore


class Ludusavi:
    bin_path: list[str] = None
    version: str

    _env: dict[str, str]

    def __init__(self, bin_paths: list[str]):
        self._set_env()

        for path in bin_paths:
            if self._try_initialize(*path.split(" ")):
                break

        decky.logger.info("Using Binary: %s", self.bin_path)

    async def backup_game_async(self, game_name: str):
        return await self._run_command(
            ["backup", "--force", game_name],
            "backup_game_complete",
        )

    async def restore_game_async(
        self,
        game_name: str,
        backup_id: str,
        preview: bool = False,
        api_mode: bool = True,
    ):
        cmd = ["restore", "--backup", backup_id, game_name]
        if preview:
            cmd.append("--preview")
        else:
            cmd.append("--force")

        return await self._run_command(
            cmd,
            "restore_game_complete",
            api_mode=api_mode,
        )

    async def sync_game_cloud_state_async(
        self,
        game_name: str,
        direction: str = "download",
        preview: bool = False,
        api_mode: bool = True,
    ):
        if not (direction == "upload" or direction == "download"):
            raise ValueError("Invalid direction. Use 'upload' or 'download'.")

        cmd = ["cloud", direction, game_name]
        if preview:
            cmd.append("--preview")
        else:
            cmd.append("--force")

        return await self._run_command(
            cmd,
            "sync_game_cloud_state_complete",
            api_mode=api_mode,
        )

    async def get_game_backups(self, game_name: str):
        return await self._run_command(
            ["backups", game_name],
        )

    async def get_config(self):
        return await self._run_command(
            ["config", "show"],
        )

    async def normalize_game_name_async(self, game_name: str):
        return await self._run_command(
            ["find", "--normalized", game_name],
            "normalize_game_name_complete",
            api_mode=False,
        )

    async def _run_command(
        self, cmd: list[str], event: str | None = None, api_mode: bool = True
    ):
        if not self.bin_path:
            raise Exception("Ludusavi binary not found")

        cmd = [*self.bin_path, *cmd]
        if api_mode:
            cmd.append("--api")

        decky.logger.info("Running command: %s", subprocess.list2cmdline(cmd))

        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                env=self._env,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
            )
            stdout, _ = await process.communicate()

            result_str = stdout.decode()
            decky.logger.info(result_str)

            if api_mode:
                json_end = result_str.rindex("}") + 1
                result_str = json.loads(result_str[:json_end])

            if event:
                await decky.emit(event, result_str)

            return result_str

        except Exception as e:
            if event:
                await decky.emit(event, {"errors": {"pluginError": str(e)}})

            raise

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

    async def install(self):
        process = await asyncio.create_subprocess_exec(
            *[
                "flatpak",
                "install",
                "--or-update",
                "-u",
                "-y",
                "--app",
                "com.github.mtkennerly.ludusavi",
                "--noninteractive",
            ],
            env=self._env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )
        stdout, _ = await process.communicate()
        decky.logger.info("Ludusavi Update Result: %s", stdout.decode())

        if process.returncode != 0:
            await decky.emit(
                "install_ludusavi_complete",
                {"errors": {"pluginError": "Failed to install Ludusavi."}},
            )
            return

        self.__init__(["flatpak run com.github.mtkennerly.ludusavi"])
        await decky.emit("install_ludusavi_complete", {"result": "ok"})
