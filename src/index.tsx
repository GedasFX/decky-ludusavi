import { definePlugin, LifetimeNotification, ServerAPI, staticClasses } from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";

import LudusaviVersionPanel from "./components/sidebar/LusudaviVersionPanel";
import appState from "./util/state";
import SyncPanel from "./components/sidebar/SyncPanel";
import ConfigurationPanel from "./components/sidebar/ConfigurationPanel";
import { onGameExit, onGameStart } from "./util/syncUtil";

const Content: VFC = () => {
  return (
    <>
      <SyncPanel />
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
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content />,
    icon: <FaShip />,
    onDismount() {
      removeGameExitListener();
    },
  };
});
