import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import appState, { useAppState } from "../../util/state";
import DeckyStoreButton from "../other/DeckyStoreButton";
import { MdOutlineInstallDesktop } from "react-icons/md";
import { installLudusavi } from "../../util/backend";
import { toaster } from "@decky/api";
import { useState } from "react";

const LudusaviUpdateButton = () => {
  const { ludusavi_enabled } = useAppState();
  const [updating, setUpdating] = useState(false);

  return (
    <ButtonItem
      onClick={() => {
        setUpdating(true);
        installLudusavi()
          .then(() => {
            toaster.toast({ title: "Decky Ludusavi", body: `Ludusavi ${ludusavi_enabled ? "Updated" : "Installed"}. Restarting plugin...` });
            appState.initialize();
          })
          .finally(() => setUpdating(false));
      }}
      layout="below"
      disabled={updating}
    >
      <DeckyStoreButton icon={<MdOutlineInstallDesktop className={updating ? "dls-rotate" : ""} />}>Install/Update Ludusavi</DeckyStoreButton>
    </ButtonItem>
  );
};

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
      <PanelSectionRow>
        <LudusaviUpdateButton />
      </PanelSectionRow>
    </PanelSection>
  );
}
