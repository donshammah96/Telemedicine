import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard';
import './tailwind.css';

const patient = {
  first_name: 'John',
};

const appointments = [
  { id: 1, title: 'Appointment 1', date: '2023-10-10', time: '10:00 AM' },
  { id: 2, title: 'Appointment 2', date: '2023-10-11', time: '11:00 AM' },
];

ReactDOM.render(
  <Dashboard patient={patient} appointments={appointments} />,
  document.getElementById('root')
);