import { PanelSection, PanelSectionRow, ToggleField, ButtonItem } from "@decky/ui"
import appState, { PersistentState, setAppState, useAppState, } from "../../util/state";
import { setConfig, updateManifest } from "../../util/backend";
import { useCallback, useState } from "react";
import DeckyStoreButton from "../other/DeckyStoreButton";
import { MdSystemUpdateAlt } from "react-icons/md";
import { toaster } from "@decky/api";

export default function LudusaviManifestUpdatePanel() {
    const { manifest_force_update } = useAppState();
    const handleConfigChange = useCallback((key: keyof PersistentState, value: boolean): void => {
        setAppState(key, value);
        setConfig(key, value);
    }, []);
    const [updating, setUpdating] = useState(false);
    return (
        <PanelSection title="Manifest">
            <PanelSectionRow>
                <ToggleField
                    label="Force Update"
                    checked={manifest_force_update}
                    onChange={(e) => handleConfigChange("manifest_force_update", e)}
                />
                <ButtonItem
                    onClick={() => {
                        setUpdating(true);
                        updateManifest(manifest_force_update)
                            .then(() => {
                                toaster.toast({ title: "Decky Ludusavi", body: `Ludusavi Manifest updated successful. Restarting plugin...` });
                                appState.initialize();
                            })
                            .finally(() => setUpdating(false))
                    }}
                    layout="below"
                    disabled={updating}
                >
                    <DeckyStoreButton icon={<MdSystemUpdateAlt />}>Update Manifest</DeckyStoreButton>
                </ButtonItem>
            </PanelSectionRow>
        </PanelSection>
    );
}