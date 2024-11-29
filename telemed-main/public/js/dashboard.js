const loadUpcomingAppointments = async (doctorId) => {
    try {
        const response = await fetch(`/api/appointments/upcoming?doctorId=${doctorId}`);
        const appointments = await response.json();

        const appointmentContainer = document.getElementById('appointmentContainer');
        appointmentContainer.innerHTML = ''; // Clear existing appointments

        if (appointments.length > 0) {
            appointments.forEach(({ id, patient_name, date, time, location }) => {
                const card = document.createElement('div');
                card.classList.add('appointment-card');
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">Patient: ${patient_name}</h5>
                        <p class="card-text">Date: ${new Date(date).toLocaleDateString()}</p>
                        <p class="card-text">Time: ${time}</p>
                        <p class="card-text">Location: ${location}</p>
                        <button class="btn btn-primary" onclick="viewDetails(${id})">View Details</button>
                    </div>
                `;
                appointmentContainer.appendChild(card);
            });
        } else {
            appointmentContainer.innerHTML = '<p>No upcoming appointments.</p>';
        }
    } catch (error) {
        console.error('Failed to load appointments:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const patientId = '<%= patient.id %>'; // Replace with dynamic server-side data
    const doctorId = '<%= doctor.id %>'; // Replace with dynamic server-side data
    loadUpcomingAppointments(doctorId);
    loadUpcomingAppointments(patientId);
});

const viewDetails = (appointmentId) => {
    alert(`View details for appointment ID: ${appointmentId}`);
    // You can implement a modal or navigation to a detailed view page
};