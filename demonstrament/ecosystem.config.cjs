const EcosystemConfig = {
  apps: [
    {
      name: "Core-Plex-Demonstrament-Documents",
      script: "dpm",
      watch: [
        "index.js",
        "package.json",
        "dpm.config.documents.js",
        "ecosystem.config.cjs",
        "node_modules/document-process-manager/development",
      ],
      args: "--config dpm.config.documents.js",
      autorestart: false,
      execMode: "fork",
    },
  ]
}
module.exports = EcosystemConfig
