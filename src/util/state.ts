import { ServerAPI } from "decky-frontend-lib";
import { useEffect, useState } from "react";

export interface GameInfo {
  id: number;

  name: string;
  aliases: string[];

  autosync: boolean;
}

type State = {
  // Transient
  syncing: boolean;
  recent_games: GameInfo[];
  current_game_id?: number;

  ludusavi_enabled: boolean;
  ludusavi_version: string;

  // Persistent
  auto_backup_enabled: string;
  auto_backup_toast_enabled: string;
};

class AppState {
  private _subscribers: { id: number; callback: (e: State) => void }[] = [];

  private _currentState: State = {
    syncing: false,
    ludusavi_enabled: false,
    ludusavi_version: "LOADING...",
    auto_backup_enabled: "false", // Persistent - string
    auto_backup_toast_enabled: "true", // Persistent - string
    recent_games: [],
  };

  private _serverApi: ServerAPI = null!;

  public get currentState() {
    return this._currentState;
  }

  public get serverApi() {
    return this._serverApi;
  }

  public async initialize(serverApi: ServerAPI) {
    this._serverApi = serverApi;
    await Promise.all([this.initializeConfig(), this.initializeVersion(), this.initializeGames()])
  }

  private async initializeConfig() {
    const data = await this._serverApi.callPluginMethod<{}, string[][]>("get_config", {});
    if (data.success) {
      data.result.forEach((e) => this.setState(e[0] as keyof State, e[1]));
    } else {
      console.error(data);
    }
  }

  private async initializeVersion() {
    const version = await getServerApi().callPluginMethod<{}, { bin_path?: string, version: string }>("get_ludusavi_version", {});
    if (version.success) {
      if (version.result.version) {
        this.setState("ludusavi_enabled", true);
        this.setState("ludusavi_version", version.result.version);
      } else {
        this.setState("ludusavi_version", "MISSING");
      }
    } else {
      this.setState("ludusavi_version", "ERROR");
    }
  }

  private async initializeGames() {
    this.setState("recent_games", await getGameConfig());
  }

  public setState = (key: keyof State, value: unknown, persist = false) => {
    this._currentState = { ...this.currentState, [key]: value };

    console.log(key, value, persist);

    if (persist) {
      if (typeof value === 'string')
        this.serverApi.callPluginMethod<{ key: string; value: string }, null>("set_config", { key, value }).then(e => console.log(e));
      else
        console.error("Tried to persist non-string value:", value);
    }

    this._subscribers.forEach((e) => e.callback(this.currentState));
  };

  public pushRecentGame = async (appId: number, gameName: string) => {
    const recent = [...this.currentState.recent_games];

    // Move game up in the stack
    let loadedGame = recent.find(e => e.name === gameName);
    if (loadedGame) recent.splice(recent.findIndex(e => e.name === gameName), 1);

    if (!loadedGame) {
      loadedGame = { id: appId, name: gameName, aliases: [gameName], autosync: false }
      getServerApi().toaster.toast({ title: "Ludusavi", body: 'New game detected. Open Ludusavi to configure.' })
    }

    const recentGames = [loadedGame, ...recent];
    await updateGameConfig(recentGames);

    this._currentState = { ...this.currentState, recent_games: recentGames }
    this._subscribers.forEach((e) => e.callback(this.currentState));
  }

  public subscribe = (callback: (e: State) => void) => {
    const id = new Date().getTime();
    this._subscribers.push({ id, callback });

    return id;
  };

  public unsubscribe = (id: number) => {
    const index = this._subscribers.findIndex((f) => f.id === id);
    if (index > -1) {
      this._subscribers.splice(index, 1);
    }
  };
}

const appState = new AppState();
export default appState;

export const useAppState = () => {
  const [state, setState] = useState<State>(appState.currentState);

  useEffect(() => {
    const id = appState.subscribe((e) => {
      setState(e);
    });
    return () => {
      appState.unsubscribe(id);
    };
  }, []);

  return state;
};

export const setAppState = appState.setState;
export const getServerApi = () => appState.serverApi;

export const updateGameState = async (game: GameInfo) => {
  const allGames = [...appState.currentState.recent_games];
  allGames.splice(allGames.map(a => a.id).indexOf(game.id), 1, { ...game });
      
  setAppState("recent_games", allGames);
  await updateGameConfig(allGames);    
}


export async function updateGameConfig(games: GameInfo[]) {
  return await getServerApi().callPluginMethod<{ cfg: string }, void>("set_game_config", { cfg: JSON.stringify(games) }).then(e => {
    if (!e.success)
      console.error(e.result);
  });
}

export async function getGameConfig() {
  return await getServerApi().callPluginMethod<{}, string>("get_game_config", {}).then(e => {
    if (!e.success)
      console.error(e.result);

    if (!e.success || !e.result)
      return [];

    return JSON.parse(e.result) as GameInfo[];
  });
}