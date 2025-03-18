import { LudusaviBackupResponse } from "./apiClient";
import appState, { setAppState } from "./state";
import { resolveGameName } from "./steamUtil";
import { addEventListener, removeEventListener, toaster } from "@decky/api";
import { getGameConfig, startBackup } from "./backend";

export const onGameStart = async (appId: number) => {
    const gameName = await resolveGameName(appId);

    if (gameName) {
        appState.pushRecentGame(gameName);
    } else {
        console.error("Ludusavi: game not supported", gameName);
    }
}

export const onGameExit = async (appId: number) => {
    if (appState.currentState.ludusavi_enabled && appState.currentState.auto_backup_enabled) {
        const gameName = await resolveGameName(appId);
        const game = await getGameConfig(gameName);

        if (game.autoSync) {
            await backupGame(game.alias);
        }
    }
}


export async function backupGame(gameName: string) {
    try {
        const start = new Date();
        handleComplete(start, await backup(gameName));
    } catch (e) {
        toaster.toast({ title: "⛔ Ludusavi: Error", body: "An error occurred while backing up. Check logs." });
        console.error(e);
    }
}

async function backup(gameName: string) {
    if (appState.currentState.syncing) {
        return Promise.reject('Sync in Progress');
    }

    setAppState("syncing", true);

    return new Promise<LudusaviBackupResponse>((resolve, reject) => {
        const listener = (r: LudusaviBackupResponse) => {
            removeEventListener("backup_game_complete", listener);
            setAppState("syncing", false);
            resolve(r);
        };

        addEventListener("backup_game_complete", listener);

        startBackup(gameName).catch((error) => {
            removeEventListener("backup_game_complete", listener);
            setAppState("syncing", false);
            reject(error);
        });
    });
}

function handleComplete(start: Date, result: LudusaviBackupResponse) {
    if (result.errors) {
        if (result.errors.cloudConflict) {
            toaster.toast({ title: "⚠️ Ludusavi: Cloud Conflict", body: "Files out of sync with cloud." });
        }
        if (result.errors.cloudSyncFailed) {
            toaster.toast({ title: "⚠️ Ludusavi: Cloud Sync Issue", body: "Unable to synchronize with cloud." })
        }
        if (result.errors.unknownGames) {
            toaster.toast({ title: "⛔ Ludusavi: Unknown Game", body: result.errors.unknownGames[0] })
        }
        if (result.errors.pluginError) {
            toaster.toast({ title: "⛔ Ludusavi: Plugin Error", body: result.errors.pluginError })
        }

        console.error(result.errors)
        return;
    }

    Object.keys(result.games).forEach((gameName) => {
        const game = result.games[gameName];
        let message = "";
        let bytesChanged = 0;

        if (game.change === "Same") {
            message = "No changes detected";
        } else {
            const changes = {
                Same: 0,
                Different: 0,
                New: 0,
                Removed: 0,
            };

            Object.keys(game.files).forEach((fileName) => {
                const file = game.files[fileName];
                if (!file.ignored) {
                    changes[file.change]++;
                }

                if (!file.ignored && file.change !== "Same") bytesChanged += file.bytes;
            });

            message += `Synced ${changes.New + changes.Different} file(s) [${(bytesChanged / 1_000_000).toFixed(2)} MB]`;
        }

        toaster.toast({
            title: `Ludusavi Backup Complete - ${gameName}`,
            body: `${message}. ⌛ ${((new Date().getTime() - start.getTime()) / 1000).toFixed(2)} s.`,
        });
    });
}
