import { ButtonItem, ConfirmModal, PanelSection, TextField, showModal } from "@decky/ui";
import { toaster } from "@decky/api";
import { FC, useState } from "react";
import { FaPen } from "react-icons/fa";
import { GameInfo } from "../../util/state";
import { getNormalizedGameName } from "../../util/backend";
import DeckyStoreButton from "../other/DeckyStoreButton";
import { MdCheck, MdSearch } from "react-icons/md";

const AliasConfigurator: FC<{ alias: string; onChange: (alias: string) => void }> = ({ alias, onChange }) => {
  const [str, setStr] = useState(alias);
  const [searching, setSearching] = useState(false);
  const [gameFound, setGameFound] = useState(false);

  const search = async () => {
    setSearching(true);
    try {
      const result = await getNormalizedGameName(str);

      if (result && !result.startsWith("No info for these games:")) {
        setStr(result.trim());
        setGameFound(true);
        return;
      }

      toaster.toast({ title: "Ludusavi", body: "Unable to find game in manifest." });
    } catch (error) {
      toaster.toast({ title: "Ludusavi", body: "An error occured while searching." });
    } finally {
      setSearching(false);
    }
  };

  // This bit of code is a bit rushed, make this prettier in a later version.
  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "1em", width: "100%" }}>
        <TextField
          value={str}
          onChange={(e) => {
            setStr(e.target.value);
            setGameFound(false);
          }}
          onBlur={() => onChange(str)}
        />
      </div>
      <div style={{ maxWidth: "10em", marginTop: "-10px" }}>
        <ButtonItem onClick={search} disabled={searching || gameFound} layout="below" bottomSeparator="none">
          <DeckyStoreButton icon={gameFound ? <MdCheck /> : <MdSearch />}>Search</DeckyStoreButton>
        </ButtonItem>
      </div>
    </div>
  );
};

const ConfigureAliasesModal: FC<{
  game: GameInfo;
  closeModal?: () => void;
  onOK: (alias: string) => void;
}> = ({ game, closeModal, onOK }) => {
  const [alias, setAliases] = useState(game.alias);

  return (
    <ConfirmModal strTitle="Configure Game Alias" onOK={() => onOK(alias)} closeModal={closeModal}>
      <PanelSection>
        <div style={{ margin: "0 -1em 1em -1em" }}>
          Sometimes the title of the game in Ludusavi will not match the one on Steam. For Example the game <b>TUNIC</b>{" "}
          on Steam will be called <b>Tunic</b> in Ludusavi. Change the name below match settings in Ludusavi.
        </div>
        <div style={{ margin: "0 -1em 1em -1em" }}>
          You can click the Search button to find the game in Ludusavi manifest and try set the alias automatically.
        </div>
        <div style={{ margin: "0 -1em 1em -1em" }}>
          Configuring an alias for the game <b>{game.name}</b>.
        </div>
      </PanelSection>
      <AliasConfigurator alias={alias} onChange={setAliases} />
    </ConfirmModal>
  );
};

export const ConfigureAliasesButton: FC<{ game: GameInfo; onChange: (alias: string) => void }> = ({
  game,
  onChange,
}) => {
  return (
    <ButtonItem layout="below" onClick={() => showModal(<ConfigureAliasesModal game={game} onOK={onChange} />)}>
      <DeckyStoreButton icon={<FaPen />}>Set Custom Game Alias</DeckyStoreButton>
    </ButtonItem>
  );
};
