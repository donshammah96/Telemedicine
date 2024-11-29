CREATE DATABASE telemedicine_db;

USE telemedicine_db;

CREATE TABLE Health_Centers (
    health_center_id INT PRIMARY KEY AUTO_INCREMENT,
    health_center_name VARCHAR(100) NOT NULL,
    health_center_address VARCHAR(255) NOT NULL,
    health_center_phone VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE Health_Center_Requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    health_center_name VARCHAR(100) NOT NULL,
    health_center_address VARCHAR(255) NOT NULL,
    health_center_phone VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    request_status VARCHAR(50) NOT NULL
);

CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    health_center_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    doctor_speciality VARCHAR(100) NOT NULL,
    doctor_availability VARCHAR(50) NOT NULL,
    email_address VARCHAR(100),
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    date_joined DATE NOT NULL,
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id)
);

CREATE TABLE Patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    health_center_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    illness VARCHAR(255) NOT NULL,
    language VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id)
);

CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    health_center_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id)
);

CREATE TABLE Visits (
    visit_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    health_center_id INT,
    appointment_id INT,
    date_of_visit DATE NOT NULL,
    date_scheduled DATE NOT NULL,
    visit_department_id INT,
    visit_type VARCHAR(50) NOT NULL,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    pulse INT,
    visit_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

CREATE TABLE Ed_Visits (
    ed_visit_id INT PRIMARY KEY AUTO_INCREMENT,
    visit_id INT,
    patient_id INT,
    acuity INT NOT NULL,
    reason_for_visit VARCHAR(255) NOT NULL,
    disposition VARCHAR(255) NOT NULL,
    FOREIGN KEY (visit_id) REFERENCES visits(visit_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE Admissions (
    admission_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    health_center_id INT,
    admission_date DATE NOT NULL,
    discharge_date DATE NOT NULL,
    discharge_disposition VARCHAR(255) NOT NULL,
    service VARCHAR(100) NOT NULL,
    primary_diagnosis VARCHAR(255) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id)
);

CREATE TABLE Discharges (
    discharge_id INT PRIMARY KEY AUTO_INCREMENT,
    admission_id INT,
    patient_id INT,
    health_center_id INT,
    discharge_date DATE NOT NULL,
    discharge_disposition VARCHAR(255) NOT NULL,
    FOREIGN KEY (admission_id) REFERENCES admissions(admission_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id)
);

CREATE TABLE Administrators (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    health_center_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_joined DATE NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (health_center_id) REFERENCES health_centers(health_center_id)
);