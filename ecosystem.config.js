module.exports = {
  apps: [
    {
      name: "Deno SMTP Poelstra",
      script: "./app/start-server.ts",
      interpreter: "deno",
      interpreterArgs:
        "run --allow-env --allow-read --allow-write --allow-net --allow-run=git",
    },
  ],
};
