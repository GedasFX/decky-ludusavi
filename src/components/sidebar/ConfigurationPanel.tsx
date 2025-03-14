import { PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { setAppState, State, useAppState } from "../../util/state";
import { setConfig } from "../../util/backend";
import { useCallback } from "react";

export default function ConfigurationPanel() {
  const appState = useAppState();

  const handleConfigChange = useCallback((key: keyof State, value: boolean): void => {
    setAppState(key, value);
    setConfig(key, value);
  }, []);

  return (
    <PanelSection title="Global Config">
      <PanelSectionRow>
        <ToggleField
          label="Auto-Sync Enabled"
          checked={appState.auto_backup_enabled}
          onChange={e => handleConfigChange("auto_backup_enabled", e)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Notifications Enabled"
          checked={appState.auto_backup_toast_enabled}
          onChange={e => handleConfigChange("auto_backup_toast_enabled", e)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
