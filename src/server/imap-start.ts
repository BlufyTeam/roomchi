// import Imap from "imap";
// import {
//   createAppointment,
//   deleteAppointment,
// } from "~/server/api/routers/income-mail";
// import { fetchLatestEmail, keepConnectionAlive } from "~/server/email";
// export const imapInstances = new Map<string, Imap>(); // Store IMAP connections globally

// export function runConnection(imapConfig: Imap.Config, companyId: string) {
//   if (imapInstances.has(companyId)) {
//     console.log(`IMAP listener already running for company: ${companyId}`);
//     return { message: "IMAP listener is already running" };
//   }

//   let imapInstance = new Imap(imapConfig);
//   imapInstances.set(companyId, imapInstance);

//   const openInbox = (callback: (err?: Error) => void) => {
//     //SENT ITEMS
//     imapInstance.openBox("INBOX", false, callback); // Open inbox in read-write mode (false)
//   };

//   //   imapInstance.once("ready", () => {
//   //     openInbox((err) => {
//   //       if (err) {
//   //         console.error("Failed to open inbox:", err);
//   //         return;
//   //       }
//   //       console.log("IMAP connection ready. Listening for new emails...");

//   //       // Listen for new emails using the 'mail' event
//   //       imapInstance.on("mail", () => {
//   //         console.log("New mail detected! Fetching the latest email...");
//   //         fetchLatestEmail(imapInstance, onAppointment); // Fetch latest email
//   //       });
//   //     });
//   //   });

//   imapInstance.once("error", (err) => {
//     console.log("error", err);
//     imapInstance.connect();
//   });

//   imapInstance.once("end", () => {
//     console.log(`IMAP connection closed for company: ${companyId}`);
//     imapInstance.connect();
//   });

//   imapInstance.connect(); // Start IMAP connection

//   return { message: "IMAP listener started" };
// }

// export function stopConnection(companyId: string) {
//   const imap = imapInstances.get(companyId);
//   if (!imap) {
//     return { message: "No IMAP listener is running for this company" };
//   }

//   imap.end(); // Gracefully close the connection
//   imapInstances.delete(companyId);
//   return { message: `IMAP listener stopped for company: ${companyId}` };
// }

// export function isConnectionRunning(companyId: string) {
//   return imapInstances.has(companyId);
// }
