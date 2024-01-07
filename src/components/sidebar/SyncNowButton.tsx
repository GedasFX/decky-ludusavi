import { ButtonItem, ConfirmModal, Dropdown, showModal } from "decky-frontend-lib";
import { useAppState } from "../../util/state";
import { FC, VFC, useEffect, useMemo, useState } from "react";
import { backupGame } from "../../util/apiClient";
import DeckyStoreButton from "./DeckyStoreButton";
import { FaSave } from "react-icons/fa";

const SelectPreviousGameDropdown: FC<{ onSelected: (gameName: string) => void }> = ({ onSelected }) => {
  const { recent_games } = useAppState();
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    if (recent_games[0]) update(recent_games[0]);
  }, [recent_games]);

  const update = (game: string) => {
    setSelected(game);
    onSelected(game);
  };

  const data = useMemo(() => {
    if (recent_games.length === 0) {
      return [{ label: "N/A - Open a supported game for it to show up here", data: undefined }];
    }

    return recent_games.map((g) => ({ label: g, data: g }));
  }, [recent_games]);

  return <Dropdown rgOptions={data} selectedOption={selected} onChange={(e) => update(e.data)} />;
};

const SyncConfirmationModal: VFC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const [selectedGame, setSelectedGame] = useState<string>();

  return (
    <ConfirmModal
      strTitle="Select recently played game"
      onOK={() => {
        backupGame(selectedGame!);
      }}
      bOKDisabled={!selectedGame}
      closeModal={closeModal}
    >
      <SelectPreviousGameDropdown onSelected={setSelectedGame} />
    </ConfirmModal>
  );
};

export default function SyncNowButton() {
  const { ludusavi_enabled, syncing } = useAppState();

  return (
    <ButtonItem layout="below" disabled={ludusavi_enabled === "false" || syncing} onClick={() => showModal(<SyncConfirmationModal />)}>
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
}
