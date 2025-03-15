import { PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { setAppState, useAppState } from "../../util/state";
import { FC, useCallback } from "react";
import { getGameConfig, setGameConfig } from "../../util/backend";
import { SelectGameDropdown } from "../dropdowns/SelectGameDropdown";
import { SyncButton } from "../other/SyncButton";
import { ConfigureAliasesButton } from "./AliasConfigurator";

export const GameConfigurationPanel: FC = () => {
  const { game_info: gameInfo } = useAppState();
  const setGameInfo = useCallback((e: unknown) => setAppState("game_info", e), []);

  return (
    <>
      <PanelSection>
        <PanelSectionRow>
          <SelectGameDropdown
            onSelected={(gameName) => {
              setGameInfo(undefined);
              getGameConfig(gameName).then((e) => {
                setGameInfo(e);
              });
            }}
          />
        </PanelSectionRow>
      </PanelSection>
      {gameInfo && (
        <PanelSection>
          <PanelSectionRow>
            <SyncButton alias={gameInfo.alias} />
          </PanelSectionRow>
        </PanelSection>
      )}
      {gameInfo && (
        <>
          <PanelSection title="Game Config">
            <PanelSectionRow>
              <ToggleField
                label="Sync after closing game"
                checked={gameInfo.autoSync}
                onChange={(e) => {
                  const config = { ...gameInfo, autoSync: e };
                  setGameConfig(config.name, config).then(() => setGameInfo(config));
                }}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ConfigureAliasesButton
                game={gameInfo}
                onChange={(e) => {
                  const config = { ...gameInfo, alias: e };
                  setGameConfig(config.name, config).then(() => setGameInfo(config));
                }}
              />
            </PanelSectionRow>
          </PanelSection>
        </>
      )}
    </>
  );
};
