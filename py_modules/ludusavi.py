import asyncio
import logging
import subprocess
import json
from ludisavi_api_logger import api_logger

class LudusaviState:
    bin_path: str = None
    version: str = None

    initialized: bool = False


def __check_initialized(bin_path: str) -> bool:
    try:
        output = subprocess.check_output([bin_path, '--version'], stderr=subprocess.STDOUT, text=True)
        
        LudusaviState.bin_path = bin_path
        LudusaviState.version = output
        
        return True
    except FileNotFoundError:
        return False

def check_game(game_name: str):
    try:
        # Find if the game 'game_name' has support for backup.
        output = subprocess.check_output([LudusaviState.bin_path, 'find', '--api', '--backup', game_name], stderr=subprocess.STDOUT, text=True)
        data = json.loads(output)
        return data["games"][game_name] is not None
    except subprocess.CalledProcessError as e:
        return False


def backup_game(game_name: str):
    cmd = [LudusaviState.bin_path, 'backup', '--api', '--force', game_name]
    api_logger.info("Running command: %s", subprocess.list2cmdline(cmd))

    try:
        output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        output = e.output
    finally:
        api_logger.info(output)

async def backup_game_async(game_name: str):
    cmd = [LudusaviState.bin_path, 'backup', '--api', '--force', game_name]
    api_logger.info("Running command: %s", subprocess.list2cmdline(cmd))

    process = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    stdout, _ = await process.communicate()

    result = stdout.decode()

    api_logger.info("Command result: %s", result)
    return json.loads(result)

# Check the installation. 'or' operand checks from left to right, so that it will not check later if one was found.
# com.github.mtkennerly.ludusavi comes from flatpak.
__check_initialized('com.github.mtkennerly.ludusavi') or __check_initialized('ludusavi') or __check_initialized('ludusavi.exe')
LudusaviState.initialized = True

# backup_game("Pokemon Emerald")

# backup_game()

task = None
async def lemain():
    task = asyncio.get_event_loop().create_task(backup_game_async("Pokemon Emerald"))
    while not task.done():
        await asyncio.sleep(0.2)

    a = 5
    b = task.result()
    c = 5

# asyncio.get_event_loop().run_until_complete(lemain())
# asyncio.run(lemain())