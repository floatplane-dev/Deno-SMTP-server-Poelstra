module.exports = {
  apps: [
    {
      name: "app",
      script: "./deno.js",
      interpreter: "deno",
      interpreterArgs: "run --allow-net --allow-read",
    },
  ],
};
