import { PanelSection, PanelSectionRow } from "decky-frontend-lib";
import { useAppState } from "../../util/state";

export default function LudusaviVersionPanel() {
  const { ludusavi_enabled, ludusavi_version } = useAppState();
  return (
    <PanelSection title="Version">
      <PanelSectionRow>
        <div>{ludusavi_enabled ? ludusavi_version : "N/A"}</div>
        {!ludusavi_enabled && ludusavi_version !== "LOADING..." && (
          <div style={{ fontSize: "0.7em", marginLeft: "-1em", marginRight: "-3em" }}>
            <div>Ludusavi not found. Plugin functionality limited.</div>
            <div>Install Ludusavi from 'Discover' in Desktop mode. If issue persists, ask for help on GitHub or Discord.</div>
          </div>
        )}
      </PanelSectionRow>
    </PanelSection>
  );
}
