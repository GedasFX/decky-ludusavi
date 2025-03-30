import { routerHook } from "@decky/api";
import { Navigation } from "@decky/ui";
import React, { useEffect, useRef, useState } from "react";
import { getPluginLogs } from "../util/backend";

const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>();
  const logPreRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const idx = setInterval(() => {
      getPluginLogs()
        .then((logs) => {
          setLogs(logs);
        })
        .catch((e) => {
          console.error(e);
        });
    }, 1000);

    return () => {
      clearInterval(idx);
    };
  }, []);

  useEffect(() => {
    logPreRef.current?.scrollTo({
      top: logPreRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [logs]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", margin: "1em", marginTop: "40px", marginBottom: "40px" }}>
      <h2 style={{ flexShrink: 0 }}>Decky Ludusavi - Plugin Logs</h2>
      <div style={{ flexGrow: 1, overflow: "auto", maxHeight: "24em" }}>
        <pre ref={logPreRef} style={{ overflowY: "scroll", whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "smaller", height: "100%" }}>
          {logs}
        </pre>
      </div>
    </div>
  );
};

const page = {
  register: () => {
    routerHook.addRoute("/decky-ludusavi/plugin-logs", () => {
      return <LogsView />;
    });

    return { unregister: () => routerHook.removeRoute("/decky-ludusavi/plugin-logs") };
  },
  navigate: () => {
    Navigation.Navigate("/decky-ludusavi/plugin-logs");
    Navigation.CloseSideMenus();
  },
};

export default page;
