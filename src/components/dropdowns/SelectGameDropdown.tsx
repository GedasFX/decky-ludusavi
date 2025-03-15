import { FC, useMemo } from "react";
import { setAppState, useAppState } from "../../util/state";
import { Dropdown } from "@decky/ui";

export const SelectGameDropdown: FC<{ onSelected: (game: string) => void }> = ({ onSelected }) => {
  const { recent_games, recent_games_selection_idx } = useAppState();

  const update = (index: number) => {
    setAppState("recent_games_selection_idx", index);
    onSelected(recent_games[index]);
  };

  const data = useMemo(() => {
    if (recent_games.length === 0) {
      return [{ label: "No Recent Games", data: -1 }];
    }

    return recent_games.slice(0, 5).map((g, i) => ({ label: g, data: i }));
  }, [recent_games]);

  return <Dropdown rgOptions={data} selectedOption={recent_games_selection_idx} onChange={(e) => update(e.data)} disabled={recent_games.length === 0} />;
};
