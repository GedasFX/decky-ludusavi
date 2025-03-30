import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import DeckyStoreButton from "../other/DeckyStoreButton";
import { LuLogs } from "react-icons/lu";
import PluginLogsPage from "../../pages/PluginLogsPage";

export default function OtherPanel() {
  return (
    <PanelSection title="Other">
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => PluginLogsPage.navigate()}>
          <DeckyStoreButton icon={<LuLogs />}>Plugin Logs</DeckyStoreButton>
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}
