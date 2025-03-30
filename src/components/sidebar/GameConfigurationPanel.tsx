import { PanelSection, PanelSectionRow, showModal, ToggleField } from "@decky/ui";
import { setAppState, useAppState } from "../../util/state";
import { FC, useCallback, useEffect } from "react";
import { getGameConfig, setGameConfig } from "../../util/backend";
import { SelectGameDropdown } from "../dropdowns/SelectGameDropdown";
import { SyncButton } from "../other/SyncButton";
import { ConfigureAliasesButton } from "./AliasConfigurator";
import { backupGame } from "../../util/syncUtil";
import { RestoreGameModal } from "../modals/RestoreGameModal";
import { FaDownload, FaUpload } from "react-icons/fa";

export const GameConfigurationPanel: FC = () => {
  const { game_info, recent_games_selected } = useAppState();
  const setGameInfo = useCallback((e: unknown) => setAppState("game_info", e), []);

  useEffect(() => {
    setGameInfo(undefined);
    if (recent_games_selected) {
      getGameConfig(recent_games_selected).then((e) => setGameInfo(e));
    }
  }, [recent_games_selected]);

  return (
    <>
      <PanelSection>
        <PanelSectionRow>
          <SelectGameDropdown />
        </PanelSectionRow>
      </PanelSection>
      {game_info && (
        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "1em", paddingRight: "1em", marginTop: "-1em", marginBottom: "1em" }}>
          <PanelSectionRow>
            <SyncButton title="Backup" callback={() => backupGame(game_info.alias)} icon={<FaUpload />} />
          </PanelSectionRow>
          <PanelSectionRow>
            <SyncButton title="Restore" callback={() => showModal(<RestoreGameModal game={game_info} />)} icon={<FaDownload />} />
          </PanelSectionRow>
        </div>
      )}
      {game_info && (
        <>
          <PanelSection title="Game Config">
            <PanelSectionRow>
              <ToggleField
                label="Sync after closing game"
                checked={game_info.autoSync}
                onChange={(e) => {
                  const config = { ...game_info, autoSync: e };
                  setGameConfig(config.name, config).then(() => setGameInfo(config));
                }}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ConfigureAliasesButton
                game={game_info}
                onChange={(e) => {
                  const config = { ...game_info, alias: e };
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
