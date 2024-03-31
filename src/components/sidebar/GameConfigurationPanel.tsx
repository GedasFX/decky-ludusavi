import { PanelSection, PanelSectionRow, ToggleField } from "decky-frontend-lib";
import { updateGameState, useAppState } from "../../util/state";
import { ConfigureAliasesButton } from "../other/ConfigureAliasesButton";
import { VFC, useMemo } from "react";

export const GameConfigurationPanel: VFC = () => {
  const { recent_games, current_game_id } = useAppState();

  const currentGame = useMemo(() => recent_games.find((f) => f.id === current_game_id), [current_game_id, recent_games]);

  if (!currentGame)
    return (
      <PanelSection title="Game Configuration">
        <PanelSectionRow>
          <div>Open a game to configure it.</div>
        </PanelSectionRow>
      </PanelSection>
    );

  return (
    <PanelSection title="Game Configuration">
      <PanelSectionRow>
        <ToggleField label="Sync after closing this game" checked={currentGame.autosync} onChange={(e) => updateGameState({ ...currentGame, autosync: e })} />
      </PanelSectionRow>
      <PanelSectionRow>
        <ConfigureAliasesButton game={currentGame} />
      </PanelSectionRow>
    </PanelSection>
  );
};
