import  { useState } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth, isMonday} from 'date-fns';
import { range } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import './Css/MapComponent.css'
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import "./Css/MapComponent.css";

function DatePickerComponent({ onChange}) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const years = range(2000, getYear(new Date()) + 1, 1);
    const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const filterMondays = (date) => {
    return isMonday(date);
  }
  // selecting the date to display the data in the graph
    const onDatePickerChange = (date ) => {
        setSelectedDate(date)
        onChange(date);
    
    console.log('Selected Date:', date);
    
    };
   

    return (
      <div className='datepicker-section'>   
        <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant='light' className='Date-ele' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {<calcite-icon icon="caret-left" />}
            </Button>
            <select className='Date-ele'
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(value)}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select className='Date-ele'
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <Button variant='light' className='Date-ele' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              {<calcite-icon icon="caret-right" />}
            </Button>
          </div>
        )}
        selected={selectedDate}
        onChange={(date) => onDatePickerChange(date)}
        filterDate={filterMondays}
      />
      </div>
    )
}
DatePickerComponent.propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  export default DatePickerComponent;