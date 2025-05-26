const EcosystemConfig = {
  apps: [
    {
      name: "Core-Plex-Demonstrament",
      script: "dpm",
      args: "--config dpm.config.documents.js",
      watch: [
        "index.js",
        "package.json",
        "dpm.config.documents.js",
        "ecosystem.config.cjs",
        "../node_modules/recourse/development",
        "../node_modules/document-process-manager/development",
        "../distributement",
      ],
      ignoreWatch: [
        "!../node_modules/document-process-manager/development",
        "!../node_modules/recourse/development",
      ],
      watch_options: {
        followSymLinks: true,
      },
      autorestart: false,
      execMode: "fork",
    },
  ]
}
module.exports = EcosystemConfig
