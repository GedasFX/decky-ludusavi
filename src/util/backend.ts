import { call } from "@decky/api";
import { GameInfo, PersistentState } from "./state";

export const getLudusaviVersion = () => call<[], { bin_path?: string, version: string }>("get_ludusavi_version");

export const startBackup = (gameName: string) => call<[string]>("backup_game", gameName);

export const getConfig = <T>(key: keyof PersistentState) => call<[string], T>("get_config", key);
export const setConfig = <T>(key: keyof PersistentState, value: T) => call<[string, T]>("set_config", key, value);
export const getGameConfig = (key: string) => call<[string], GameInfo>("get_game_config", key);
export const setGameConfig = (key: string, value: GameInfo) => call<[string, GameInfo]>("set_game_config", key, value);

export const getPluginLogs = () => call<[], string[]>("get_plugin_logs");