import subprocess

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
    
# Check the installation. 'or' operand checks from left to right, so 
__check_initialized('ludusavi') or __check_initialized('com.github.mtkennerly.ludusavi')
LudusaviState.initialized = True