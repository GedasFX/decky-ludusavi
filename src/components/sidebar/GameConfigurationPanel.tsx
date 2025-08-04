import { DialogButton, Focusable, PanelSection, PanelSectionRow, showModal, ToggleField } from "@decky/ui";
import { setAppState, useAppState } from "../../util/state";
import { FC, useCallback, useEffect } from "react";
import { getGameConfig, setGameConfig } from "../../util/backend";
import { SelectGameDropdown } from "../dropdowns/SelectGameDropdown";
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
        <PanelSectionRow>
          <Focusable flow-children="horizontal" style={{ display: "flex", alignItems: "center", gap: "0.5em", margin: "-1em 0 1em 0" }}>
            <DialogButton onClick={() => backupGame(game_info.alias)} style={{ minWidth: 0, display: "flex", justifyContent: "space-around" }}>
              <FaUpload size={16} /> Backup
            </DialogButton>
            <DialogButton
              onClick={() => showModal(<RestoreGameModal game={game_info} />)}
              style={{ minWidth: 0, display: "flex", justifyContent: "space-around" }}
            >
              <FaDownload size={16} /> Restore
            </DialogButton>
          </Focusable>
        </PanelSectionRow>
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
