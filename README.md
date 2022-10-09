# SMTP server Poelstra

#### What

This SMTP backend server waits for form submissions from the website
[huisartspoelstra.nl](https://huisartspoelstra.nl) and emails the results to team Poelstra.

#### Built with

- Deno 🦕
- Typescript 🌱
- Nginx 🏎️
- Debian 🐧
- PM2 ✨

#### Built by

- Jan Werkhoven ([email](mailto:jw@floatplane.dev), [GitHub](https://github.com/janwerkhoven), [Linkedin](https://www.linkedin.com/in/jan-werkhoven))

---

#### For developers

Development is done on the `development` Git branch.

Commits pushed to the `production` branch are deployed automatically with Github Actions.

To run the development server:

```
deno run --allow-env --allow-read --allow-net --unstable app/server.ts
```

To run the Deno linter:

```
deno lint
```

To daemonise the Deno server in production, use PM2:

```
pm2 start
```

---

#### Questions?

Ask team Floatplane!

[hello@floatplane.dev](mailto:hello@floatplane.dev)  
[www.floatplane.dev](floatplane.dev)

