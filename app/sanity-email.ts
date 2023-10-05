import * as log from "https://deno.land/std@0.203.0/log/mod.ts";
import { load } from "https://deno.land/std@0.203.0/dotenv/mod.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { response } from "./helpers.ts";

export async function sendSanityEmail(): Promise<Response> {
  log.debug("sendSanityEmail()");

  // LOAD SECRETS

  await load({ export: true });

  // PREPARE SMTP

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.sendgrid.net",
      port: 465,
      tls: true,
      auth: {
        username: "apikey",
        password: Deno.env.get("SENDGRID_APIKEY"),
      },
    },
  });

  // EMAIL THE DATA TO POELSTRA

  await client.send({
    from: "Jan Werkhoven <jw@floatplane.dev>",
    to: "Jan Werkhoven <jan.werkhoven@gmail.com>",
    subject: `Sanity email`,
    content: "auto",
    html: `
      <p>Smooth sailing.</p>
    `,
  });

  await client.close();

  return response(200, { success: true });
}
