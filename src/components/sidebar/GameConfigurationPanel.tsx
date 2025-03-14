import { PanelSection, PanelSectionRow, TextField, ToggleField } from "@decky/ui";
import { GameInfo } from "../../util/state";
import { FC, useState } from "react";
import { getGameConfig, setGameConfig } from "../../util/backend";
import { SelectGameDropdown } from "../dropdowns/SelectGameDropdown";
import { SyncButton } from "../other/SyncButton";

const AliasConfigurator: FC<{ alias: string; onChange: (alias: string) => void }> = ({ alias, onChange }) => {
  const [str, setStr] = useState(alias);

  return (
    // This bit of code is a bit rushed, make this prettier in a later version.
    <PanelSection title="Name of the game in Ludusavi:">
      <TextField value={str} onChange={(e) => setStr(e.target.value)} onBlur={() => onChange(str)} />
    </PanelSection>
  );
};

export const GameConfigurationPanel: FC = () => {
  const [gameInfo, setGameInfo] = useState<GameInfo>();

  return (
    <>
      <PanelSection>
        <PanelSectionRow>
          <SelectGameDropdown
            onSelected={(gameName) => {
              setGameInfo(undefined);
              getGameConfig(gameName).then((e) => setGameInfo(e));
            }}
          />
        </PanelSectionRow>
      </PanelSection>
      {gameInfo && (
        <>
          <PanelSection title="Sync">
            <PanelSectionRow>
              <SyncButton alias={gameInfo.alias} />
            </PanelSectionRow>
          </PanelSection>

          <PanelSection title="Game Config">
            <PanelSectionRow>
              <ToggleField
                label="Sync after closing this game"
                checked={gameInfo.autoSync}
                onChange={(e) => {
                  const config = { ...gameInfo, autoSync: e };
                  setGameConfig(config.name, config).then(() => setGameInfo(config));
                }}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <AliasConfigurator
                alias={gameInfo.alias}
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
