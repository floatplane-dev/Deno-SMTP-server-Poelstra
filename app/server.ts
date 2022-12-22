import { serve } from "https://deno.land/std@0.156.0/http/server.ts";
import { response } from "./helpers.ts";
import { sendContactEmails } from "./contact-request.ts";
import { sendRegistrationEmail } from "./registration-request.ts";
import { branch, commit } from "https://deno.land/x/ci/mod.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(`${req.referrer}`);
  console.log(`${req.method} ${req.url}`);

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
}

serve(handler, { port: 4242, reusePort: true });
