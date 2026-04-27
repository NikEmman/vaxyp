const { app, BrowserWindow, protocol, net } = require("electron");
const path = require("path");
const url = require("url");

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
    const filePath = request.url.slice("app://./".length).split("?")[0];
    const fullPath = path.join(__dirname, "..", filePath);
    return net.fetch(url.pathToFileURL(fullPath).toString());
  });

  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
