import { addEventListener, call, removeEventListener } from "@decky/api";
import { GameInfo, PersistentState } from "./state";

export const getLudusaviVersion = () => call<[], { bin_path?: string, version: string }>("get_ludusavi_version");
export const installLudusavi = () => asyncHandler<{ error?: unknown }>(() => call("install_ludusavi"), "install_ludusavi_complete");

export const backup = (gameName: string) => asyncHandler<LudusaviBackupResponse>(() => call("backup_game", gameName), "backup_game_complete");
export const restore = (gameName: string, backupId: string) => asyncHandler<LudusaviBackupResponse>(() => call("restore_game", gameName, backupId, false, true), "restore_game_complete");
export const restorePreview = (gameName: string, backupId: string) => asyncHandler<string>(() => call("restore_game", gameName, backupId, true, false), "restore_game_complete");
export const normalizeGameName = (gameName: string) => asyncHandler<string>(() => call("normalize_game_name", gameName), "normalize_game_name_complete");

export const getGameBackups = (gameName: string) => call<[string], LudusaviBackupListResponse>("get_game_backups", gameName);

export const getGameCloudState = (gameName: string) => asyncHandler<string>(() => call("sync_game_cloud_state", gameName, 'download', true, false), "sync_game_cloud_state_complete");
export const syncGameCloudState = (gameName: string, direction: 'upload' | 'download') => asyncHandler<string>(() => call("sync_game_cloud_state", gameName, direction, false, true), "sync_game_cloud_state_complete");

export const getLudusaviConfig = () => call<[], LudusaviConfig>("get_ludusavi_config");

export const getConfig = <T>(key: keyof PersistentState) => call<[string], T>("get_config", key);
export const setConfig = <T>(key: keyof PersistentState, value: T) => call<[string, T]>("set_config", key, value);
export const getGameConfig = (key: string) => call<[string], GameInfo>("get_game_config", key);
export const setGameConfig = (key: string, value: GameInfo) => call<[string, GameInfo]>("set_game_config", key, value);

export const getPluginLogs = () => call<[], string[]>("get_plugin_logs");


const asyncHandler = <TResult>(func: () => Promise<void>, event: string) => {
    return new Promise<TResult>((resolve, reject) => {
        const listener = (r: TResult) => {
            removeEventListener(event, listener);
            resolve(r);
        };

        addEventListener(event, listener);

        func().catch((error) => {
            removeEventListener(event, listener);
            reject(error);
        });
    });
}
