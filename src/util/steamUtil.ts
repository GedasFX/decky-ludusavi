export const resolveGameName = async (appId: number) => {
    const x = await Promise.all([SteamClient.Apps.GetLaunchOptionsForApp(appId), SteamClient.Apps.GetShortcutData([appId])]);

    const steamGameName = x[0][0]?.strGameName;
    const nonSteamGameName = x[1][0]?.data?.strAppName;

    return steamGameName ?? nonSteamGameName;
}