import { definePlugin } from "@decky/api";
import { FC } from "react";
import { LuDatabaseBackup } from "react-icons/lu";
import LudusaviVersionPanel from "./components/sidebar/LusudaviVersionPanel";
import appState, { useAppState } from "./util/state";
import ConfigurationPanel from "./components/sidebar/ConfigurationPanel";
import { GameConfigurationPanel } from "./components/sidebar/GameConfigurationPanel";
import { registerDependencies } from "./util/registrations";

const Content: FC = () => {
  const { ludusavi_enabled } = useAppState();

  if (!ludusavi_enabled) {
    <LudusaviVersionPanel />;
  }

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
  const unregisterDependencies = registerDependencies();

  return {
    name: "Decky Ludusavi",
    content: <Content />,
    icon: <LuDatabaseBackup />,
    onDismount: () => {
      unregisterDependencies();
    },
  };
});
