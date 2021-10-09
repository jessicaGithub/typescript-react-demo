import React, {useState} from 'react';
import ReactDOM from 'react-dom';

// Third party library
import moment from 'moment';

// Types / interfaces
import "./index";

// json data
import initialData from '../data.json';

// style
import './index.css';


const AppointmentItem = ({apptDetail}) => {
  const startDateFormatted = moment(apptDetail.startDate, moment.ISO_8601);
  const endDateFormatted = moment(apptDetail.endDate, moment.ISO_8601);

  const apptDuration = moment.duration( endDateFormatted.diff(startDateFormatted) );
  const durationHour = apptDuration.hours();
  const durationMinute = apptDuration.minutes();
  const isLongAppt = durationHour > 1 && durationMinute > 0;

  return (
    <div key={apptDetail.id} className={`apptItem ${isLongAppt ? "apptItem--long" : ""} apptItem--${apptDetail.status.toLowerCase()}`}>
      <p><strong>Date:</strong> {startDateFormatted.format("dddd, MMMM Do YYYY")}</p>
      <p><strong>Time:</strong> {startDateFormatted.format("h:mm a")} - {endDateFormatted.format("h:mm a")}</p>
      <p><strong>Duration:</strong> {durationHour > 0 ? durationHour + ' hour' : '' }{ durationHour >= 2 ? 's' : '' } {durationMinute > 0 ? durationMinute + ' minute' : '' }{ durationMinute >= 2 ? 's' : '' } </p>
      <hr/>
      <p><strong>Clinician:</strong> {apptDetail.clinicianName}</p>
      <p><strong>Patient:</strong> {apptDetail.patient.name}</p>
      <p><strong>Status:</strong> {apptDetail.status}</p>
    </div>
  )
}; 

const AppointmentList = () => {
  return (
    <div className="apptDashboard">
      <h2>Appointment Dashboard</h2>
      <div className="apptList">
        {initialData.map( (appt) => (
          <AppointmentItem key={appt.id} apptDetail={appt} />
        ))}
      </div>
    </div>
  )
};

ReactDOM.render(
  <AppointmentList />,
  document.getElementById('app'),
)