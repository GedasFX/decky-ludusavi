declare const appStore : any;
export const resolveGameName = async (appId: number) => {
    
    
    const [launchOptions, appOverview] = await Promise.all([
        SteamClient.Apps.GetLaunchOptionsForApp(appId),
        appStore.GetAppOverviewByAppID(appId)
    ]);
    
    const steamGameName = launchOptions?.strGameName;
    const nonSteamGameName = appOverview?.display_name;
    
    return steamGameName ?? nonSteamGameName;
}