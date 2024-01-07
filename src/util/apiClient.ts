import { getServerApi } from "./state";

export async function getLudusaviVersion() {
    const version = await getServerApi().callPluginMethod<{}, { bin_path?: string, version: string }>("get_ludusavi_version", {});

    console.log("Ludusavi version", version)

    if (version.success)
        return version.result.version;

    return 'N/A';
}

export async function verifyGameSyncable(gameName: string) {
    const result = await getServerApi().callPluginMethod<{ game_name: string }, { exists: boolean }>("verify_game_exists", { game_name: gameName });
    if (result.success && result.result.exists)
        return true;

    return false;
}