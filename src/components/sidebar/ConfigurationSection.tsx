import { PanelSectionRow, ToggleField } from "decky-frontend-lib";
import { setAppState, useAppState } from "../../util/state";

export default function ConfigurationSection() {
  const appState = useAppState();

  return (
    <>
      <PanelSectionRow>
        <ToggleField
          label="Sync after closing a game"
          checked={appState.auto_backup_enabled === "true"}
          onChange={(e) => setAppState("auto_backup_enabled", e ? "true" : "false", true)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          disabled={appState.auto_backup_enabled !== "true"}
          label="Toast after auto sync"
          checked={appState.auto_backup_toast_enabled === "true"}
          onChange={(e) => setAppState("auto_backup_toast_enabled", e ? "true" : "false", true)}
        />
      </PanelSectionRow>
    </>
  );
}
