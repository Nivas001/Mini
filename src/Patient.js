import React, { useState } from "react";
import { FaVenusMars, FaPills, FaTint } from "react-icons/fa";
import "./Patient.css";

const todayPatients = [
    {
        time: "10:30",
        name: "Abdul",
        age: 25,
        problem: "Bleeding gums",
        gender: "Male",
        patientId: 1,
        dob: "05 May 1999",
        extra_illness: false,
        on_medication: true,
        blood_transfusion: false,
        allergy: "None",
    },
    // Add more patients here
];

const PatientCard = ({ patient, isExpanded, onClick, onEditSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editablePatient, setEditablePatient] = useState({ ...patient });
    const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditablePatient({ ...patient });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditablePatient({ ...editablePatient, [name]: value });
    };

    const handleSave = () => {
        onEditSave(editablePatient);
        setIsEditing(false);
    };

    const toggleAdditionalDetails = () => {
        setShowAdditionalDetails(!showAdditionalDetails);
    };

    return (
        <div className={`card ${isExpanded ? "expanded" : ""}`}>
            <div className="card-header">
                <span className="patient-time">{patient.time}</span>
                <h3 className="patient-name">{patient.name}</h3>
            </div>

            <div className="card-body">
                <div className="info-section">
                    <div className="info-column">
                        <p><strong>Age:</strong> {isEditing ? (
                            <input
                                type="number"
                                name="age"
                                value={editablePatient.age}
                                onChange={handleInputChange}
                            />
                        ) : (
                            patient.age
                        )}</p>
                        <p><strong>Gender:</strong> <FaVenusMars className="icon"/> {patient.gender}</p>
                        <p><strong>Problem:</strong> {isEditing ? (
                            <input
                                type="text"
                                name="problem"
                                value={editablePatient.problem}
                                onChange={handleInputChange}
                            />
                        ) : (
                            patient.problem
                        )}</p>
                    </div>

                    <div className="info-column">
                        <p><strong>DOB:</strong> {patient.dob}</p>
                        <p><strong>Allergy:</strong> {isEditing ? (
                            <input
                                type="text"
                                name="allergy"
                                value={editablePatient.allergy}
                                onChange={handleInputChange}
                            />
                        ) : (
                            patient.allergy
                        )}</p>
                    </div>
                </div>

                <div className="grid-section">
                    <div>
                        <FaPills className="icon" /> On Medication:{" "}
                        <input
                            type="checkbox"
                            name="on_medication"
                            checked={editablePatient.on_medication}
                            onChange={(e) =>
                                setEditablePatient({
                                    ...editablePatient,
                                    on_medication: e.target.checked,
                                })
                            }
                        />
                    </div>
                    <div>
                        <FaTint className="icon" /> Blood Transfusion:{" "}
                        <input
                            type="checkbox"
                            name="blood_transfusion"
                            checked={editablePatient.blood_transfusion}
                            onChange={(e) =>
                                setEditablePatient({
                                    ...editablePatient,
                                    blood_transfusion: e.target.checked,
                                })
                            }
                        />
                    </div>
                    <div>
                        Extra Illness:{" "}
                        <input
                            type="checkbox"
                            name="extra_illness"
                            checked={editablePatient.extra_illness}
                            onChange={(e) =>
                                setEditablePatient({
                                    ...editablePatient,
                                    extra_illness: e.target.checked,
                                })
                            }
                        />
                    </div>
                </div>

                {showAdditionalDetails && (
                    <div className="additional-details">
                        <h4>Additional Medical Details</h4>
                        <p><strong>Patient ID:</strong> {patient.patientId}</p>
                        <p><strong>More Info:</strong> Extra details go here</p>
                    </div>
                )}

                <button
                    className="expand-button"
                    onClick={toggleAdditionalDetails}
                >
                    {showAdditionalDetails ? "Hide Additional Details" : "Show Additional Details"}
                </button>
            </div>

            <div className="button-container">
                <button className="button back-button" onClick={onClick}>
                    {isExpanded ? "Back" : "Details"}
                </button>
                {isExpanded && (
                    <>
                        <button
                            className="button edit-button"
                            onClick={isEditing ? handleSave : handleEditToggle}
                        >
                            {isEditing ? "Save" : "Edit"}
                        </button>
                        {isEditing && (
                            <button
                                className="button cancel-button"
                                onClick={handleEditToggle}
                            >
                                Cancel
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

    const handleExpandCard = (patientId) => {
        setExpandedCard(patientId === expandedCard ? null : patientId);
    };

    return (
        <div className="patient-list">
            {todayPatients.map((patient) => (
                <PatientCard
                    key={patient.patientId}
                    patient={patient}
                    isExpanded={expandedCard === patient.patientId}
                    onClick={() => handleExpandCard(patient.patientId)}
                    onEditSave={(updatedPatient) => console.log("Patient updated:", updatedPatient)}
                />
            ))}
        </div>
    );
}

export default Patient;
