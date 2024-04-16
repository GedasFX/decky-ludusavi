import { definePlugin, LifetimeNotification, ServerAPI, staticClasses } from "decky-frontend-lib";
import { VFC } from "react";
import { LuDatabaseBackup } from "react-icons/lu";

import LudusaviVersionPanel from "./components/sidebar/LusudaviVersionPanel";
import appState from "./util/state";
import SyncPanel from "./components/sidebar/SyncPanel";
import ConfigurationPanel from "./components/sidebar/ConfigurationPanel";
import { onGameExit, onGameStart } from "./util/syncUtil";
import { GameConfigurationPanel } from "./components/sidebar/GameConfigurationPanel";

const Content: VFC = () => {
  return (
    <>
      <SyncPanel />
      <GameConfigurationPanel />
      <ConfigurationPanel />
      <LudusaviVersionPanel />
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  appState.initialize(serverApi);

  const { unregister: removeGameExitListener } = SteamClient.GameSessions.RegisterForAppLifetimeNotifications(async (e: LifetimeNotification) => {
    if (e.bRunning) {
      onGameStart(e.unAppID);
    } else {
      onGameExit(e.unAppID);
    }
  });

  return {
    title: <div className={staticClasses.Title}>Ludusavi</div>,
    content: <Content />,
    icon: <LuDatabaseBackup />,
    onDismount() {
      removeGameExitListener();
    },
  };
});
