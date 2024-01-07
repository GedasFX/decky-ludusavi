import { sleep } from "decky-frontend-lib";
import appState, { getServerApi, setAppState } from "./state";

interface LudusaviBackupResponse {
  errors?: {
    cloudConflict: {};
  };
  overall: {
    processedBytes: number;
  };
  games: {
    [gameName: string]: {
      decision: "Processed";
      change: "New" | "Same" | "Different";
      files: {
        [filePath: string]: {
          ignored: boolean;
          change: "New" | "Same" | "Different" | "Removed";
          bytes: number;
        };
      };
    };
  };
}

export async function getLudusaviVersion() {
  const version = await getServerApi().callPluginMethod<{}, { bin_path?: string; version: string }>("get_ludusavi_version", {});

  console.log("Ludusavi version", version);

  if (version.success) return version.result.version;

  return "N/A";
}

export async function verifyGameSyncable(gameName: string) {
  const result = await getServerApi().callPluginMethod<{ game_name: string }, { exists: boolean }>("verify_game_exists", { game_name: gameName });
  if (result.success && result.result.exists) return true;

  return false;
}

export async function backupGame(gameName: string) {
  const start = new Date();

  setAppState("syncing", true);

  // Start sync
  await getServerApi().callPluginMethod<{ game_name: string }>("backup_game", { game_name: gameName });

  while (true) {
    const status = await getServerApi().callPluginMethod<
      {},
      {
        completed: boolean;
        result?: LudusaviBackupResponse;
      }
    >("backup_game_check_finished", {});

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

    if (appState.currentState.auto_backup_toast_enabled) {
      getServerApi().toaster.toast({
        title: `Ludusavi Backup Complete - ${gameName}`,
        body: `${message}. ⌛ ${((new Date().getTime() - start.getTime()) / 1000).toFixed(2)} s.`,
      });
    }
  });
}
