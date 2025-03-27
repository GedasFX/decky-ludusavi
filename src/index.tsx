import { definePlugin } from "@decky/api";
import { LifetimeNotification, staticClasses } from "@decky/ui";
import { FC } from "react";
import { LuDatabaseBackup } from "react-icons/lu";
import LudusaviVersionPanel from "./components/sidebar/LusudaviVersionPanel";
import appState from "./util/state";
import ConfigurationPanel from "./components/sidebar/ConfigurationPanel";
import { onGameExit, onGameStart } from "./util/syncUtil";
import { GameConfigurationPanel } from "./components/sidebar/GameConfigurationPanel";

const Content: FC = () => {
  return (
    <>
      <GameConfigurationPanel />
      <ConfigurationPanel />
      <LudusaviVersionPanel />
    </>
  );
};

export default definePlugin(() => {
  appState.initialize();

  const { unregister: removeGameExitListener } = SteamClient.GameSessions.RegisterForAppLifetimeNotifications(async (e: LifetimeNotification) => {
    if (e.bRunning) {
      onGameStart(e.unAppID);
    } else {
      onGameExit(e.unAppID);
    }
  });

  return {
    name: 'Decky Ludusavi',
    titleView: <div className={staticClasses.Title}>Decky Ludusavi</div>,
    content: <Content />,
    icon: <LuDatabaseBackup />,
    onDismount() {
      removeGameExitListener();
    },
  };
});
