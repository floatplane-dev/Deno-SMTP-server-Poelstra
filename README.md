# SMTP client for Poelstra

This backend waits for submissions from the website
[huisartspoelstra.nl](https://huisartspoelstra.nl) and emails the results to
several people.

### Built with

- Deno 🦕
- Typescript 🕶️
- Nginx 🏎️

### Built by

Jan Werkhoven ([GitHub](https://github.com/floatplane-dev),
[Linkedin](https://www.linkedin.com/in/jan-werkhoven))

### Development

Run the production server:

```
deno run --allow-env --allow-net --unstable app/server.ts
```

Run the development server:

```
deno run --allow-env --allow-read --allow-net --unstable app/server.ts
```

Run the Deno / Typescript / ES linter:

```
deno lint
```

---

#### Questions?

Ask team Floatplane! 🌱

[hello@floatplane.dev](mailto:hello@floatplane.dev)\
[www.floatplane.dev](floatplane.dev)\
[GitHub](https://github.com/floatplane-dev)\
[LinkedIn](https://au.linkedin.com/pub/jan-werkhoven/10/64/b30)
