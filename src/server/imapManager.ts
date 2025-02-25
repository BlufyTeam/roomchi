// src/server/imapManager.ts

import Imap from "imap";
import { simpleParser } from "mailparser";
import ICAL from "ical.js";
import { keepConnectionAlive } from "~/server/email";
import {
  createAppointment,
  deleteAppointment,
} from "~/server/api/routers/income-mail";

const imapInstances = new Map<string, Imap>(); // Store IMAP connections globally

export function runConnection(imapConfig: Imap.Config, companyId: string) {
  if (imapInstances.has(companyId)) {
    console.log(`IMAP listener already running for company: ${companyId}`);
    return { message: "IMAP listener is already running" };
  }

  let imapInstance = new Imap(imapConfig);
  imapInstances.set(companyId, imapInstance);

  keepConnectionAlive(imapInstance, (appointment, action) => {
    if (action === "CREATE") {
      createAppointment(appointment, companyId);
    }
    if (action === "CANCELED") {
      deleteAppointment(appointment);
    }
  });

  imapInstance.once("end", () => {
    console.log(`IMAP connection closed for company: ${companyId}`);
    imapInstances.delete(companyId); // Remove instance on disconnect
  });

  imapInstance.connect(); // Start IMAP connection

  return { message: "IMAP listener started" };
}

export function stopConnection(companyId: string) {
  const imap = imapInstances.get(companyId);
  if (!imap) {
    return { message: "No IMAP listener is running for this company" };
  }

  imap.end(); // Gracefully close the connection
  imapInstances.delete(companyId);
  return { message: `IMAP listener stopped for company: ${companyId}` };
}

export function isConnectionRunning(companyId: string) {
  return imapInstances.has(companyId);
}
