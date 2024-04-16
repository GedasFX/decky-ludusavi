import { PanelSection, PanelSectionRow } from "decky-frontend-lib";
import { SyncButton } from "../other/SyncButton";

export default function SyncPanel() {
  return (
    <PanelSection title="Sync">
      <PanelSectionRow>
        <SyncButton />
      </PanelSectionRow>
    </PanelSection>
  );
}
