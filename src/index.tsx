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
  const [sortedData, setSortedData] = useState(groupBy(initialData, ""));
  const [sortedKeyVals, setSortedKeyVals] = useState(getKeyVals(initialData, ""));

  const [items] = useState([
    { label: "None", value: "" },
    // { label: "Date", value: "startDate" },
    { label: "Clinician", value: "clinicianName" }
  ]);
  
  const [groupByVal, setGroupByVal] = useState('');

  function handleSelectChange( event ) {

    let currentVal = event.target.value;
    setGroupByVal( currentVal );
    setSortedData( groupBy(initialData, currentVal) );
    setSortedKeyVals( getKeyVals(initialData, currentVal) );
  }

  return (
    <div className="apptDashboard">
      <h1>Appointment Dashboard</h1>

      <p>Group by: </p>
      <select value={groupByVal} onChange={handleSelectChange}>
        {items.map(item => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>


        {sortedKeyVals.map(function(name, index){
          return <div key={ index } className="apptList">
            <h2>{name ? name : "All appointments"}</h2>
            
            {sortedData[name].map( (appt) => (
                <AppointmentItem key={appt.id} apptDetail={appt} />
            ))}

          </div>;
        })}
        {/* {sortedData.map( (appt) => (
            <AppointmentItem key={appt.id} apptDetail={appt} />
        ))} */}
      </div>

  )
};

ReactDOM.render(
  <AppointmentList />,
  document.getElementById('app'),
)

// reusable functions
function sortByDate( arr ) {
  return arr.sort( ( a, b ) => { return new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf() })
}

function groupBy( arr, key ) {
  let result = arr.reduce((res, item) => {
      res[item[key]] = [...res[item[key]] || [], item];
      return res;
    }, {});

  return result;
}

function getKeyVals (arr, key) {
  return arr.map(item => item[key]).filter((value, index, self) => self.indexOf(value) === index);
}