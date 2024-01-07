import {
  ButtonItem,
  DialogBody,
  DialogControlsSection,
  DialogControlsSectionHeader,
  DialogHeader,
  Dropdown,
  ModalRoot,
  SimpleModal,
  showModal,
} from "decky-frontend-lib";
import { useAppState } from "../../util/state";
import { FC, VFC } from "react";

const SelectPreviousGameDropdown: FC<{ onChange: (gameName: string) => void }> = ({ onChange }) => {
  
};

const SyncConfirmationModal: VFC<{ closeModal: () => void }> = ({ closeModal }) => {
  return (
    <ModalRoot closeModal={closeModal}>
      <DialogHeader>Select game to backup</DialogHeader>
      <DialogBody>
        <Dropdown rgOptions={[{ label: "", data: 1 }]} />
        <DialogControlsSection>
          <DialogControlsSectionHeader>Syncthing Process Log</DialogControlsSectionHeader>
          <ButtonItem>Show Current Log</ButtonItem>
        </DialogControlsSection>
      </DialogBody>
    </ModalRoot>
  );
};

export default function SyncNowButton() {
  const { ludusavi_enabled } = useAppState();

  return (
    <ButtonItem layout="below" disabled={ludusavi_enabled === "false"} onClick={(e: Event) => showModal(<SyncConfirmationModal />)}>
      Sync Now
    </ButtonItem>
  );
}
