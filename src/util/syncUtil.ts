import { backupGames } from "./apiClient";
import appState from "./state";
import { resolveGameName } from "./steamUtil";

export const onGameStart = async (appId: number) => {
    const gameName = await resolveGameName(appId);

    if (gameName) {
        appState.pushRecentGame(gameName);
        
    } else {
        console.error("Ludusavi: game not suppported", gameName);
    }
}

export const onGameExit = async () => {
    if (
        appState.currentState.ludusavi_enabled &&
        appState.currentState.recent_games[0].autosync
    ) {
        backupGames(appState.currentState.recent_games[0].aliases);
    }
}