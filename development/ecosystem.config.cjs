const EcosystemConfig = {
  apps: [
    {
      name: "Core-Plex-Development",
      autorestart: false,
      script: "npx",
      watch: [
        "index.js",
        "package.json",
        "**/*.js",
        "../node_modules/recourse/development",
      ],
      ignoreWatch: [
        "!../node_modules/recourse/development",
      ],
      watch_options: {
        followSymLinks: true,
      },
      args: "rollup --config rollup.config.js",
      execMode: "fork"
    },
  ]
}
module.exports = EcosystemConfig
