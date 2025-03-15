import { useEffect, useState } from "react";
import { getConfig, getLudusaviVersion, setConfig, setGameConfig } from "./backend";
import { toaster } from "@decky/api";

export interface GameInfo {
  name: string;
  alias: string;

  autoSync: boolean;
}

export type PersistentState = {
  // Persistent
  auto_backup_enabled: boolean;
  auto_backup_toast_enabled: boolean;

  recent_games: string[];
}

export type State = {
  // Transient
  syncing: boolean;

  ludusavi_enabled: boolean;
  ludusavi_version: string;
} & PersistentState;

class AppState {
  private _subscribers: { id: number; callback: (e: State) => void }[] = [];

  private _currentState: State = {
    syncing: false,
    ludusavi_enabled: false,
    ludusavi_version: "LOADING...",
    auto_backup_enabled: false, // Persistent - string
    auto_backup_toast_enabled: true, // Persistent - string
    recent_games: [],
  };

  public get currentState() {
    return this._currentState;
  }

  public async initialize() {
    await Promise.all([this.initializeConfig(), this.initializeVersion(), this.initializeGames()])
  }

  private async initializeConfig() {
    this.setState("auto_backup_enabled", await getConfig("auto_backup_enabled"));
    this.setState("auto_backup_toast_enabled", await getConfig("auto_backup_toast_enabled"));
  }

  private async initializeVersion() {
    const version = await getLudusaviVersion();

    if (version.version) {
      this.setState("ludusavi_enabled", true);
      this.setState("ludusavi_version", version.version);
    } else {
      this.setState("ludusavi_version", "MISSING");
    }
  }

  private async initializeGames() {
    this.setState("recent_games", (await getConfig<string[]>("recent_games")) ?? []);
  }

  public setState = (key: keyof State, value: unknown) => {
    this._currentState = { ...this.currentState, [key]: value };
    this._subscribers.forEach((e) => e.callback(this.currentState));
  };

  public pushRecentGame = async (gameName: string) => {
    const recent = [...this.currentState.recent_games];

    // Move game up in the stack
    const lastUsedIdx = recent.findIndex(e => e === gameName);
    if (lastUsedIdx) recent.splice(lastUsedIdx, 1);

    if (lastUsedIdx < 0) {
      setGameConfig(gameName, { name: gameName, alias: gameName, autoSync: false });
      toaster.toast({ title: "Ludusavi", body: 'New game detected. Open Ludusavi to configure.' })
    }

    this.setState("recent_games", [gameName, ...recent]);
    setConfig('recent_games', this.currentState.recent_games)
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