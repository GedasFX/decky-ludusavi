import subprocess
import json

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

# Check the installation. 'or' operand checks from left to right, so that it will not check later if one was found.
# com.github.mtkennerly.ludusavi comes from flatpak.
__check_initialized('com.github.mtkennerly.ludusavi') or __check_initialized('ludusavi') or __check_initialized('ludusavi.exe')
LudusaviState.initialized = True

check_game("Pokemon Emerald")