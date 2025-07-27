import { getGameNameFormManifest, log } from "./backend";

declare const appStore: any;
export const resolveGameName = async (appId: number) => {
  const [launchOptions, appOverview, manifest] = await Promise.all([
    SteamClient.Apps.GetLaunchOptionsForApp(appId),
    appStore.GetAppOverviewByAppID(appId),
    getGameNameFormManifest(appId.toString()),
  ]);

  const manifestName = manifest.games ? Object.keys(manifest.games)[0] : "";
  const steamGameName = launchOptions[0].strGameName;
  const nonSteamGameName = appOverview?.display_name;

  await log(
    `APP_ID ${appId}: Manifest - [${manifestName ?? ''}], Launch Options - [${launchOptions[0].strGameName ?? ''}], App Overview - [${appOverview?.display_name ?? ''}].`,
    "info"
  );

  return manifestName ?? steamGameName ?? nonSteamGameName;
};
