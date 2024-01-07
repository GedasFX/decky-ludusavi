import {
  ButtonItem,
  definePlugin,
  DialogBody,
  DialogButton,
  DialogHeader,
  LifetimeNotification,
  Menu,
  MenuItem,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  showModal,
  SimpleModal,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";

import logo from "../assets/logo.png";
import LudusaviVersion from "./components/sidebar/LusudaviVersion";
import appState from "./util/state";
import SyncNowButton from "./components/sidebar/SyncNowButton";
import { verifyGameSyncable } from "./util/apiClient";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC = () => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  return (
    <>
      <PanelSection title="Version">
        <PanelSectionRow>
          <LudusaviVersion />
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Sync">
        <PanelSectionRow>
          <SyncNowButton />
        </PanelSectionRow>
      </PanelSection>
      <PanelSection>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={(e: Event) =>
              showContextMenu(
                <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                  <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                  <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                  <MenuItem onSelected={() => {}}>Item #3</MenuItem>
                </Menu>,
                e.currentTarget ?? window
              )
            }
          >
            Server says yolo
          </ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={logo} />
          </div>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              Router.CloseSideMenus();
              Router.Navigate("/decky-plugin-test");
            }}
          >
            Router
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  appState.initialize(serverApi);

  const { unregister: removeGameExitListener } = SteamClient.GameSessions.RegisterForAppLifetimeNotifications(async (e: LifetimeNotification) => {
    console.warn("Lud", e);

    if (!appState.currentState.auto_backup_enabled) return;

    // On Start
    if (e.bRunning) {
      const x = await Promise.all([SteamClient.Apps.GetLaunchOptionsForApp(e.unAppID), SteamClient.Apps.GetShortcutData([e.unAppID])]);
      const steamGame = x[0][0]?.strGameName;
      const nonSteamGame = x[1][0]?.data?.strAppName;

      const gameName = steamGame ?? nonSteamGame;
      if (gameName && (await verifyGameSyncable(gameName))) {
        appState.pushRecentGame(gameName);
      } else {
        console.error("Ludusavi: game not suppported", gameName)
        appState.serverApi.toaster.toast({
          title: "Ludusavi",
          body: `Game '${gameName}' not supported. Click to learn more.`,
          // onClick: () => {
          //   showModal(
          //     <ModalRoot>
          //       <DialogHeader>{gameName}</DialogHeader>
          //       <DialogBody>
          //         <div>
          //           Ludusavi does not know how to back up this game. For Steam games or PC games in general, this should never occur, however other games (i.e.
          //           emulated) this is common. To enable support, go to Desktop mode, open Ludusavi app window, and add the game in 'CUSTOM GAMES' tab. It is
          //           crucial that the name in Ludusavi matches the name on Steam (look at the top of this window) exactly.
          //         </div>
          //       </DialogBody>
          //     </ModalRoot>
          //   );
          // },
          onClick: () => {
            console.warn("awdawdawdawd")
          },
        });
      }

      console.log(appState.currentState.recent_games);

      // getServerApi.callPluginMethod("");
      // appState.pushRecentGame(e.)
    }

    // On Exit
    else {
    }
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content />,
    icon: <FaShip />,
    onDismount() {
      removeGameExitListener();
    },
  };
});
