import { ButtonItem, ConfirmModal, showModal } from "decky-frontend-lib";
import { VFC, useState } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { FaSave } from "react-icons/fa";
import { GameInfo, useAppState } from "../../util/state";
import { backupGames } from "../../util/syncUtil";
import { SelectGameDropdown } from "../dropdowns/SelectGameDropdown";

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

export const SyncButton: VFC = () => {
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
