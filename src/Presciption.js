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
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleMedicineChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        const updatedMedicines = [...formData.medicines];

        if (name === 'timeOfDay') {
            const time = event.target.getAttribute('data-time');
            updatedMedicines[index].timeOfDay[time] = checked;
            if (!checked) updatedMedicines[index].foodTiming[time] = ''; // Clear food option if unchecked
        } else if (name === 'foodTiming') {
            const time = event.target.getAttribute('data-time');
            updatedMedicines[index].foodTiming[time] = value;
        } else {
            updatedMedicines[index][name] = value;
        }
        setFormData({ ...formData, medicines: updatedMedicines });
    };

    const addMedicine = () => {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { name: '', dosage: '', timeOfDay: { morning: false, afternoon: false, night: false }, foodTiming: { morning: '', afternoon: '', night: '' } }],
        });
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
                    <label className="form-label">Medicines, Timings, and Dosage</label>
                    {formData.medicines.map((medicine, index) => (
                        <div key={index} className="mb-3 p-2 rounded" style={{ border: '1px solid #03c0c1', backgroundColor: '#e9f8f9' }}>
                            <div className="row align-items-center">
                                <div className="col-md-2">
                                    <select
                                        name="type"
                                        className="form-select"
                                        value={medicine.type}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        required
                                        style={{ borderColor: '#03c0c1' }}
                                    >
                                        <option value="tablet">Tablet</option>
                                        <option value="capsule">Capsule</option>
                                        <option value="syrup">Syrup</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Medicine name"
                                        value={medicine.name}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        required
                                        style={{ borderColor: '#03c0c1' }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="dosage"
                                        className="form-control"
                                        placeholder="Dosage (e.g., 500mg)"
                                        value={medicine.dosage}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        required
                                        style={{ borderColor: '#03c0c1' }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="number"
                                        name="days"
                                        className="form-control"
                                        placeholder="Days"
                                        value={medicine.days}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        required
                                        style={{ borderColor: '#03c0c1' }}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                {['morning', 'afternoon', 'night'].map((time) => (
                                    <div className="col-md-4" key={time}>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`${time}-${index}`}
                                                name="timeOfDay"
                                                data-time={time}
                                                checked={medicine.timeOfDay[time]}
                                                onChange={(e) => handleMedicineChange(index, e)}
                                            />
                                            <label className="form-check-label" htmlFor={`${time}-${index}`}>
                                                {time.charAt(0).toUpperCase() + time.slice(1)}
                                            </label>
                                            {medicine.timeOfDay[time] && (
                                                <select
                                                    name="foodTiming"
                                                    data-time={time}
                                                    className="form-select mt-1"
                                                    value={medicine.foodTiming[time]}
                                                    onChange={(e) => handleMedicineChange(index, e)}
                                                    required
                                                >
                                                    <option value="before">Before Food</option>
                                                    <option value="after">After Food</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary" onClick={addMedicine}>
                        Add Another Medicine
                    </button>
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
