import { PanelSection, PanelSectionRow, ToggleField } from "decky-frontend-lib";
import { setAppState, useAppState } from "../../util/state";
import { ConfigureAliasesButton } from "../other/ConfigureAliasesButton";

export default function ConfigurationPanel() {
  const appState = useAppState();

  return (
    <PanelSection title="Configuration">
      <PanelSectionRow>
        <ToggleField
          label="Sync after closing a game"
          checked={appState.auto_backup_enabled === "true"}
          onChange={(e) => setAppState("auto_backup_enabled", e ? "true" : "false", true)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Notify after successful sync"
          checked={appState.auto_backup_toast_enabled === "true"}
          onChange={(e) => setAppState("auto_backup_toast_enabled", e ? "true" : "false", true)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ConfigureAliasesButton />
      </PanelSectionRow>
    </PanelSection>
  );
}
