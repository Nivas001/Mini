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

        fetchFuturePatients();
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
        <div className={'entire_page'}>
            <h2>Future Patient Appointments</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Problem</th>
                </tr>
                </thead>
                <tbody>
                {futurePatients.length > 0 ? (
                    futurePatients.map((patient, index) => (
                        <tr key={index}>
                            <td>{patient.date}</td>
                            <td>{patient.slot_start_time}</td>
                            <td>{patient.patient_name}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.reason_for_visit}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{textAlign: "center"}}>No future appointments found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewFuturePatients;
