const { app, BrowserWindow, protocol, net } = require("electron");
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

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    icon: path.join(__dirname, "../images/logo.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("app://./index.html");
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
