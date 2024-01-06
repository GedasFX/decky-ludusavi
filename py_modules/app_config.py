import decky_plugin
from pathlib import Path

cfg_property_file = Path(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR) / "plugin.properties"

def get_config(): 
    with open(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR) as f:
        lines = f.readlines()
        lines = list(map(lambda x: x.strip().split('='), lines))
        return lines

def set_config(key: str, value: str):
    with open(cfg_property_file, "r") as f:
        lines = f.readlines()

    with open(cfg_property_file, "w") as f:
        found = False
        for line in lines:
            if line.startswith(key + '='):
                f.write(f"{key}={value}\n")
                found = True
            else:
                f.write(line)

        if not found:
            f.write(f"{key}={value}\n")