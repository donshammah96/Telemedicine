# Project Description: Telemedicine Application

## Project Title: Afya-Assist: A Comprehensive Telemedicine Platform

Overview: Afya-Assist is a robust telemedicine platform designed to connect patients with healthcare providers virtually. The platform aims to make healthcare more accessible by allowing users to register, search for nearby health centers, book appointments with doctors, and consult with healthcare professionals online. Built using HTML, CSS, and JavaScript for the frontend, with a Node.js, Python and MySQL backend, Afya-Assist offers a seamless user experience while ensuring secure and efficient management of medical services.

## Key Features:

### User Authentication and Role Management:

Registration and Login: Secure user registration and login system, with role-based access control for administrators, patients and doctors.

Profile Management: Users can manage their profiles, update personal information, and view their appointment history.

### Location-Based Services:

Health Center Locator: Integration with Google Maps API to help users find and view nearby health centers based on their current location or a specified area.

### Appointment Booking:

Doctor Availability: Patients can view doctors' availability and book appointments directly through the platform.
Appointment Management: Users can schedule, reschedule, or cancel appointments, and receive notifications about their bookings.

### Doctor Management:

Specialization and Availability: Doctors can manage their availability, specializations, and appointment slots, ensuring patients have up-to-date information when booking.
Consultation Services: The platform allows for virtual consultations through a secure communication channel.

### User-Friendly Interface:

Responsive Design: The application features a clean, responsive design that ensures a seamless experience across all devices.
Intuitive Navigation: Easy-to-use interface with clear navigation paths for all users, whether they are booking an appointment or managing their profiles.

### Security and Compliance:

Data Security: Implementation of HTTPS, JWT-based authentication, and data encryption to protect user information.
Compliance: Adherence to healthcare standards and regulations, ensuring that user data is handled with the utmost confidentiality.

## AI Implementation for Symptom Checker and Triage

### Symptom Checker and Triage using Infermedica API:
Afya-Assist integrates with the Infermedica API to provide advanced symptom checking and triage services. The AI models are used to analyze symptoms, determine triage levels, parse symptoms from free-text, and predict disease trends.

### Integration with Node.js:
The backend services are implemented using Node.js and Express. The `aiService.js` file contains functions that interact with the Infermedica API to perform symptom checking and triage.

### Loading Libraries in `requirements.txt`:
For the Flask application, the necessary libraries are listed in the `requirements.txt` file. 

## **Technology Stack**
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Python:Flask
- **Database**: MySQL
- **APIs**: Google Maps API for location services, Infermedica API for symptom-checking and triage

## **Installation and Setup**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/)
- [Python](https://www.python.org/downloads/) (latest version)

### **Steps**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/telemed.git
   cd telemed


2. **Install the dependencies**:
  ```sh
  npm install

  ``
  pip install -r requirements.txt

  ```


3. **Set up the environment variables**:

  - Create a .env file in the root directory of the project and   add the following variables:

  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=your_mysql_user
  DB_PASSWORD=your_mysql_password
  DB_NAME=your_database_name
  SESSION_SECRET=your_secure_random_string

4. **Set up the MySQL database**:

    - Create a database in MySQL and run the telemedicine_db.session.sql script to create the necessary tables:

    ```sh

    CREATE DATABASE your_database_name;
    USE your_database_name;
    SOURCE path/to/telemedicine_db.session.sql;
  
  
5. Start application:

  ```sh
  npm start
 ``
## Usage

### **Running tests**:

1. **To run the tests, use the following command**:

```sh
npm test
```


### **Development**

1. **To start the application in development mode with nodemon, use the following command**:

```sh
npm run dev
```

### **Contributing**:


- We welcome contributions to the TeleMed project. To contribute, follow these steps:

1. Fork the repository.

2. Create a new branch (git checkout -b feature-branch).

3. Make your changes and commit them (git commit -m 'Add new feature').

4. Push to the branch (git push origin feature-branch).

5. Open a pull request.

###** Use Cases**:

## **Current Capabilities**:

   - Virtual consultations for remote patients.
   - Simplified appointment management.
   - Geolocation-based health service discovery.
   - Integration with IoT devices for real-time health monitoring.
   - AI-driven diagnostic tools for healthcare professionals.

## **Future Enhancements**:

   - Support for multiple languages to increase global reach.


## **License**:


- This project is licensed under the MIT License. See the LICENSE file for details.

## **Contact**:

For any questions or inquiries, please contact us at support@afya-assist.com.