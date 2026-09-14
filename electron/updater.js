const { app, net, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { extractTarball, shippedEntries, replaceEntries } = require("./updateFiles");

const API_URL = "https://api.github.com/repos/NikEmman/vaxyp/releases/latest";
const RELEASES_URL = "https://github.com/NikEmman/vaxyp/releases/latest";
const HEADERS = { "User-Agent": "vaxyp-app" };
// The police network proxy only lets requests through occasionally, so keep trying.
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

const updateDir = () => path.join(app.getPath("userData"), "update");
const stagedDir = () => path.join(updateDir(), "files");
const readyFile = () => path.join(updateDir(), "ready.json");
const stateFile = () => path.join(app.getPath("userData"), "update-state.json");

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function isNewer(latest, current) {
  const a = latest.replace(/^v/, "").split(".").map(Number);
  const b = current.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

// Installs an update downloaded in a previous session. Must run before any
// window loads. Returns true if the app should relaunch into the new files.
function applyPendingUpdate() {
  if (!app.isPackaged || !fs.existsSync(readyFile())) return false;
  const { version } = readJson(readyFile());
  try {
    replaceEntries(
      stagedDir(),
      app.getAppPath(),
      shippedEntries(stagedDir()),
      path.join(app.getPath("userData"), "update-backup")
    );
    return true;
  } catch {
    // e.g. the app folder is read-only; fall back to the manual download notice
    fs.writeFileSync(stateFile(), JSON.stringify({ failedVersion: version }));
    return false;
  } finally {
    fs.rmSync(updateDir(), { recursive: true, force: true });
  }
}

// Downloads the release source and stages it for the next launch. Returns
// false if it can't be installed by copying files (e.g. Electron major bump).
async function stageUpdate(release) {
  const res = await net.fetch(release.tarball_url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(10 * 60 * 1000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const tarball = Buffer.from(await res.arrayBuffer());

  fs.rmSync(updateDir(), { recursive: true, force: true });
  extractTarball(tarball, stagedDir());

  const pkg = readJson(path.join(stagedDir(), "package.json"));
  const electronMajor = (pkg.devDependencies?.electron ?? "").match(/\d+/)?.[0];
  if (
    !pkg.version ||
    !isNewer(pkg.version, app.getVersion()) ||
    electronMajor !== process.versions.electron.split(".")[0]
  ) {
    fs.rmSync(updateDir(), { recursive: true, force: true });
    return false;
  }

  fs.writeFileSync(readyFile(), JSON.stringify({ version: release.tag_name }));
  return true;
}

async function promptRestart(win, tag) {
  const { response } = await dialog.showMessageBox(win, {
    type: "info",
    title: "Ενημέρωση έτοιμη",
    message: `Η έκδοση ${tag} λήφθηκε.`,
    detail:
      "Θα εγκατασταθεί στην επόμενη εκκίνηση της εφαρμογής.\n" +
      "Θέλετε επανεκκίνηση τώρα; Μη αποθηκευμένες αλλαγές θα χαθούν.",
    buttons: ["Επανεκκίνηση τώρα", "Αργότερα"],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) {
    app.relaunch();
    app.quit();
  }
}

async function promptManualDownload(win, tag) {
  const { response } = await dialog.showMessageBox(win, {
    type: "info",
    title: "Νέα έκδοση διαθέσιμη",
    message: `Η έκδοση ${tag} είναι διαθέσιμη.`,
    detail:
      "Η τρέχουσα έκδοση είναι v" + app.getVersion() + ".\n\n" +
      "Για να ενημερώσετε την εφαρμογή:\n" +
      "1. Μεταβείτε στη διεύθυνση:\n" +
      RELEASES_URL + "\n" +
      "Αν η σελίδα δεν ανοίγει σε αυτόν τον υπολογιστή, ανοίξτε την από άλλη συσκευή (λειτουργεί και από κινητό).\n" +
      "2. Κατεβάστε το αρχείο Vaxyp-portable.zip.\n" +
      "3. Μεταφέρετε το zip σε αυτόν τον υπολογιστή.\n" +
      "4. Κλείστε την εφαρμογή.\n" +
      "5. Αποσυμπιέστε το zip στον φάκελο της εφαρμογής και επιλέξτε αντικατάσταση των παλιών αρχείων.\n\n" +
      "Θέλετε να μεταβείτε τώρα στη σελίδα λήψης;",
    buttons: ["Μετάβαση", "Αργότερα"],
    defaultId: 0,
  });

  if (response === 0) {
    shell.openExternal(RELEASES_URL);
  }
}

let checking = false;
let notified = false;

async function checkForUpdates(win) {
  if (checking || notified) return;
  checking = true;
  try {
    const res = await net.fetch(API_URL, { headers: HEADERS, signal: AbortSignal.timeout(30 * 1000) });
    if (!res.ok) return;
    const release = await res.json();
    if (!isNewer(release.tag_name, app.getVersion())) return;

    const autoUpdate = app.isPackaged && readJson(stateFile()).failedVersion !== release.tag_name;
    if (autoUpdate && (await stageUpdate(release))) {
      notified = true;
      await promptRestart(win, release.tag_name);
    } else {
      notified = true;
      await promptManualDownload(win, release.tag_name);
    }
  } catch {
    // network blocked or download cut off — try again on the next interval
  } finally {
    checking = false;
  }
}

function startUpdateChecks(win) {
  checkForUpdates(win);
  const timer = setInterval(() => checkForUpdates(win), CHECK_INTERVAL_MS);
  win.on("closed", () => clearInterval(timer));
}

module.exports = { applyPendingUpdate, startUpdateChecks };
