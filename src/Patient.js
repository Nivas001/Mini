import React, { useState } from "react";
import "./Patient.css";

const patients = [
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
        blood_transfusion_date: "",
    },

    {
        time: "11:00",
        name: "Ahmed",
        age: 22,
        problem: "Bad Breath",
        gender: "Male",
        patientId: 2,
        dob: "01 August 2002",
        extra_illness: false,
        on_medication: true,
        blood_transfusion: false,
        allergy: "Ice",
    },
    {
        time: "11:30",
        name: "Krishna",
        age: 28,
        problem: "Jaw Pain",
        gender: "Male",
        patientId: 3,
        dob: "28 July 1996",
        extra_illness: false,
        on_medication: false,
        blood_transfusion: true,
        allergy: "None",
        blood_transfusion_date: "02/09/2024",
    },
    {
        time: "12:00",
        name: "Radha",
        age: 26,
        problem: "Sensitivity when biting",
        gender: "Female",
        patientId: 4,
        dob: "25 September 1997",
        extra_illness: true,
        on_medication: true,
        blood_transfusion: false,
        allergy: "None",
    },
    {
        time: "12:30",
        name: "Shahjahan",
        age: 24,
        problem: "Grinding teeth",
        gender: "Male",
        patientId: 5,
        dob: "15 February 2000",
        extra_illness: true,
        on_medication: false,
        blood_transfusion: true,
        allergy: "None",
    },
    {
        time: "5:00",
        name: "Mumtaz",
        age: 27,
        problem: "Periodontal problem",
        gender: "Female",
        patientId: 6,
        dob: "22 December 1996",
        extra_illness: true,
        on_medication: true,
        blood_transfusion: false,
        allergy: "None",
    },
    {
        time: "5:30",
        name: "Arjith Singh",
        age: 37,
        problem: "Sores",
        gender: "Male",
        patientId: 7,
        dob: "25 May 1986",
        extra_illness: false,
        on_medication: false,
        blood_transfusion: true,
        allergy: "None",
    },
    {
        time: "6:00",
        name: "Harini",
        age: 21,
        problem: "Gum/Tooth Pain",
        gender: "Female",
        patientId: 8,
        dob: "31 January 2003",
        extra_illness: false,
        on_medication: false,
        blood_transfusion: false,
        allergy: "None",
    },
    {
        time: "6:30",
        name: "Hema",
        age: 22,
        problem: "Food collection between teeth",
        gender: "Female",
        patientId: 9,
        dob: "28 February 2002",
        extra_illness: true,
        on_medication: false,
        blood_transfusion: true,
        allergy: "None",
    },
];

const yesterdayPatients = [
    {
        time: "10:30",
        name: "Wafiq",
        age: 25,
        problem: "Tooth Extraction",
        gender: "Male",
        patientId: 10,
        dob: "05 May 1999",
        extra_illness: false,
        on_medication: true,
        blood_transfusion: false,
        allergy: "None",
    },

    {
        time: "11:30",
        name: "Raj",
        age: 28,
        problem: "Gum Disease",
        gender: "Male",
        patientId: 12,
        dob: "1 June 1996",
        extra_illness: true,
        on_medication: false,
        blood_transfusion: false,
        allergy: "latex",
    },

    // Add more patients here
];


const PatientCard = ({ patient, isExpanded, onClick, onEditSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editablePatient, setEditablePatient] = useState({ ...patient });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditablePatient({ ...patient }); // Reset to original data on toggle
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditablePatient({ ...editablePatient, [name]: value });
    };

    // Reset edit mode when Back is clicked
    const handleBackClick = () => {
        setIsEditing(false); // Ensure edit mode is exited
        onClick(); // Trigger the parent function to collapse the card
    };

    const handleSave = () => {
        onEditSave(editablePatient); // Save changes
        setIsEditing(false); // Exit editing mode
    };

    return (
        <div className={`card ${isExpanded ? "expanded" : ""}`}>
            <div className="time">{patient.time}</div>

            <table>
                <tbody>
                <tr>
                    <td>Name</td>
                    <td>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editablePatient.name}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        ) : (
                            patient.name
                        )}
                    </td>
                </tr>
                <tr>
                    <td>Age</td>
                    <td>
                        {isEditing ? (
                            <input
                                type="number"
                                name="age"
                                value={editablePatient.age}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        ) : (
                            patient.age
                        )}
                    </td>
                </tr>
                <tr>
                    <td>Problem</td>
                    <td>
                        {isEditing ? (
                            <input
                                type="text"
                                name="problem"
                                value={editablePatient.problem}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        ) : (
                            patient.problem
                        )}
                    </td>
                </tr>
                {isExpanded && (
                    <>
                        <tr>
                            <td>Gender</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="gender"
                                        value={editablePatient.gender}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                ) : (
                                    patient.gender
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Patient Id</td>
                            <td>{patient.patientId}</td>
                        </tr>
                        <tr>
                            <td>DOB</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="dob"
                                        value={editablePatient.dob}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                ) : (
                                    patient.dob
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Extra Illness</td>
                            <td>
                                {isEditing ? (
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
                                ) : editablePatient.extra_illness ? (
                                    "Yes"
                                ) : (
                                    "No"
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>On Medication</td>
                            <td>
                                {isEditing ? (
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
                                ) : editablePatient.on_medication ? (
                                    "Yes"
                                ) : (
                                    "No"
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Blood Transfusion</td>
                            <td>
                                {isEditing ? (
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
                                ) : editablePatient.blood_transfusion ? (
                                    "Yes"
                                ) : (
                                    "No"
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Allergy</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="allergy"
                                        value={editablePatient.allergy}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                ) : (
                                    patient.allergy
                                )}
                            </td>
                        </tr>
                    </>
                )}
                </tbody>
            </table>
            <div className="button-container">
                {/* Use handleBackClick instead of onClick to reset edit mode */}
                <button className="button" onClick={handleBackClick}>
                    {isExpanded ? "Back" : "Details"}
                </button>
                {/* Show Edit and Save/Cancel buttons only when the card is expanded */}
                {isExpanded && (
                    <>
                        <button
                            className="button ms-2"
                            onClick={isEditing ? handleSave : handleEditToggle}
                        >
                            {isEditing ? "Save" : "Edit"}
                        </button>
                        {isEditing && (
                            <button className="button ms-2" onClick={handleEditToggle}>
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
    const [selectedDate, setSelectedDate] = useState("today");
    const [expandedCard, setExpandedCard] = useState(null);
    const [patientList, setPatientList] = useState(patients);

    const handleExpandCard = (patientId) => {
        setExpandedCard(patientId === expandedCard ? null : patientId);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setExpandedCard(null); // Collapse all cards when changing filter
    };

    const getFilteredPatients = () => {
        return patientList.filter(patient => selectedDate === "today"); // Add conditions for yesterday if needed
    };

    const handleEditSave = (updatedPatient) => {
        const updatedList = patientList.map((patient) =>
            patient.patientId === updatedPatient.patientId ? updatedPatient : patient
        );
        setPatientList(updatedList);
    };

    const filteredPatients = getFilteredPatients();

    return (
        <div className="app">
            <div className="heading">
                <h2 id="patientLabel">
                    {selectedDate === "yesterday" ? "Consultant" : "Today's Patient list"}
                </h2>
            </div>
            <div className="filter">
                <select
                    id="dateFilter"
                    className="patient-filter"
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    <option value="today">Patient</option>
                    <option value="yesterday">Consultant</option>
                </select>
            </div>
            <div className="card-container">
                {filteredPatients.map((patient) =>
                    expandedCard === null || expandedCard === patient.patientId ? (
                        <PatientCard
                            key={patient.patientId}
                            patient={patient}
                            isExpanded={expandedCard === patient.patientId}
                            onClick={() => handleExpandCard(patient.patientId)}
                            onEditSave={handleEditSave}
                        />
                    ) : null
                )}
            </div>
        </div>
    );
}

export default Patient;
