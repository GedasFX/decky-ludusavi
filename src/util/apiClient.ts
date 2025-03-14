export interface LudusaviBackupResponse {
  errors?: {
    cloudConflict: {};
    unknownGames: string[];
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
