import { getGameNameFormManifest } from "./backend"

declare const appStore: any;
export const resolveGameName = async (appId: number) => {
    const [launchOptions, appOverview, manifest] = await Promise.all([
        SteamClient.Apps.GetLaunchOptionsForApp(appId),
        appStore.GetAppOverviewByAppID(appId),
        getGameNameFormManifest(appId.toString())
    ]);

    const manifestName = manifest.games ? Object.keys(manifest.games)[0] : ''

    console.log('manifestName', manifest, manifestName)

    const steamGameName = manifestName ?? launchOptions?.strGameName;
    const nonSteamGameName = appOverview?.display_name;

    return steamGameName ?? nonSteamGameName;
}