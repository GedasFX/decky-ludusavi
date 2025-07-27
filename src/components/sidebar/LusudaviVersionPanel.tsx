import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import appState, { useAppState } from "../../util/state";
import PluginLogsPage from "../../pages/PluginLogsPage";
import DeckyStoreButton from "../other/DeckyStoreButton";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdOutlineInstallDesktop } from "react-icons/md";
import { installLudusavi, updateManifest } from "../../util/backend";
import { toaster } from "@decky/api";
import { useState } from "react";
import { LuLogs } from "react-icons/lu";

const LudusaviUpdateButton = () => {
  const { ludusavi_enabled } = useAppState();
  const [updating, setUpdating] = useState(false);

  return (
    <ButtonItem
      onClick={() => {
        setUpdating(true);
        installLudusavi()
          .then(() => {
            toaster.toast({
              title: "Decky Ludusavi",
              body: `Ludusavi ${ludusavi_enabled ? "Updated" : "Installed"}. Restarting plugin...`,
            });
            appState.initialize();
          })
          .finally(() => setUpdating(false));
      }}
      layout="below"
      disabled={updating}
    >
      <DeckyStoreButton icon={<MdOutlineInstallDesktop className={updating ? "dls-rotate" : ""} />}>
        {ludusavi_enabled ? "Update" : "Install"} Ludusavi
      </DeckyStoreButton>
    </ButtonItem>
  );
};

const ManifestUpdateButton = () => {
  const [updating, setUpdating] = useState(false);
  return (
    <ButtonItem
      onClick={() => {
        setUpdating(true);
        updateManifest()
          .then(() => {
            toaster.toast({
              title: "Decky Ludusavi",
              body: `Ludusavi Manifest updated successfully. Restarting plugin...`,
            });
            return appState.initialize();
          })
          .finally(() => setUpdating(false));
      }}
      layout="below"
      disabled={updating}
    >
      <DeckyStoreButton icon={<GrDocumentUpdate className={updating ? "dls-rotate" : ""} />}>
        Update Manifest
      </DeckyStoreButton>
    </ButtonItem>
  );
};

const PluginLogsButton = () => {
  return (
    <ButtonItem layout="below" onClick={() => PluginLogsPage.navigate()}>
      <DeckyStoreButton icon={<LuLogs />}>Plugin Logs</DeckyStoreButton>
    </ButtonItem>
  );
};

function LudusaviVersionPanelContent() {
  const { ludusavi_enabled, ludusavi_version } = useAppState();

  if (ludusavi_version === "LOADING...") {
    return (
      <PanelSectionRow>
        <div>Loading...</div>
      </PanelSectionRow>
    );
  }

  if (!ludusavi_enabled) {
    return (
      <PanelSectionRow>
        <div
          style={{
            fontSize: "0.7em",
            marginLeft: "-1em",
            marginRight: "-3em",
          }}
        >
          <div>Ludusavi not found. Plugin functionality limited.</div>
          <div>
            Install Ludusavi from 'Discover' in Desktop mode. If issue persists, ask for help on GitHub or Discord.
          </div>
        </div>
      </PanelSectionRow>
    );
  }

  return (
    <>
      <PanelSectionRow>
        <PluginLogsButton />
      </PanelSectionRow>
      <PanelSectionRow>
        <ManifestUpdateButton />
      </PanelSectionRow>
      <PanelSectionRow>
        <LudusaviUpdateButton />
      </PanelSectionRow>
      <PanelSectionRow>
        <div>{ludusavi_version}</div>
      </PanelSectionRow>
    </>
  );
}

export default function LudusaviVersionPanel() {
  return (
    <PanelSection title="Ludusavi">
      <LudusaviVersionPanelContent />
    </PanelSection>
  );
}
