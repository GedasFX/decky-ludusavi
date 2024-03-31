import { ButtonItem, ConfirmModal, Dropdown, PanelSection, PanelSectionRow, showModal } from "decky-frontend-lib";
import { GameInfo, useAppState } from "../../util/state";
import { FC, VFC, useEffect, useMemo, useState } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { FaSave } from "react-icons/fa";
import { backupGames } from "../../util/syncUtil";

export const SelectGameDropdown: FC<{ onSelected: (game: GameInfo) => void }> = ({ onSelected }) => {
  const { recent_games } = useAppState();
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    if (recent_games[0]) update(0);
  }, [recent_games]);

  const update = (index: number) => {
    setSelected(index);
    onSelected(recent_games[index]);
  };

  const data = useMemo(() => {
    if (recent_games.length === 0) {
      return [{ label: "N/A - Open a game to add it here", data: -1 }];
    }

    return recent_games.slice(0, 30).map((g, i) => ({ label: g, data: i }));
  }, [recent_games]);

  return <Dropdown rgOptions={data} selectedOption={selected} onChange={(e) => update(e.data)} disabled={recent_games.length === 0} />;
};

const SyncConfirmationModal: VFC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const [selectedGame, setSelectedGame] = useState<GameInfo>();

  return (
    <ConfirmModal
      strTitle="Select recently played game"
      onOK={() => {
        backupGames(selectedGame?.aliases ?? []);
      }}
      bOKDisabled={!selectedGame}
      closeModal={closeModal}
    >
      <SelectGameDropdown onSelected={setSelectedGame} />
    </ConfirmModal>
  );
};

const SyncButton: VFC = () => {
  const { ludusavi_enabled, syncing } = useAppState();

  return (
    <ButtonItem layout="below" disabled={!ludusavi_enabled || syncing} onClick={() => showModal(<SyncConfirmationModal />)}>
      <style>
        {`
  .dcs-rotate {
    animation: dcsrotate 1s infinite cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  @keyframes dcsrotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(359deg);
    }
  }
`}
      </style>
      <DeckyStoreButton icon={<FaSave className={syncing ? "dcs-rotate" : ""} />}>Sync Now</DeckyStoreButton>
    </ButtonItem>
  );
};

export default function SyncPanel() {
  return (
    <PanelSection title="Sync">
      <PanelSectionRow>
        <SyncButton />
      </PanelSectionRow>
    </PanelSection>
  );
}
