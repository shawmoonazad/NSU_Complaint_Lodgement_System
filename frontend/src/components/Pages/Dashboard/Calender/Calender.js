import React from 'react';
// import isWeekend from 'date-fns/isWeekend';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';


const Calender = ({ date, setdate }) => {
    // const [date, setdate] = React.useState(new Date());
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                    // orientation="landscape"
                    displayStaticWrapperAs='desktop'
                    openTo="day"
                    value={date}
                    // shouldDisableDate={isWeekend}
                    onChange={(newValue) => {
                        setdate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    );
};

export default Calender;