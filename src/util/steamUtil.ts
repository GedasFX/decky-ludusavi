import { getGameNameFromManifest, log } from "./backend";

declare const appStore: any;
export const resolveGameName = async (appId: number) => {
  const [launchOptions, appOverview, manifest] = await Promise.all([
    SteamClient.Apps.GetLaunchOptionsForApp(appId),
    appStore.GetAppOverviewByAppID(appId),
    getGameNameFromManifest(appId.toString()),
  ]);

  const manifestName = manifest.games ? Object.keys(manifest.games)[0] : undefined;
  const steamGameName = launchOptions?.[0]?.strGameName;
  const nonSteamGameName = appOverview?.display_name as string | undefined;

  await log(
    `APP_ID ${appId}: Manifest - [${manifestName ?? ''}], Launch Options - [${steamGameName ?? ''}], App Overview - [${nonSteamGameName ?? ''}].`,
    "info"
  );

  return manifestName || steamGameName || nonSteamGameName;
};
