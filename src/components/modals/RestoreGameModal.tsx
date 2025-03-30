import { ButtonItem, ConfirmModal, Dropdown } from "@decky/ui";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { GameInfo, setAppState, useAppState } from "../../util/state";
import { getGameCloudState, getGameBackups, getLudusaviConfig, restorePreview, syncGameCloudState, restore } from "../../util/backend";
import DeckyStoreButton from "../other/DeckyStoreButton";
import { toaster } from "@decky/api";
import { FaDownload, FaUpload } from "react-icons/fa";

const ModalBody: FC<{ game: GameInfo; setSelectedBackup: (backupId?: string) => void }> = ({ game, setSelectedBackup }) => {
  const [ludusaviConfig, setLudusaviConfig] = useState<LudusaviConfig>();
  const [cloudStatus, setCloudStatus] = useState<"OK" | "Disabled" | "Out of Sync" | "Unknown Game">();

  const [outOfSyncGames, setOutOfSyncGames] = useState<string>();
  const [backups, setBackups] = useState<LudusaviBackupItem[]>();

  // On mount, load config.
  useEffect(() => {
    getLudusaviConfig().then((config) => {
      setLudusaviConfig(config);
    });
  }, []);

  const refreshCloudStatus = useCallback(() => {
    setCloudStatus(undefined);
    if (ludusaviConfig) {
      if (ludusaviConfig.cloud && ludusaviConfig.cloud.remote && ludusaviConfig.cloud.synchronize) {
        getGameCloudState(game.alias).then((r) => {
          if (r.startsWith("No changes to synchronize")) {
            setCloudStatus("OK");
          } else if (r.startsWith("No info for these games:")) {
            setCloudStatus("Unknown Game");
          } else {
            setCloudStatus("Out of Sync");
            setOutOfSyncGames(r);
          }
        });
      } else {
        setCloudStatus("Disabled");
      }
    }
  }, [ludusaviConfig, game.alias]);

  // Once config is loaded, perform initial checks, like cloud status and if game exists in first place.
  useEffect(() => {
    refreshCloudStatus();
  }, [refreshCloudStatus]);

  // If cloud is OK, fetch backups.
  useEffect(() => {
    if (cloudStatus === "OK" || cloudStatus === "Disabled") {
      getGameBackups(game.alias).then((r) => {
        const backups = r.games[game.alias]?.backups;
        if (r.errors || !backups) {
          setCloudStatus("Unknown Game");
          return;
        }

        setBackups(backups);
      });
    } else {
      setBackups(undefined);
    }
  }, [cloudStatus, game.alias]);

  const progress = useMemo(() => {
    let res = "Fetching Ludusavi Config... ";
    if (!ludusaviConfig) return { text: res, inProgress: true };
    res += "OK\n";

    res += "Checking Cloud Status (might take a minute)...";
    if (!cloudStatus) return { text: res, inProgress: true };

    res += `${cloudStatus}\n`;
    if (cloudStatus === "Out of Sync" || cloudStatus === "Unknown Game") return { text: res, inProgress: false };

    res += "Fetching Backups... ";
    if (!backups) return { text: res, inProgress: true };
    res += "OK\n";

    return { text: res, inProgress: false };
  }, [ludusaviConfig, cloudStatus, backups]);

  if (progress.inProgress) {
    return (
      <div>
        <h3>Loading...</h3>
        <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{progress.text}</p>
      </div>
    );
  }

  if (cloudStatus === "Unknown Game") {
    return (
      <p>
        [<b style={{ color: "red" }}>ERROR</b>] The game {game.alias} could not be recognized. If this is a custom non-steam game, make sure to first add it to
        Ludusavi in Desktop mode.
      </p>
    );
  }

  if (cloudStatus === "Out of Sync") {
    return <OutOfSyncSection game={game} outOfSyncGames={outOfSyncGames} refreshCloudStatus={refreshCloudStatus} />;
  }

  return <BackupsDropdown game={game} backups={backups} onSelected={setSelectedBackup} />;
};

const OutOfSyncSection: FC<{ game: GameInfo; outOfSyncGames?: string; refreshCloudStatus: () => void }> = ({ game, outOfSyncGames, refreshCloudStatus }) => {
  const { syncing } = useAppState();

  const handleCallback = useCallback(
    (direction: "upload" | "download") => {
      setAppState("syncing", true);
      syncGameCloudState(game.alias, direction)
        .then(() => {
          refreshCloudStatus();
        })
        .finally(() => {
          setAppState("syncing", false);
        });
    },
    [game.alias]
  );

  return (
    <>
      <p>
        [<b style={{ color: "red" }}>ERROR</b>] Remote backups out of sync with local repository. You will need to replace local repository with remote or
        vice-versa. If you are unsure what this means, try resolving the issue in the Ludusavi Desktop GUI.
      </p>
      <p>The changed files are listed below.</p>
      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: "8em" }}>{outOfSyncGames}</div>
      <div style={{ display: "flex", gap: "0.5em", justifyContent: "space-evenly" }}>
        <ButtonItem layout="below" onClick={() => handleCallback("download")} disabled={syncing}>
          <DeckyStoreButton icon={<FaDownload />}>Replace Local Data with Cloud</DeckyStoreButton>
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => handleCallback("upload")} disabled={syncing}>
          <DeckyStoreButton icon={<FaUpload />}>Replace Cloud Data with Local</DeckyStoreButton>
        </ButtonItem>
      </div>
    </>
  );
};

const BackupsDropdown: FC<{ game: GameInfo; backups?: LudusaviBackupItem[]; onSelected: (backupId?: string) => void }> = ({ game, backups, onSelected }) => {
  const backupsList = useMemo(() => {
    if (!backups) return [];
    return backups
      .slice()
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
      .map((b) => ({
        label: new Date(b.when).toLocaleString(),
        data: b.name,
      }));
  }, [backups]);

  const [selectedBackup, setSelectedBackup] = useState<string>();
  const [diff, setDiff] = useState<string>();

  useEffect(() => {
    if (backupsList.length > 0) {
      setSelectedBackup(backupsList[0].data);
    } else {
      setSelectedBackup(undefined);
    }
  }, [backupsList]);

  useEffect(() => {
    setDiff(undefined);

    if (selectedBackup) {
      restorePreview(game.alias, selectedBackup).then((l) => setDiff(l));
    }
  }, [selectedBackup, game.alias]);

  useEffect(() => {
    if (diff) {
      onSelected(selectedBackup);
    } else {
      onSelected(undefined);
    }
  }, [diff]); // Enable the button after diff load, not after selection.

  return (
    <>
      <Dropdown
        rgOptions={backupsList}
        selectedOption={selectedBackup}
        onChange={(q) => {
          setSelectedBackup(q.data);
        }}
      />
      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: "12em", overflow: "scroll", marginTop: "1em" }}>{diff}</div>
    </>
  );
};

export const RestoreGameModal: FC<{ game: GameInfo; closeModal?: () => void }> = ({ game, closeModal }) => {
  const { syncing } = useAppState();
  const [selectedBackup, setSelectedBackup] = useState<string>();

  return (
    <ConfirmModal
      strTitle={`Restore: ${game.alias}`}
      bOKDisabled={!selectedBackup || syncing}
      onOK={() => {
        setAppState("syncing", true);
        restore(game.alias, selectedBackup!)
          .then(() => {
            toaster.toast({ title: "Restore Complete", body: `Game ${game.alias} restored from backup ${selectedBackup}` });
          })
          .catch((e) => {
            console.error(e);
            toaster.toast({ title: "Restore Failed", body: `Error restoring game ${game.alias} from backup ${selectedBackup}: ${e}` });
          })
          .finally(() => {
            setAppState("syncing", false);
          });
      }}
      closeModal={closeModal}
      onCancel={closeModal}
    >
      <ModalBody game={game} setSelectedBackup={setSelectedBackup} />
    </ConfirmModal>
  );
};
