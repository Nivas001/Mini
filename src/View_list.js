import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from './firebase';

const ViewFuturePatients = () => {
    const [futurePatients, setFuturePatients] = useState([]);

    useEffect(() => {
        const fetchFuturePatients = async () => {
            try {
                const today = new Date();
                const todayFormatted = today.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

                const appointmentsRef = collection(db, "Patient Appointments");
                const q = query(appointmentsRef, where("appointment_date", ">=", todayFormatted), orderBy("appointment_date"));

                const querySnapshot = await getDocs(q);

                const patientsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        slot_start_time: data.slot_start_time,
                        date: formatDate(data.appointment_date),
                        patient_name: data.patient_name,
                        gender: data.gender,
                        reason_for_visit: data.reason_for_visit
                    };
                });

                setFuturePatients(patientsList);
            } catch (error) {
                console.error("Error fetching future patients:", error);
            }
        };

        fetchFuturePatients().then(r => console.log("Future patients fetched"));
    }, []);

    // Function to format the date as 'DD/MM/YYYY'
    const formatDate = (dateString) => {
        // Check if dateString is in 'YYYY_MM_DD' format
        const [year, month, day] = dateString.split('_'); // Split by underscore
        if (year && month && day) {
            return `${day}/${month}/${year}`; // Return in 'DD/MM/YYYY' format
        }
        return "Invalid Date"; // Fallback if format is unexpected
    };

    return (
        <div className="entire_page">
            <h2 style={{ textAlign: "center", margin: "20px 0" }}>Future Patient Appointments</h2>
            <table className="table" style={{ width: "80%", margin: "0 auto", borderCollapse: "collapse", textAlign: "left" }}>
                <thead style={{ backgroundColor: "#f5f5f5", height: "4em", borderBottom: "2px solid #ccc" }}>
                <tr>
                    <th style={{padding: "10px"}}>Date</th>
                    <th style={{padding: "10px"}}>Slot</th>
                    <th style={{padding: "10px"}}>Name</th>
                    <th style={{padding: "10px"}}>Gender</th>
                    <th style={{padding: "10px"}}>Problem</th>
                    <th style={{padding: "10px"}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {futurePatients.length > 0 ? (
                    futurePatients.map((patient, index) => (
                        <tr key={index} style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "10px", textAlign: "left", width: "10%", border: "1px solid #ccc" }}>{patient.date}</td>
                            <td style={{ padding: "10px", width: "10%", border: "1px solid #ccc" }}>{patient.slot_start_time}</td>
                            <td style={{ padding: "10px", width: "20%", border: "1px solid #ccc" }}>{patient.patient_name}</td>
                            <td style={{ padding: "10px", width: "5%", border: "1px solid #ccc" }}>{patient.gender}</td>
                            <td style={{ padding: "10px", width: "40%", border: "1px solid #ccc" }}>{patient.reason_for_visit}</td>
                            <td style={{ padding: "10px", width: "15%", border: "1px solid #ccc" }}></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No future appointments found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewFuturePatients;
