import { ButtonItem } from "@decky/ui";
import { FC } from "react";
import DeckyStoreButton from "./DeckyStoreButton";
import { useAppState } from "../../util/state";

export const SpinnerButton: FC<{
  title: string;
  callback: () => void;
  icon: JSX.Element;
  disabled?: boolean;
  spinning?: boolean;
}> = ({ title, callback, icon, disabled = false, spinning = false }) => {
  return (
    <ButtonItem layout="below" disabled={disabled || spinning} onClick={callback} bottomSeparator="none">
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
      <DeckyStoreButton icon={<div className={spinning ? "dls-rotate" : ""}>{icon}</div>}>{title}</DeckyStoreButton>
    </ButtonItem>
  );
};

export const SyncButton: FC<{ title: string; callback: () => void; icon: JSX.Element }> = ({
  title,
  callback,
  icon,
}) => {
  const { ludusavi_enabled, syncing } = useAppState();

  return (
    <SpinnerButton title={title} disabled={!ludusavi_enabled} spinning={syncing} icon={icon} callback={callback} />
  );
};
