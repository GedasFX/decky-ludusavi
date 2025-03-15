import { ButtonItem } from "@decky/ui";
import { FC } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { FaSave } from "react-icons/fa";
import { useAppState } from "../../util/state";
import { backupGame } from "../../util/syncUtil";

export const SyncButton: FC<{ alias: string }> = ({ alias }) => {
  const { ludusavi_enabled, syncing } = useAppState();

  return (
    <ButtonItem layout="below" disabled={!ludusavi_enabled || syncing} onClick={() => backupGame(alias)}>
      <style>
        {`
    .dls-rotate {
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
      <DeckyStoreButton icon={<FaSave className={syncing ? "dls-rotate" : ""} />}>Sync Now</DeckyStoreButton>
    </ButtonItem>
  );
};
