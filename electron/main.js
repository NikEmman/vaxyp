const { app, BrowserWindow, protocol, net, Menu, MenuItem, session, dialog, shell } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
    },
  },
]);

function isNewer(latest, current) {
  const a = latest.replace(/^v/, "").split(".").map(Number);
  const b = current.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

async function checkForUpdates(win) {
  try {
    const res = await net.fetch(
      "https://api.github.com/repos/NikEmman/vaxyp/releases/latest",
      { headers: { "User-Agent": "vaxyp-app" } }
    );
    if (!res.ok) return;
    const { tag_name } = await res.json();
    if (!isNewer(tag_name, app.getVersion())) return;

    const releasesUrl = "https://github.com/NikEmman/vaxyp/releases/latest";

    const { response } = await dialog.showMessageBox(win, {
      type: "info",
      title: "Νέα έκδοση διαθέσιμη",
      message: `Η έκδοση ${tag_name} είναι διαθέσιμη.`,
      detail:
        "Η τρέχουσα έκδοση είναι v" + app.getVersion() + ".\nΘέλετε να μεταβείτε στη σελίδα λήψης;\n\n" +
        releasesUrl,
      buttons: ["Μετάβαση", "Αργότερα"],
      defaultId: 0,
    });

    if (response === 0) {
      shell.openExternal(releasesUrl);
    }
  } catch {
    // network blocked or unavailable — fail silently
  }
}

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, "../images/logo.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
    },
  });

  if (app.isPackaged) {
    win.setMenu(null);
    win.webContents.on("devtools-opened", () => win.webContents.closeDevTools());
  } else {
    win.webContents.openDevTools();
  }

  win.maximize();
  win.show();

  win.webContents.session.setSpellCheckerLanguages(["el-GR", "en-US"]);

  win.webContents.on("context-menu", (event, params) => {
    const menu = new Menu();

    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: () => win.webContents.replaceMisspelling(suggestion),
        })
      );
    }

    if (params.misspelledWord) {
      if (params.dictionarySuggestions.length > 0) {
        menu.append(new MenuItem({ type: "separator" }));
      }
      menu.append(
        new MenuItem({
          label: "Προσθήκη στο λεξικό",
          click: () =>
            session.defaultSession.addWordToSpellCheckerDictionary(
              params.misspelledWord
            ),
        })
      );
      menu.append(new MenuItem({ type: "separator" }));
    }

    if (params.isEditable) {
      menu.append(
        new MenuItem({
          label: "Αποκοπή",
          role: "cut",
          enabled: params.editFlags.canCut,
        })
      );
    }

    if (params.isEditable || params.selectionText) {
      menu.append(
        new MenuItem({
          label: "Αντιγραφή",
          role: "copy",
          enabled: params.editFlags.canCopy,
        })
      );
    }

    if (params.isEditable) {
      menu.append(
        new MenuItem({
          label: "Επικόλληση",
          role: "paste",
          enabled: params.editFlags.canPaste,
        })
      );
    }

    if (menu.items.length > 0) {
      menu.popup({ window: win });
    }
  });

  win.loadURL("app://./index.html");
  win.webContents.once("did-finish-load", () => checkForUpdates(win));
}

app.whenReady().then(() => {
  protocol.handle("app", (request) => {
    let filePath = request.url.slice("app://./".length).split("?")[0];
    let fullPath = path.join(__dirname, "..", filePath);

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      fullPath = path.join(fullPath, "index.html");
    }

    return net.fetch(url.pathToFileURL(fullPath).toString());
  });

  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
