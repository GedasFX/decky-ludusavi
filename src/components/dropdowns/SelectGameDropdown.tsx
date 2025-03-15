import { FC, useState, useEffect, useMemo } from "react";
import { useAppState } from "../../util/state";
import { Dropdown } from "@decky/ui";

export const SelectGameDropdown: FC<{ onSelected: (game: string) => void }> = ({ onSelected }) => {
  const { recent_games } = useAppState();
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    if (recent_games[0]) update(0);
  }, [recent_games]);

  const update = (index: number) => {
    setSelected(index);
    onSelected(recent_games[index]);
  };

  const data = useMemo(() => {
    if (recent_games.length === 0) {
      return [{ label: "No Recent Games", data: -1 }];
    }

    return recent_games.slice(0, 30).map((g, i) => ({ label: g, data: i }));
  }, [recent_games]);

  return <Dropdown rgOptions={data} selectedOption={selected} onChange={(e) => update(e.data)} disabled={recent_games.length === 0} />;
};
