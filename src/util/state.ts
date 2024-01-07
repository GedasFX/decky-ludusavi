import { ServerAPI } from "decky-frontend-lib";
import { useEffect, useState } from "react";

type State = {
  ludusavi_enabled: string;
  ludusavi_version: string;
  auto_backup_enabled: string;
  recent_games: string[];
};

class AppState {
  private _subscribers: { id: number; callback: (e: State) => void }[] = [];

  private _currentState: State = {
    ludusavi_enabled: "false",
    ludusavi_version: "LOADING...",
    auto_backup_enabled: "false",
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
    await Promise.all([this.initializeConfig(), this.initializeVersion()])
  }

  private async initializeConfig() {
    const data = await this._serverApi.callPluginMethod<{}, string[][]>("get_api", {});
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
        this.setState("ludusavi_enabled", "true");
        this.setState("ludusavi_version", version.result.version);
      } else {
        this.setState("ludusavi_version", "MISSING");
      }
    } else {
      this.setState("ludusavi_version", "ERROR");
    }
  }

  public setState = (key: keyof State, value: string, persist = false) => {
    this._currentState = { ...this.currentState, [key]: value };

    console.log(key, value, persist);

    if (persist) {
      this.serverApi.callPluginMethod<{ key: string; value: string }, null>("set_config", { key, value }).then(e => console.log(e));
    }

    this._subscribers.forEach((e) => e.callback(this.currentState));
  };

  public pushRecentGame = (gameName: string) => {
    const recent = [...this.currentState.recent_games];

    // Move game up in the stack
    const index = recent.indexOf(gameName);
    if (index > 0) recent.splice(index, 1);

    this._currentState = { ...this.currentState, recent_games: [gameName, ...recent] }
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
