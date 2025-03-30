interface LudusaviBackupResponse {
    errors?: {
        cloudConflict: {};
        cloudSyncFailed: {};
        unknownGames: string[];
        pluginError: string;
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

interface LudusaviBackupListResponse {
    games: {
        [gameName: string]: {
            backupPath: string;
            backups: LudusaviBackupItem[];
        };
    }
    errors?: {}
}
interface LudusaviBackupItem {
    name: string;
    when: string;
    os: string;
    locked: false;
}