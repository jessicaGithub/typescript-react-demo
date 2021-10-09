type AppointmentStatus = "ACTIVE" | "CANCELLED";

interface Patient {
  id: String,
  name: String
}

interface Appointment {
  id: String;
  startDate: Date;
  endDate: Date;
  clinicianName: String;
  patient: Patient;
  status: AppointmentStatus;
};

interface AppointmentList {
  children: Appointment
}