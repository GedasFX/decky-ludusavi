import { sleep } from "decky-frontend-lib";
import { LudusaviBackupResponse } from "./apiClient";
import appState, { getServerApi, setAppState } from "./state";
import { resolveGameName } from "./steamUtil";

export const onGameStart = async (appId: number) => {
    const gameName = await resolveGameName(appId);

    if (gameName) {
        appState.pushRecentGame(appId, gameName);
    } else {
        console.error("Ludusavi: game not suppported", gameName);
    }
}

export const onGameExit = async (appId: number) => {
    const game = appState.currentState.recent_games.find(g => g.id === appId);

    if (appState.currentState.ludusavi_enabled && game?.autosync) {
        backupGames(game.aliases);
    }
}



export async function backupGames(gameNames: string[]) {
    if (gameNames.length === 0)
        return;

    const start = new Date();

    setAppState("syncing", true);

    // Start sync
    await getServerApi().callPluginMethod<{ game_names: string[] }>("backup_games", { game_names: gameNames });

    while (true) {
        const status = await getServerApi().callPluginMethod<
            {},
            {
                completed: boolean;
                result?: LudusaviBackupResponse;
            }
        >("backup_games_check_finished", {});

        if (status.success && status.result.completed) {
            handleComplete(start, status.result.result!);
            break;
        }

        if (!status.success) {
            getServerApi().toaster.toast({ title: "Ludusavi", body: "An error occured while backing up. Check logs." });
            break;
        }

        await sleep(360);
    }

    setAppState("syncing", false);
}

function handleComplete(start: Date, result: LudusaviBackupResponse) {
    if (result.errors) {
        if (result.errors.cloudConflict) {
            getServerApi().toaster.toast({ title: "Ludusavi", body: "⚠️ Files out of sync with cloud." });
        }
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

            // if (changes.New > 0) message += `+ ${changes.New}, `;
            // if (changes.Different > 0) message += `~ ${changes.Different}, `
            // message = message.slice(0, -2);

            message += `Synced ${changes.New + changes.Different} file(s) [${(bytesChanged / 1_000_000).toFixed(2)} MB]`;
        }

        if (appState.currentState.auto_backup_toast_enabled === "true") {
            getServerApi().toaster.toast({
                title: `Ludusavi Backup Complete - ${gameName}`,
                body: `${message}. ⌛ ${((new Date().getTime() - start.getTime()) / 1000).toFixed(2)} s.`,
            });
        }
    });
}
