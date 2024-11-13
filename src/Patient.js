import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import "./Patient.css";

const appointmentsRef = collection(db, "Patient Appointments");

const getTodayFormatted = () => {
    const today = new Date();
    return `${today.getFullYear()}_${(today.getMonth() + 1).toString().padStart(2, '0')}_${today.getDate().toString().padStart(2, '0')}`;
};

const PatientCard = ({ patient, isExpanded, onClick, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState({ ...patient });

    const handleChange = (field, value) => {
        setEditedPatient({ ...editedPatient, [field]: value });
    };

    const handleSave = async () => {
        try {
            const patientDoc = doc(db, "Patient Appointments", patient.id);
            await updateDoc(patientDoc, editedPatient);
            onEdit(); // Refresh the list to show the updated data
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating patient details:", error);
        }
    };

    const handleBack = () => {
        if (isEditing) {
            handleSave(); // Save automatically when going back
        }
        setIsEditing(false);
        onClick(patient.appointment_id);
    };

    return (
        <div className={`card ${isExpanded ? "expanded" : ""}`}>
            {!isExpanded && <div className="time">{patient.slot_start_time}</div>}
            {isExpanded && (
                <div className="header">
                    <input
                        type="text"
                        className="patient-name"
                        value={editedPatient.patient_name}
                        onChange={(e) => handleChange("patient_name", e.target.value)}
                        style={{ color: "gray" }}
                    />
                    <span className="appointment-time">{patient.slot_start_time}</span>
                </div>
            )}
            <table>
                <tbody>
                {!isExpanded && (
                    <tr>
                        <td>Name</td>
                        <td>{patient.patient_name}</td>
                    </tr>
                )}
                <tr>
                    <td>Gender</td>
                    <td>
                        {isEditing ? (
                            <select
                                value={editedPatient.gender}
                                onChange={(e) => handleChange("gender", e.target.value)}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        ) : (
                            patient.gender
                        )}
                    </td>
                </tr>
                <tr>
                    <td>Reason for Visit</td>
                    <td>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedPatient.reason_for_visit}
                                onChange={(e) => handleChange("reason_for_visit", e.target.value)}
                            />
                        ) : (
                            patient.reason_for_visit
                        )}
                    </td>
                </tr>
                {isExpanded && (
                    <>
                        <tr>
                            <td>Is Nursing</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        checked={editedPatient.is_nursing}
                                        onChange={(e) => handleChange("is_nursing", e.target.checked)}
                                    />
                                ) : (
                                    patient.is_nursing ? "Yes" : "No"
                                )}
                            </td>
                        </tr>
                        {editedPatient.gender !== "male" && (
                            <tr>
                                <td>Is Pregnant</td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="checkbox"
                                            checked={editedPatient.is_pregnant}
                                            onChange={(e) => handleChange("is_pregnant", e.target.checked)}
                                        />
                                    ) : (
                                        patient.is_pregnant ? "Yes" : "No"
                                    )}
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td>Taking Birth Control Pills</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        checked={editedPatient.is_taking_birth_control_pills}
                                        onChange={(e) => handleChange("is_taking_birth_control_pills", e.target.checked)}
                                    />
                                ) : (
                                    patient.is_taking_birth_control_pills ? "Yes" : "No"
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Dental History</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedPatient.patient_dental_history.join(", ")}
                                        onChange={(e) => handleChange("patient_dental_history", e.target.value.split(", "))}
                                    />
                                ) : (
                                    patient.patient_dental_history.join(", ")
                                )}
                            </td>
                        </tr>
                    </>
                )}
                </tbody>
            </table>
            <div className="button-container">
                <button className="button" onClick={handleBack}>
                    {isExpanded ? "Back" : "Details"}
                </button>
                {isExpanded && (
                    <>
                        <button className="button" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                        {isEditing && (
                            <button className="button" onClick={handleSave}>
                                Save
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

function Patient() {
    const [expandedCard, setExpandedCard] = useState(null);
    const [patientList, setPatientList] = useState([]);

    const fetchPatients = async () => {
        try {
            const todayDateFormatted = getTodayFormatted();
            const querySnapshot = await getDocs(appointmentsRef);
            const patientsData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter((patient) => patient.appointment_date === todayDateFormatted);

            setPatientList(patientsData);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleExpandCard = (appointmentId) => {
        setExpandedCard(appointmentId === expandedCard ? null : appointmentId);
    };

    return (
        <div className="app">
            <div className="heading">
                <h2 id="patientLabel">Today's Patient Appointments</h2>
            </div>
            <div className="card-container">
                {patientList.map((patient) =>
                    <PatientCard
                        key={patient.appointment_id}
                        patient={patient}
                        isExpanded={expandedCard === patient.appointment_id}
                        onClick={handleExpandCard}
                        onEdit={fetchPatients} // Refreshes the list after saving edits
                    />
                )}
            </div>
        </div>
    );
}

export default Patient;
