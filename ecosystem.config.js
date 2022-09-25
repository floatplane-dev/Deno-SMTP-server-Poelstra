module.exports = {
  apps: [
    {
      name: "Deno SMTP Poelstra",
      script: "./app/server.ts",
      interpreter: "deno",
      interpreterArgs: "run --allow-env --allow-read --allow-net --unstable",
    },
  ],
};
