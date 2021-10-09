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
  return (
    <div key={apptDetail.id} className={`apptItem ${apptDetail.isLongAppt ? "apptItem--long" : ""} apptItem--${apptDetail.status.toLowerCase()}`}>
      <p><strong>Date:</strong> {apptDetail.startDate}</p>
      <p><strong>Time:</strong> {apptDetail.startTime} - {apptDetail.endTime}</p>
      <p><strong>Duration:</strong> {apptDetail.durationHour > 0 ? apptDetail.durationHour + ' hour' : '' }{ apptDetail.durationHour >= 2 ? 's' : '' } {apptDetail.durationMinute > 0 ? apptDetail.durationMinute + ' minute' : '' }{ apptDetail.durationMinute >= 2 ? 's' : '' } </p>
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
    { label: "Date", value: "startDate" },
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


        {sortedKeyVals.map(function(keyName, index){
          return <div key={ index } className="apptList">
            <h2>{keyName ? keyName : "All appointments"}</h2>
            
            {sortedData[keyName].map( (appt) => (
                <AppointmentItem key={appt.id} apptDetail={appt} />
            ))}

          </div>;
        })}
      </div>

  )
};

ReactDOM.render(
  <AppointmentList />,
  document.getElementById('app'),
)

// reusable functions
function sortByDate( arr ) {
  return arr.sort( ( a, b ) => { return new moment(a.startDate, 'dddd, MMMM Do YYYY') - new moment(b.startDate, 'dddd, MMMM Do YYYY')) })
}

function groupBy( arr, key ) {


      arr.map( (item) => {

        if ( ! moment(item.startDate, 'dddd, MMMM Do YYYY', true).isValid() ) {

          const startDateFormatted = moment(item.startDate, moment.ISO_8601);
          const endDateFormatted = moment(item.endDate, moment.ISO_8601);
          const apptDuration = moment.duration( endDateFormatted.diff(startDateFormatted) );
          
          item.startDate = startDateFormatted.format("dddd, MMMM Do YYYY").toString();
          item.endDate = endDateFormatted.format("dddd, MMMM Do YYYY").toString();
          item.startTime = startDateFormatted.format("h:mm a").toString();
          item.endTime = endDateFormatted.format("h:mm a").toString();
          item.durationHour = apptDuration.hours();
          item.durationMinute = apptDuration.minutes();
          item.isLongAppt = apptDuration.hours() > 1 && apptDuration.minutes() > 0;
        }

        return item;
      }) 


    let result = arr.reduce((res, item) => {
      res[item[key]] = [...res[item[key]] || [], item];
      sortByDate(res[item[key]]);
      return res;
    }, {});
  
    return result;
  }

function getKeyVals (arr, key) {
  return arr.map(item => item[key]).filter((value, index, self) => self.indexOf(value) === index);
}