const EcosystemConfig = {
  apps: [
    {
      name: "Core-Plex-Demonstrament",
      script: "dpm",
      watch: [
        "index.js",
        "package.json",
        "dpm.config.documents.js",
        "ecosystem.config.cjs",
        "../distributement"
      ],
      args: "--config dpm.config.documents.js",
      autorestart: false,
      execMode: "fork",
    },
  ]
}
module.exports = EcosystemConfig
