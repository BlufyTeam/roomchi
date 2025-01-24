"use client";

import { useState } from "react";
import { api } from "~/utils/api";

interface Appointment {
  id: string;
  summary: string;
  startDate: string;
  endDate: string;
  location: string;
}

export default function AppointmentViewer() {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );
  const {
    data: appointments,
    isLoading,
    error,
  } = api.mail.getLatestEmails.useQuery({ count: 10 });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const selectedAppointmentData = appointments?.find(
    (appointment) => appointment.id === selectedAppointment
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 overflow-y-auto border-r bg-white">
        <h2 className="border-b p-4 text-2xl font-bold">Appointments</h2>
        {appointments?.map((appointment: Appointment) => (
          <div
            key={appointment.id}
            className={`cursor-pointer border-b p-4 hover:bg-gray-100 ${
              selectedAppointment === appointment.id ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelectedAppointment(appointment.id)}
          >
            <h3 className="font-semibold">{appointment.summary}</h3>
            <p className="text-sm text-gray-600">
              {new Date(appointment.startDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="w-2/3 overflow-y-auto p-4">
        {selectedAppointmentData ? (
          <div>
            <h2 className="mb-4 text-2xl font-bold">
              {selectedAppointmentData.summary}
            </h2>
            <p className="mb-2">
              <strong>Start:</strong>{" "}
              {new Date(selectedAppointmentData.startDate).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>End:</strong>{" "}
              {new Date(selectedAppointmentData.endDate).toLocaleString()}
            </p>
            <p className="mb-4">
              <strong>Location:</strong>{" "}
              {selectedAppointmentData.location || "Not specified"}
            </p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select an appointment to view its details
          </div>
        )}
      </div>
    </div>
  );
}
