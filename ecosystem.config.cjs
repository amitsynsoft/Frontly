module.exports = {
  apps: [
    {
      name: "frontly",
      exec_mode: "fork",
      instances: 1,
      script: ".next/standalone/server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 8022,
      },
      env_test: {
        NODE_ENV: "test",
        PORT: 8022,
      },
      env_development: {
        NODE_ENV: "production",
        APP_ENV: "development",
        PORT: 8022,
      },
    },
  ],
}
