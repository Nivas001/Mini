import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import './Prescription.css';

const PrescriptionForm = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: '',
        medicines: [
            { type: '', name: '', dosage: '', days: '', timeOfDay: { morning: false, afternoon: false, night: false }, foodTiming: { morning: '', afternoon: '', night: '' } }
        ],
        description: '',
        adviceToLab: '',
        paymentAmount: '',
        followUpDate: '',
        isBooked: false,
        additionalProblems: [], // Initialize additionalProblems as an empty array
        chiefComplaint: '',
        onExamination: '',
        treatmentPlan: '',
        consent: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const addProblem = () => {
        setFormData((prevData) => ({
            ...prevData,
            additionalProblems: [...prevData.additionalProblems, ''],
        }));
    };

    const handleAdditionalProblemChange = (event, index) => {
        const { value } = event.target;
        const updatedProblems = [...formData.additionalProblems];
        updatedProblems[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            additionalProblems: updatedProblems,
        }));
    };

    // Medicine change handler function
    const handleMedicineChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index][name] = value;


        // If syrup type is selected, set default time to after food
        if (name === 'type' && value === 'syrup') {
            //updatedMedicines[index].food = 'after';
            //updatedMedicines[index].time = ['morning', 'evening', 'night']; // Default to morning and evening
            updatedMedicines[index].days = 3;
        }

        if (name === 'name' && value === 'Augmentin') {
            updatedMedicines[index].dosage = '625 mg';
        }

        if (name === 'name' && value === 'Taxim O') {
            updatedMedicines[index].dosage = '200 mg';
        }

        if (name === 'name' && value === 'Pan') {
            updatedMedicines[index].dosage = '40 mg';
            updatedMedicines[index].food = 'before';
        }

        if (name === 'name' && value === 'Dolo') {
            updatedMedicines[index].dosage = '650 mg';
        }

        if (name === 'name' && value === 'P') {
            updatedMedicines[index].dosage = '125 mg';
        }

        setFormData({ ...formData, medicines: updatedMedicines });
    };


    const addMedicine = () => {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { name: '', dosage: '', timeOfDay: { morning: false, afternoon: false, night: false }, foodTiming: { morning: '', afternoon: '', night: '' } }],
        });
    };

    const getMedicineOptions = (type) => {
        if (type === 'tablet') {
            return ['Pan', 'Zerodol SP', 'Divon Plus', 'Tolpa D', 'Chymoral Forte', 'Ketorol DT', 'Amoxicillin', 'Taxim O', 'Augmentin', 'Metrogyl', 'Imol', 'Dolo', 'P'];
        } else if (type === 'syrup') {
            return ['Calvum Bid Dry Syrup', 'Clavum Dry Syrup', 'Ibugesic Plus' ,'Ibugesic Kid'];
        }
        return [];
    };

    const handleTimeCheckboxChange = (index, time, event) => {
        const updatedMedicines = [...formData.medicines];
        if (event.target.checked) {
            updatedMedicines[index].time = [...(updatedMedicines[index].time || []), time];
        } else {
            updatedMedicines[index].time = updatedMedicines[index].time.filter((t) => t !== time);
        }
        setFormData({ ...formData, medicines: updatedMedicines });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Prescription Details Submitted!");
    };

    const handlePrint = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Patient Prescription Details', 10, 10);
        doc.setFontSize(12);
        doc.text(`Patient Name: ${formData.patientName}`, 10, 20);
        doc.text(`Phone Number: ${formData.phoneNumber}`, 10, 30);

        doc.text('Medicines:', 10, 40);
        formData.medicines.forEach((medicine, index) => {
            doc.text(`${index + 1}. ${medicine.name} - Dosage: ${medicine.dosage}`, 10, 50 + (index * 20));
            ['morning', 'afternoon', 'night'].forEach((time) => {
                if (medicine.timeOfDay[time]) {
                    doc.text(
                        `${time.charAt(0).toUpperCase() + time.slice(1)} - ${medicine.foodTiming[time]}`,
                        10,
                        60 + (index * 20)
                    );
                }
            });
        });

        doc.text(`Description: ${formData.description}`, 10, 70 + (formData.medicines.length * 20));
        if (formData.followUpDate) {
            doc.text(`Follow-Up Date: ${formData.followUpDate}`, 10, 80 + (formData.medicines.length * 20));
        }
        if (formData.adviceToLab) {
            doc.text(`Advice to Lab: ${formData.adviceToLab}`, 10, 90 + (formData.medicines.length * 20));
        }
        doc.text(`Payment Amount: ₹${formData.paymentAmount}`, 10, 100 + (formData.medicines.length * 20));

        doc.save('Patient_Prescription.pdf');
    };

    return (
        <div className="container mt-5" style={{ fontFamily: 'Inter, sans-serif', color: '#333' }}>
            <h2 className="text-center" style={{ color: '#03c0c1', marginBottom: '30px' }}>
                Patient Prescription Details
            </h2>

            <form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{ borderColor: '#03c0c1' }}>

                {/* Personal Details */}
                <div className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4>Personal Details</h4>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="patientName" className="form-label">Patient Name</label>
                            <input
                                type="text"
                                id="patientName"
                                name="patientName"
                                className="form-control"
                                placeholder="Enter patient name"
                                value={formData.patientName}
                                onChange={handleInputChange}
                                required
                                style={{ borderColor: '#03c0c1' }}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                className="form-control"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                                style={{ borderColor: '#03c0c1' }}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            rows="3"
                            placeholder="Additional patient details or symptoms"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            style={{ borderColor: '#03c0c1' }}
                        ></textarea>
                    </div>
                </div>

                {/* Medicine Details */}
                <div className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4>Medicine Details</h4>
                    {formData.medicines.map((medicine, index) => (
                        <div key={index} className="mb-3 p-2 rounded d-flex align-items-center" style={{ border: '1px solid #03c0c1', backgroundColor: '#e9f8f9' }}>
                            {/* Type Selection */}
                            <div className="me-2">
                                <label className="form-label mb-1">Type</label>
                                <select
                                    name="type"
                                    className="form-select"
                                    value={medicine.type || "tablet"}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    required
                                    style={{ borderColor: '#03c0c1', width: '100px' }}
                                >
                                    <option value="tablet">Tablet</option>
                                    <option value="syrup">Syrup</option>
                                </select>
                            </div>

                            {/* Name Selection */}
                            <div className="me-3">
                                <label className="form-label mb-1">Name</label>
                                <select
                                    name="name"
                                    className="form-select"
                                    value={medicine.name}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    required
                                    style={{ borderColor: '#03c0c1', width: '150px' }}
                                >
                                    {getMedicineOptions(medicine.type || "tablet").map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Custom Name Input */}
                            {medicine.name === 'Other' && (
                                <div className="me-2">
                                    <label className="form-label mb-1">Custom Name</label>
                                    <input
                                        type="text"
                                        name="customName"
                                        className="form-control"
                                        placeholder="Enter Medicine name"
                                        value={medicine.customName}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        required
                                        style={{ borderColor: '#03c0c1', width: '185px' }}
                                    />
                                </div>
                            )}

                            {/* Dosage Input */}
                            <div className="me-2">
                                <label className="form-label mb-1">Dosage</label>
                                <input
                                    type="text"
                                    name="dosage"
                                    className="form-control"
                                    placeholder="500mg"
                                    value={medicine.dosage}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    required
                                    style={{ borderColor: '#03c0c1', width: '100px' }}
                                />
                            </div>

                            {/* Days Input */}
                            <div className="me-2">
                                <label className="form-label mb-1">Days</label>
                                <input
                                    type="number"
                                    name="days"
                                    className="form-control"
                                    placeholder="Count"
                                    value={medicine.days}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    required
                                    style={{ borderColor: '#03c0c1', width: '80px' }}
                                />
                            </div>

                            {/* Time of Day Selection (Checkboxes) */}
                            <div className="me-2">
                                <label className="form-label mb-1">Time</label>
                                <div className="d-flex flex-wrap">
                                    {["morning", "afternoon", "evening", "night"].map((time) => (
                                        <label key={time} className="form-check-label me-2" style={{ cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-1"
                                                name="time"
                                                value={time}
                                                checked={medicine.time?.includes(time)}
                                                onChange={(e) => handleTimeCheckboxChange(index, time, e)}
                                            />
                                            {time.charAt(0).toUpperCase() + time.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>


                            {/* Food Selection */}
                            <div className="me-2">
                                <label className="form-label mb-1">Food</label>
                                <select
                                    name="food"
                                    className="form-select"
                                    value={medicine.food}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    style={{borderColor: '#03c0c1', width: '150px'}}
                                >
                                    <option value="after">After Food</option>
                                    <option value="before">Before Food</option>
                                    <option value="both">Before and After Food</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    {/* Add Medicine Button */}
                    <div className="text-end mt-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-circle"
                            onClick={addMedicine}
                            style={{
                                backgroundColor: '#e0e0e0',
                                color: '#03c0c1',
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                fontSize: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>


                {/* Treatment Details */}
                <div className="mb-4 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <h4>Treatment Details</h4>
                    <div className="row mb-3">
                        {/* Chief Complaint */}
                        <div className="col-md-6">
                            <label htmlFor="chiefComplaint" className="form-label">Chief Complaint</label>
                            <textarea
                                id="chiefComplaint"
                                name="chiefComplaint"
                                className="form-control"
                                rows="3"
                                placeholder="Enter chief complaint"
                                value={formData.chiefComplaint}
                                onChange={handleInputChange}
                                style={{borderColor: '#03c0c1'}}
                            ></textarea>
                        </div>

                        {/* Proposed Treatment Plan */}
                        <div className="col-md-6">
                            <label htmlFor="treatmentPlan" className="form-label">Proposed Treatment Plan</label>
                            <textarea
                                id="treatmentPlan"
                                name="treatmentPlan"
                                className="form-control"
                                rows="3"
                                placeholder="Enter proposed treatment plan"
                                value={formData.treatmentPlan}
                                onChange={handleInputChange}
                                style={{borderColor: '#03c0c1'}}
                            ></textarea>
                        </div>
                    </div>

                    {/* On Examination */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="onExamination" className="form-label">On Examination</label>
                            <input
                                type="text"
                                id="onExamination"
                                name="onExamination"
                                className="form-control"
                                placeholder="Enter the problem"
                                value={formData.onExamination}
                                onChange={handleInputChange}
                                style={{borderColor: '#03c0c1'}}
                            />
                        </div>
                    </div>


                    {/* Additional Problems */}
                    <div className="row">
                        {formData.additionalProblems.map((problem, index) => (
                            <div key={index} className={`col-md-3 mb-3`}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter additional problem"
                                    value={problem}
                                    onChange={(e) => handleAdditionalProblemChange(e, index)}
                                    style={{borderColor: '#03c0c1'}}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Add Problem Button */}
                    <div className="mb-3">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={addProblem}
                            style={{backgroundColor: '#03c0c1'}}
                        >
                            Add Problem
                        </button>
                    </div>

                    {/* Patient Consent */}
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label className="form-label">Consent for Treatment</label>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="consentYes"
                                    name="consent"
                                    value="Yes"
                                    checked={formData.consent === 'Yes'}
                                    onChange={handleInputChange}
                                    className="form-check-input"
                                    style={{borderColor: '#03c0c1' }}
                                />
                                <label htmlFor="consentYes" className="form-check-label">
                                    Proceed with Treatment Plan
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="consentNo"
                                    name="consent"
                                    value="No"
                                    checked={formData.consent === 'No'}
                                    onChange={handleInputChange}
                                    className="form-check-input"
                                    style={{ borderColor: '#03c0c1' }}
                                />
                                <label htmlFor="consentNo" className="form-check-label">
                                    Do Not Proceed with Treatment Plan
                                </label>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Advice to Lab */}
                <div className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4>Advice to Lab Staff</h4>
                    <div className="mb-3">
                        <textarea
                            id="adviceToLab"
                            name="adviceToLab"
                            className="form-control"
                            rows="3"
                            placeholder="Any advice for lab staff"
                            value={formData.adviceToLab}
                            onChange={handleInputChange}
                            style={{ borderColor: '#03c0c1' }}
                        ></textarea>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4>Payment</h4>
                    <label htmlFor="paymentAmount" className="form-label">Payment Amount (₹)</label>
                    <input
                        type="number"
                        id="paymentAmount"
                        name="paymentAmount"
                        className="form-control"
                        placeholder="Enter amount"
                        value={formData.paymentAmount}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: '#03c0c1' }}
                    />
                </div>

                {/* Follow-Up Date */}
                <div className="mb-3">
                    <label htmlFor="followUpDate" className="form-label">Follow-Up Date (If needed)</label>
                    <input
                        type="date"
                        id="followUpDate"
                        name="followUpDate"
                        className="form-control"
                        value={formData.followUpDate}
                        onChange={handleInputChange}
                        style={{ borderColor: '#03c0c1' }}
                    />
                </div>

                {/* Conditional checkbox for booking on the follow-up date */}
                {formData.followUpDate && (
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            id="isBooked"
                            name="isBooked"
                            className="form-check-input"
                            checked={formData.isBooked}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="isBooked" className="form-check-label">
                            Patient wants to book an appointment on the follow-up date?
                        </label>
                    </div>
                )}

                {/* Submit and Print Buttons */}
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary me-2" style={{ backgroundColor: '#03c0c1', border: 'none' }}>
                        Submit Prescription
                    </button>
                    <button type="button" className="btn btn-success" onClick={handlePrint}>
                        Print Prescription
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrescriptionForm;
