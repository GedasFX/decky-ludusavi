import { ButtonItem, ConfirmModal, PanelSection, TextField, showModal } from "@decky/ui";
import { FC, useState } from "react";
import { FaPen } from "react-icons/fa";
import { GameInfo } from "../../util/state";
import DeckyStoreButton from "../other/DeckyStoreButton";

const AliasConfigurator: FC<{ alias: string; onChange: (alias: string) => void }> = ({ alias, onChange }) => {
  const [str, setStr] = useState(alias);

  return (
    // This bit of code is a bit rushed, make this prettier in a later version.
    <PanelSection>
      <TextField value={str} onChange={(e) => setStr(e.target.value)} onBlur={() => onChange(str)} />
    </PanelSection>
  );
};

const ConfigureAliasesModal: FC<{ game: GameInfo; closeModal?: () => void; onOK: (alias: string) => void }> = ({ game, closeModal, onOK }) => {
  const [alias, setAliases] = useState(game.alias);

  return (
    <ConfirmModal strTitle="Configure Game Alias" onOK={() => onOK(alias)} closeModal={closeModal}>
      <PanelSection>
        <div>
          Sometimes the title of the game in Ludusavi will not match the one on Steam. For Example the game <b>TUNIC</b> on Steam will be called <b>Tunic</b> in
          Ludusavi. Change the name below match settings in Ludusavi.
        </div>
        <div>
          Configuring an alias for the game <b>{game.name}</b>.
        </div>
      </PanelSection>
      <AliasConfigurator alias={alias} onChange={setAliases} />
    </ConfirmModal>
  );
};

export const ConfigureAliasesButton: FC<{ game: GameInfo; onChange: (alias: string) => void }> = ({ game, onChange }) => {
  return (
    <ButtonItem layout="below" onClick={() => showModal(<ConfigureAliasesModal game={game} onOK={onChange} />)}>
      <DeckyStoreButton icon={<FaPen />}>Set Custom Game Alias</DeckyStoreButton>
    </ButtonItem>
  );
};
