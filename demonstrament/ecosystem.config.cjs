const EcosystemConfig = {
  apps: [
    {
      name: "Core-Plex-Demonstrament-Documents",
      script: "npx",
      watch: [
        "index.js",
        "package.json",
        "dpm.config.documents.js",
        "../../Document-Process-Manager/development"
      ],
      args: "dpm --config dpm.config.documents.js",
      autorestart: false,
      execMode: "fork",
    },
  ]
}
module.exports = EcosystemConfig
