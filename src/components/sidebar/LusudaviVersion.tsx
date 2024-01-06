import { useAppState } from "../../util/state";

export default function LudusaviVersion() {
    const state = useAppState();

    return <span>{state.ludisavi_version}</span>;
}