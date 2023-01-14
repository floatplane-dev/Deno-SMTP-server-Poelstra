import * as log from "https://deno.land/std@0.172.0/log/mod.ts";
import { Server } from "https://deno.land/std@0.172.0/http/server.ts";
import { branch, commit } from "https://deno.land/x/ci/mod.ts";
import { response } from "./helpers.ts";
import { sendContactEmails } from "./contact-request.ts";
import { sendRegistrationEmail } from "./registration-request.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },

    tasks: {
      level: "ERROR",
      handlers: ["console"],
    },
  },
});

const onRequest = async function (req: Request): Promise<Response> {
  const url = new URL(req.url);

  log.debug(`------`);
  log.debug(`request: ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    const body = JSON.stringify({ message: "pass" });
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
    };

    return response(200, body, headers);
  }

  if (req.method === "POST") {
    if (url.pathname === "/submit-contact-form") {
      const body: any = await req.text();
      const data: any = JSON.parse(body);
      const { name, email, message } = data;

      return sendContactEmails(name, email, message);
    }

    if (url.pathname === "/submit-registration-form") {
      const body: any = await req.text();
      const data: any = JSON.parse(body);
      const {
        firstName,
        lastName,
        gender,
        dob,
        address,
        email,
        phone,
        bsn,
        agreed1,
        agreed2,
      } = data;
      return sendRegistrationEmail(
        firstName,
        lastName,
        gender,
        dob,
        address,
        email,
        phone,
        bsn,
        agreed1,
        agreed2
      );
    }

    return response(404, { error: "invalid path" });
  }

  if (req.method === "GET") {
    if (url.pathname === "/sanity-check") {
      return response(200, {
        sanity: "smooth sailing ⛵",
        git: { branch, commit },
      });
    }
  }

  return response(403, { error: "invalid method" });
};

const server = new Server({ port: 4244, handler: onRequest });

log.debug("server listening on http://localhost:4244");

await server.listenAndServe().catch((error) => {
  log.error(error);
});
