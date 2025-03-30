import React, { PropsWithChildren } from "react";

export default function DeckyStoreButton({ icon, children }: PropsWithChildren<{ icon: React.ReactElement }>) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5em" }}>
      {icon}
      <div>{children}</div>
    </div>
  );
}
