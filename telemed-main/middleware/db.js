import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

export default connection;


/*
// Example queries for inserting, selecting, updating, and deleting data
const insertAdminQuery = `INSERT INTO administrators (first_name, last_name, email_address, password_hash, phone_number, date_joined, health_center_id) VALUES ('admin', 'admin', 'admin@example.com', 'hashedpassword', '1234567890', '2023-10-01', 1)`;

connection.query(insertAdminQuery, (err, results) => {
    if (err) {
        console.error('Error inserting data: ' + err.stack);
        return;
    }
    console.log('Data inserted successfully', results);
});

const selectAppointmentsQuery = `SELECT * FROM appointments`;

connection.query(selectAppointmentsQuery, (err, results, fields) => {
    if (err) {
        console.error('Error selecting data: ' + err.stack);
        return;
    }
    console.log('Data fetched successfully', results, fields);
});

const updateAdminQuery = `UPDATE administrators SET first_name = 'newadmin' WHERE first_name = 'admin'`;

connection.query(updateAdminQuery, (err, results) => {
    if (err) {
        console.error('Error updating data: ' + err.stack);
        return;
    }
    console.log('Data updated successfully', results);
});

const deleteAdminQuery = `DELETE FROM administrators WHERE first_name = 'newadmin'`;

connection.query(deleteAdminQuery, (err, results) => {
    if (err) {
        console.error('Error deleting data: ' + err.stack);
        return;
    }
    console.log('Data deleted successfully', results);
});

connection.end((err) => {
    if (err) {
        console.error('Error disconnecting from database: ' + err.stack);
        return;
    }
    console.log('Disconnected from database');
});
*/

//module.exports = connection;
