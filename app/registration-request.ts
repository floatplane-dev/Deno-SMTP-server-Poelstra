import * as log from "https://deno.land/std@0.203.0/log/mod.ts";
import { load } from "https://deno.land/std@0.203.0/dotenv/mod.ts";
import { existsSync } from "https://deno.land/std@0.203.0/fs/mod.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { response, getJson, writeJson } from "./helpers.ts";

export async function sendRegistrationEmail(
  firstName: string,
  lastName: string,
  gender: string,
  dob: string,
  address: string,
  email: string,
  phone: string,
  bsn: string,
  agreed1: boolean,
  agreed2: boolean
): Promise<Response> {
  console.log("sendRegistrationEmail()");
  console.log({ firstName });
  console.log({ lastName });
  console.log({ gender });
  console.log({ dob });
  console.log({ address });
  console.log({ email });
  console.log({ phone });
  console.log({ bsn });
  console.log({ agreed1 });
  console.log({ agreed2 });

  // GET AND INCREMENT THE COUNTER

  const path1: string = "./data/metrics.json";
  const metrics: any = (await existsSync(path1))
    ? await getJson(path1)
    : { contactCount: 0, registrationCount: 0 };
  console.log({ metrics });
  const count: number = metrics.registrationCount + 1;
  console.log({ count });
  metrics.registrationCount = count;
  await writeJson(path1, metrics);

  // STORE THE REQUEST

  const path2: string = "./data/registration-requests.json";
  const registrationRequests: any = (await existsSync(path2))
    ? await getJson(path2)
    : [];
  registrationRequests.push({
    id: count,
    date: new Date(),
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
  });
  await writeJson(path2, registrationRequests);

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
    to: "Team Poelstra <fpoelstrahuisarts@hotmail.com>",
    bcc: "Jan Werkhoven <jw@floatplane.dev>",
    subject: `Nieuwe patiënt #${count}`,
    content: "auto",
    html: `
      <p>Beste team Poelstra,</p>
      <p>Een bezoeker heeft op <a href="https://huisartspoelstra.nl">huisartspoelstra.nl</a> zonet jullie inschrijvingsformulier ingevuld met de volgende gegevens:</p>
      <ul>
        <li>Voornaam: ${firstName}</li>
        <li>Achternaam: ${lastName}</li>
        <li>Geslacht: ${gender}</li>
        <li>Geboortedatum: ${dob}</li>
        <li>Adres: ${address}</li>
        <li>Email: <a href="mailto:${email}" target="_blank">${email}</a></li>
        <li>Telefoon: ${phone}</li>
        <li>BSN: ${bsn}</li>
        <li>Ik ga akkoord met inschrijving bij Dr Poelstra en geef tevens toestemming om mijn dossier op te vragen bij mijn vorige zorgverlener: ${
          agreed1 ? "JA" : "NEE"
        }</li>
        <li>Ik ga akkoord dat Dr Poelstra mijn gegevens verwerkt die benodigd zijn voor inschrijving: ${
          agreed2 ? "JA" : "NEE"
        }</li>
        <li>ID: #${count}</li>
      </ul>
      <p>Gelieve deze persoon spoedig te beantwoorden.</p>
      <p>Met vriendelijke groet</p>
      <p>Jan Werkhoven
      <br>Jullie Web Developer
      <br><a href="mailto:jw@floatplane.dev" target="_blank">jw@floatplane.dev</a>
      <br><a href="https://floatplane.dev" target="_blank">Floatplane Dev</a>
      </p>
    `,
  });

  await client.close();

  return response(200, { success: true });
}
