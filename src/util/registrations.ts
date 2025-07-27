import { onGameExit, onGameStart } from "./syncUtil";
import PluginLogsPage from "../pages/PluginLogsPage";
import { AppLifetimeNotification } from "@decky/ui/dist/globals/steam-client/GameSessions";
import { Unregisterable } from "@decky/ui";

const registrations: Unregisterable[] = [];

function registerAppLifecycleNotifications() {
    registrations.push(SteamClient.GameSessions.RegisterForAppLifetimeNotifications(async (e: AppLifetimeNotification) => {
        if (e.bRunning) {
            onGameStart(e.unAppID);
        } else {
            onGameExit(e.unAppID);
        }
    }));
}

function registerPages() {
    registrations.push(PluginLogsPage.register());
}


export const registerDependencies = () => {
    registerAppLifecycleNotifications();
    registerPages();

    return () => registrations.forEach((registration) => {
        registration.unregister();
    });
}


