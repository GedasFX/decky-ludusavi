import { PanelSection, PanelSectionRow, ToggleField } from "decky-frontend-lib";
import { setAppState, useAppState } from "../../util/state";

export default function ConfigurationPanel() {
  const appState = useAppState();

  return (
    <PanelSection title="Configuration">
      <PanelSectionRow>
        <ToggleField
          label="Auto-Sync Enabled"
          checked={appState.auto_backup_enabled === "true"}
          onChange={(e) => setAppState("auto_backup_enabled", e ? "true" : "false", true)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Notifications Enabled"
          checked={appState.auto_backup_toast_enabled === "true"}
          onChange={(e) => setAppState("auto_backup_toast_enabled", e ? "true" : "false", true)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
