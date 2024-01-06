import { useEffect, useState } from "react";
import { getLudusaviVersion } from "../../util/apiClient";

export default function LudusaviVersion() {
    const [version, setVersion] = useState<string>("N/A");

    useEffect(() => {
        getLudusaviVersion().then(v => setVersion(v));
    }, []);

    return <span>{version}</span>;
}