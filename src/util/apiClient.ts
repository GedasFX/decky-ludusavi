import { getServerApi } from "./state";

export async function getLudusaviVersion() {
    const version = await getServerApi().callPluginMethod<{}, { bin_path?: string, version: string }>("get_ludusavi_version", {});

    console.log("Ludusavi version", version)

    if (version.success)
        return version.result.version;

    return 'N/A';
}