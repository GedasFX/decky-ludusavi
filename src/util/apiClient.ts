import { getServerApi } from "./state";

export interface LudusaviBackupResponse {
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

export async function verifyGameSyncable(gameName: string) {
  const result = await getServerApi().callPluginMethod<{ game_name: string }, { exists: boolean }>("verify_game_exists", { game_name: gameName });
  if (result.success && result.result.exists) return true;

  return false;
}
