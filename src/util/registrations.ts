import { LifetimeNotification } from "@decky/ui";
import { onGameExit, onGameStart } from "./syncUtil";
import PluginLogsPage from "../pages/PluginLogsPage";

const registrations: Registration[] = [];

function registerAppLifecycleNotifications() {
    registrations.push(SteamClient.GameSessions.RegisterForAppLifetimeNotifications(async (e: LifetimeNotification) => {
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


