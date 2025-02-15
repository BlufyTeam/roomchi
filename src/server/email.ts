import Imap from "imap";
import { simpleParser } from "mailparser";
import ICAL from "ical.js";
import { getServerAuthSession } from "~/server/auth";

export type Appointment = {
  subject: string; // The subject of the email or "No Subject" as default
  description: string; // Event description
  start: string; // Start date/time as a string
  end: string; // End date/time as a string
  location: string; // Event location
  isPrivate: boolean;
  attendees: Attendee[]; // List of attendees
};

type Attendee = {
  email: string; // Attendee's email address
  name?: string; // Optional: Attendee's name (parameter "cn")
};

// const imapConfig: Imap.Config = {
//   user: "meet@rouginedarou.com", // Your Gmail address
//   password: "MeEt123", // Your Gmail App Password
//   host: "mail.rouginedarou.com", // Gmail IMAP server
//   port: 993, // IMAP port (usually 993 for SSL)
//   tls: true, // Use TLS
// };
// const imap = new Imap(imapConfig);
// Function to keep the connection alive and listen for new emails
export const keepConnectionAlive = (
  imap: Imap,
  onAppointment: (
    appointment: Appointment,
    action: "CREATE" | "CANCELED"
  ) => void
) => {
  const openInbox = (callback: (err?: Error) => void) => {
    //SENT ITEMS
    imap.openBox("INBOX", false, callback); // Open inbox in read-write mode (false)
  };

  imap.once("ready", () => {
    openInbox((err) => {
      if (err) {
        console.error("Failed to open inbox:", err);
        return;
      }
      console.log("IMAP connection ready. Listening for new emails...");

      // Listen for new emails using the 'mail' event
      imap.on("mail", () => {
        console.log("New mail detected! Fetching the latest email...");
        fetchLatestEmail(imap, onAppointment); // Fetch latest email
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP connection error:", err);
  });

  imap.connect();
};

// Fetch the most recent email whenever a new email arrives
const fetchLatestEmail = (
  imap: Imap,
  onAppointment: (
    appointment: Appointment,
    action: "CREATE" | "CANCELED"
  ) => void
) => {
  // Use 'imap.seq.fetch' to get only the most recent email (latest one)
  imap.seq.fetch("*", { bodies: "" }).on("message", (msg) => {
    msg.on("body", (stream) => {
      simpleParser(stream, (err, mail) => {
        if (err) {
          console.error("Error parsing email:", err);
          return;
        }

        // Check for calendar attachment (text/calendar or application/ics)
        const calendarContent = mail.attachments?.find(
          (attachment) =>
            attachment.contentType === "text/calendar" ||
            attachment.contentType === "application/ics"
        );

        if (calendarContent) {
          const icalData = calendarContent.content.toString();
          const jcalData = ICAL.parse(icalData);
          const comp = new ICAL.Component(jcalData);
          const event = comp.getFirstSubcomponent("vevent");

          if (event) {
            const eventObj = new ICAL.Event(event);

            const privacySetting =
              event.getFirstPropertyValue("class") || "PUBLIC";
            // Extract event details for appointment

            const appointment = {
              subject: mail.subject || "No Subject", // Add subject from the email
              description: eventObj.description,
              isPrivate: privacySetting === "PUBLIC" ? false : true,
              start: eventObj.startDate.toString(),
              end: eventObj.endDate.toString(),
              location: eventObj.location.toString(),
              attendees: event.getAllProperties("attendee").map((att) => ({
                email: att.getFirstValue().toString(),
                name: att.getParameter("cn").toString(),
                // role: att.getParameter("role"),
              })),
            };

            // Trigger the callback function with the appointment details
            onAppointment(
              appointment,
              appointment.subject.startsWith("CANCELED") ? "CANCELED" : "CREATE"
            );
          }
        }
      });
    });
  });
};

// Fetch appointment when deleted
const fetchDeletedAppointment = (
  imap: Imap,
  seqNo: number,
  onAppointmentDeleted: (appointment: Appointment) => void
) => {
  imap.seq.fetch(seqNo, { bodies: "" }).on("message", (msg) => {
    msg.on("body", (stream) => {
      simpleParser(stream, (err, mail) => {
        if (err) {
          console.error("Error parsing deleted email:", err);
          return;
        }

        // Check for calendar cancellation
        const calendarContent = mail.attachments?.find(
          (attachment) =>
            attachment.contentType === "text/calendar" ||
            attachment.contentType === "application/ics"
        );

        if (calendarContent) {
          const icalData = calendarContent.content.toString();
          const jcalData = ICAL.parse(icalData);
          const comp = new ICAL.Component(jcalData);

          const method = comp.getFirstPropertyValue("method");
          if (method === "CANCEL") {
            const event = comp.getFirstSubcomponent("vevent");

            if (event) {
              const eventObj = new ICAL.Event(event);

              const appointment: Appointment = {
                subject: mail.subject || "No Subject",
                description: eventObj.description,
                isPrivate: false, // Assume cancellations are public unless specified
                start: eventObj.startDate.toString(),
                end: eventObj.endDate.toString(),
                location: eventObj.location.toString(),
                attendees: event.getAllProperties("attendee").map((att) => ({
                  email: att.getFirstValue().toString(),
                  name: att.getParameter("cn")?.toString(),
                })),
              };

              onAppointmentDeleted(appointment);
            }
          }
        }
      });
    });
  });
};
