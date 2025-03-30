import { ButtonItem } from "@decky/ui";
import { FC } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { useAppState } from "../../util/state";

export const SyncButton: FC<{ title: string; callback: () => void; icon: JSX.Element }> = ({ title, callback, icon }) => {
  const { ludusavi_enabled, syncing } = useAppState();

  return (
    <ButtonItem layout="below" disabled={!ludusavi_enabled || syncing} onClick={callback} bottomSeparator="none">
      <style>
        {`
    .dls-rotate {
      animation: dlsrotate 1s infinite cubic-bezier(0.46, 0.03, 0.52, 0.96);
    }
  
    @keyframes dlsrotate {
      from {
        transform: rotate(0deg);
      }
  
      to {
        transform: rotate(359deg);
      }
    }
  `}
      </style>
      <DeckyStoreButton icon={<div className={syncing ? "dls-rotate" : ""}>{icon}</div>}>{title}</DeckyStoreButton>
    </ButtonItem>
  );
};
