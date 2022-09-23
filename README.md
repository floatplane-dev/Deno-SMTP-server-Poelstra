# SMTP server Poelstra

This SMTP backend server waits for form submissions from the website
[huisartspoelstra.nl](https://huisartspoelstra.nl) and emails the results to team Poelstra.

### Built with / on

- Deno 🦕
- Typescript 🌱
- Nginx 🏎️
- Debian 🐧
- PM2 ✨

### Built by

- Jan Werkhoven ([email](mailto:jw@floatplane.dev), [GitHub](https://github.com/floatplane-dev), [Linkedin](https://www.linkedin.com/in/jan-werkhoven))

### For developers

To run the server:

```
deno run --allow-env --allow-read --allow-net --unstable app/server.ts
```

To run the Deno linter:

```
deno lint
```

Development is done on the `development` Git branch.

Commits pushed to the `production` branch are deployed automatically with Github Actions.

### Questions?

Ask team Floatplane! ⛵  
[hello@floatplane.dev](mailto:hello@floatplane.dev)  
[www.floatplane.dev](floatplane.dev)
