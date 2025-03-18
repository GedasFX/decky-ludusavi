import { PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { PersistentState, setAppState, useAppState } from "../../util/state";
import { setConfig } from "../../util/backend";
import { useCallback } from "react";

export default function ConfigurationPanel() {
  const appState = useAppState();

  const handleConfigChange = useCallback((key: keyof PersistentState, value: boolean): void => {
    setAppState(key, value);
    setConfig(key, value);
  }, []);

  return (
    <PanelSection title="Global Config">
      <PanelSectionRow>
        <ToggleField
          label="Auto-Sync Feature Enabled"
          checked={appState.auto_backup_enabled}
          onChange={e => handleConfigChange("auto_backup_enabled", e)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Auto-Sync New Games"
          checked={appState.auto_backup_new_games}
          onChange={e => handleConfigChange("auto_backup_new_games", e)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
