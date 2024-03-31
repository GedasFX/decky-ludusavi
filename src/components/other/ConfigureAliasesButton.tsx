import { ButtonItem, ConfirmModal, PanelSection, TextField, showModal } from "decky-frontend-lib";
import { VFC, useState } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { FaPen } from "react-icons/fa";
import { GameInfo, updateGameConfig, useAppState } from "../../util/state";
import { SelectGameDropdown } from "../dropdowns/SelectGameDropdown";

const AliasConfigurator: VFC<{ aliases: string[]; setAliases: (aliases: string[]) => void }> = ({ aliases, setAliases }) => {
  return (
    // This bit of code is a bit rushed, make this prettier in a later version.
    <PanelSection title="Current Aliases for this game (seperated by ,):">
      <TextField value={aliases.join(",")} onBlur={(e) => setAliases(e.target.value.split(",").map((e) => e.trim()))} />
    </PanelSection>
  );
};

const ConfigureAliasesModal: VFC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const { recent_games } = useAppState();
  const [selectedGame, setSelectedGame] = useState<GameInfo>();

  const [aliases, setAliases] = useState(selectedGame?.aliases);

  return (
    <ConfirmModal
      strTitle="Configure Game Aliases"
      onOK={() => {
        const gamesCopy = [...recent_games];
        gamesCopy.splice(gamesCopy.indexOf(selectedGame!), 1, { ...selectedGame!, aliases: aliases! });
        updateGameConfig(gamesCopy);
      }}
      bOKDisabled={!selectedGame}
      closeModal={closeModal}
    >
      <SelectGameDropdown onSelected={setSelectedGame} />
      {aliases && <AliasConfigurator aliases={aliases} setAliases={setAliases} />}
    </ConfirmModal>
  );
};

export const ConfigureAliasesButton: VFC = () => {
  return (
    <ButtonItem layout="below" onClick={() => showModal(<ConfigureAliasesModal />)}>
      <DeckyStoreButton icon={<FaPen />}>Configure Aliases</DeckyStoreButton>
    </ButtonItem>
  );
};
