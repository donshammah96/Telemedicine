import React from 'react';

const Dashboard = ({ patient, appointments }) => {
  return (
    <main className="container mx-auto p-4">
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-1/4 bg-gray-800 text-white p-4">
          <ul>
            <li><a href="/dashboard" className="block py-2">Dashboard</a></li>
            <li><a href="/appointments" className="block py-2">Appointments</a></li>
            <li><a href="/chat" className="block py-2">Chat</a></li>
            <li><a href="/analytics" className="block py-2">Analytics</a></li>
          </ul>
        </nav>
        {/* Main Content */}
        <div className="w-3/4 p-4">
          <header className="mb-4">
            <h1 className="text-2xl font-bold">Welcome, {patient.first_name}</h1>
          </header>
          <section className="mb-4">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <div className="grid grid-cols-1 gap-4">
              {appointments.map(appointment => (
                <div key={appointment.id} className="p-4 bg-white shadow rounded">
                  <h3 className="text-lg font-bold">{appointment.title}</h3>
                  <p>{appointment.date}</p>
                  <p>{appointment.time}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-4">
            <h2 className="text-xl font-semibold">Find Health-Care Providers Near You</h2>
            <div id="map" className="h-64 w-full bg-gray-200"></div>
          </section>
          <section className="mb-4">
            <h2 className="text-xl font-semibold">AI Health Tools</h2>
            <button className="btn btn-primary" onClick={checkSymptoms}>Check Symptoms</button>
            <button className="btn btn-primary" onClick={determineTriage}>Determine Triage</button>
            <button className="btn btn-primary" onClick={predictTrends}>Predict Trends</button>
            <div id="aiResults" className="mt-4"></div>
          </section>
          <section className="mb-4">
            <h2 className="text-xl font-semibold">Real-Time IoT Data</h2>
            <button className="btn btn-primary" onClick={fetchData}>Show IoT Data</button>
            <canvas id="iotDataChart" className="mt-4"></canvas>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;