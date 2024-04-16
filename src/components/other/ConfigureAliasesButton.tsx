import { ButtonItem, ConfirmModal, PanelSection, TextField, showModal } from "decky-frontend-lib";
import { VFC, useState } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { FaPen } from "react-icons/fa";
import { GameInfo, updateGameState } from "../../util/state";

const AliasConfigurator: VFC<{ aliases: string[]; setAliases: (aliases: string[]) => void }> = ({ aliases, setAliases }) => {
  const [str, setstr] = useState(aliases.join(","));

  return (
    // This bit of code is a bit rushed, make this prettier in a later version.
    <PanelSection title="Name of the game in Ludusavi:">
      <TextField value={str} onChange={(e) => setstr(e.target.value)} onBlur={() => setAliases([str])} />
    </PanelSection>
  );
};

const ConfigureAliasesModal: VFC<{ game: GameInfo; closeModal?: () => void }> = ({ game, closeModal }) => {
  const [aliases, setAliases] = useState(game.aliases);

  return (
    <ConfirmModal
      strTitle="Configure Game Name"
      onOK={() => {
        updateGameState({ ...game!, aliases: aliases });
      }}
      closeModal={closeModal}
    >
      <AliasConfigurator aliases={aliases} setAliases={setAliases} />
    </ConfirmModal>
  );
};

export const ConfigureAliasesButton: VFC<{ game: GameInfo }> = ({ game }) => {
  return (
    <ButtonItem layout="below" onClick={() => showModal(<ConfigureAliasesModal game={game} />)}>
      <DeckyStoreButton icon={<FaPen />}>Set Custom Game Name</DeckyStoreButton>
    </ButtonItem>
  );
};
