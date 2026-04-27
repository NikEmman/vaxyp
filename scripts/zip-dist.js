const { execSync } = require("child_process");
const path = require("path");

const unpacked = path.join(__dirname, "../dist/win-unpacked");
const output = path.join(__dirname, "../dist/Vaxyp-portable.zip");

execSync(`powershell Compress-Archive -Path "${unpacked}\\*" -DestinationPath "${output}" -Force`, {
  stdio: "inherit",
});

console.log("Created:", output);
