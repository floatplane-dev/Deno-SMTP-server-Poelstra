import "https://deno.land/x/dotenv/load.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { response, getJson, writeJson } from "./helpers.ts";

export async function sendContactEmails(
  name: string,
  email: string,
  message: string,
  language: string
): Promise<Response> {
  console.log("sendContactEmails()");
  console.log({ name });
  console.log({ email });
  console.log({ message });
  console.log({ language });

  // First we validate the sanity of the params.
  if (!(language === "nl" || language === "en")) {
    return response(400, { error: "wrong language" });
  }
  if (!email) {
    return response(400, { error: "no email" });
  }
  const regex = /^\S+@\S+\.\S+$/g;
  const emailIsSane = regex.test(email);
  if (!emailIsSane) {
    return response(400, { error: "insane email" });
  }

  // Secondly we read the counter file and increment it.
  const metrics: any = await getJson("./data/metrics.json");
  console.log({ metrics });
  const count: number = metrics.contactCount + 1;
  console.log({ count });
  metrics.contactCount = count;
  await writeJson("./data/metrics.json", metrics);

  // Fire up the SMTP connection
  const connectConfig: any = {
    hostname: "smtp.sendgrid.net",
    port: 465,
    username: "apikey",
    password: Deno.env.get("SENDGRID_APIKEY"),
  };

  const client = new SmtpClient();
  await client.connectTLS(connectConfig);

  // Once connected we email all data to team Poelstra.
  await client.send({
    from: "jw@floatplane.dev",
    to: email,
    // to: "fpoelstrahuisarts@hotmail.com",
    subject: `Website contactverzoek #${count}`,
    content: `
        <p>Beste team Poelstra,</p>
        <p>Een bezoeker heeft op <a href="https://huisartspoelstra.nl">huisartspoelstra.nl</a> zonet jullie contactformulier ingevuld met de volgende gegevens:</p>
        <ul>
          <li>Naam: ${name}</li>
          <li>Email: <a href="mailto:${email}" target="_blank">${email}</a></li>
          <li>Bericht: ${message}</li>
          <li>Teller: #${count}</li>
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

  // Lastly we email a confirmation email to the sender.

  // const dutchEmail = `
  //   <p>Geachte ${name},</p>
  //   <p>Het team van Huisarts Poelstra heeft uw contactverzoek goed ontvangen en zal U spoedig beantwoorden.</p>
  //   <p>Uw bericht:</p>
  //   <p>"${message}"</p>
  //   <p>Met vriendelijke groet,</p>
  //   <p>Team Poelstra</p>
  //   <p><a href="https://huisartspoelstra.nl" target="_blank">huisartspoelstra.nl</a></p>
  // `;

  // const englishEmail = `
  //   <p>Dear ${name},</p>
  //   <p>The team of Huisarts Poelstra has well received your request and shall contact you shortly.</p>
  //   <p>Your message:</p>
  //   <p>"${message}"</p>
  //   <p>Kind regards,</p>
  //   <p>Team Poelstra</p>
  //   <p><a href="https://huisartspoelstra.nl" target="_blank">huisartspoelstra.nl</a></p>
  // `;

  // await client.send({
  //   from: "jw@floatplane.dev",
  //   to: email,
  //   subject: `Huisarts Poelstra`,
  //   content: language === "nl" ? dutchEmail : englishEmail,
  // });

  // Finally close the SMTP connection

  // } catch (e) {
  //   console.log(e.message);
  //   return response(400, { success: false, message: "something went wrong" });
  // }

  await client.close();

  return response(200, { success: true });
}
