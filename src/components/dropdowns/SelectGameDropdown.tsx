import { FC, useMemo } from "react";
import { setAppState, useAppState } from "../../util/state";
import { Dropdown } from "@decky/ui";

export const SelectGameDropdown: FC = () => {
  const { recent_games, recent_games_selected } = useAppState();
  const idx = useMemo(() => recent_games?.findIndex(e => e == recent_games_selected) ?? -1, [recent_games, recent_games_selected])

  const update = (index: number) => {
    setAppState("recent_games_selected", recent_games[index]);
  };

  const data = useMemo(() => {
    if (recent_games.length === 0) {
      return [{ label: "No Recent Games", data: -1 }];
    }

    return recent_games.slice(0, 5).map((g, i) => ({ label: g, data: i }));
  }, [recent_games]);

  return <Dropdown rgOptions={data} selectedOption={idx} onChange={(e) => update(e.data)} disabled={recent_games.length === 0} />;
};
