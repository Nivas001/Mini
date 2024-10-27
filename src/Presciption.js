import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jsPDF} from 'jspdf';
import './Prescription.css';

const PrescriptionForm = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: '',
        medicines: [{name: '', timeOfDay: '', dosage: ''}],
        description: '',
        adviceToLab: '',
        paymentAmount: '',
        paymentStatus: '',
        followUpDate: '',
    });

    // Handle input change for patient details and description
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    // Handle medicine change for name, time of day, and dosage
    const handleMedicineChange = (index, event) => {
        const {name, value} = event.target;
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index][name] = value;
        setFormData({...formData, medicines: updatedMedicines});
    };

    // Add another medicine field
    const addMedicine = () => {
        setFormData({...formData, medicines: [...formData.medicines, {name: '', timeOfDay: '', dosage: ''}]});
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Prescription Details Submitted!");
        // You can add API or database logic here to save the form data
    };

    // Generate PDF
    const handlePrint = () => {
        const doc = new jsPDF();

        // Add prescription details to PDF
        doc.setFont('Inter');
        doc.setFontSize(16);
        doc.text('Patient Prescription Details', 10, 10);

        // Add patient name and phone number
        doc.setFontSize(12);
        doc.text(`Patient Name: ${formData.patientName}`, 10, 20);
        doc.text(`Phone Number: ${formData.phoneNumber}`, 10, 30);

        // Add medicines, timings, and dosage
        doc.text('Medicines:', 10, 40);
        formData.medicines.forEach((medicine, index) => {
            doc.text(`${index + 1}. ${medicine.name} - ${medicine.timeOfDay} - ${medicine.dosage}`, 10, 50 + (index * 10));
        });

        // Add description and follow-up date
        doc.text(`Description: ${formData.description}`, 10, 70 + (formData.medicines.length * 10));
        if (formData.followUpDate) {
            doc.text(`Follow-Up Date: ${formData.followUpDate}`, 10, 80 + (formData.medicines.length * 10));
        }

        // Add lab advice if any
        if (formData.adviceToLab) {
            doc.text(`Advice to Lab: ${formData.adviceToLab}`, 10, 90 + (formData.medicines.length * 10));
        }

        // Add payment details
        doc.text(`Payment Amount: ₹${formData.paymentAmount}`, 10, 100 + (formData.medicines.length * 10));
        doc.text(`Payment Status: ${formData.paymentStatus}`, 10, 110 + (formData.medicines.length * 10));

        // Save the PDF
        doc.save('Patient_Prescription.pdf');
    };

    return (
        <div className="container mt-5" style={{fontFamily: 'Inter, sans-serif', color: '#333'}}>
            <h2 className="text-center" style={{color: '#03c0c1', marginBottom: '30px'}}>
                Patient Prescription Details
            </h2>

            <form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{borderColor: '#03c0c1'}}>
                {/* Patient Name and Phone Number in the same row */}
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
                            style={{borderColor: '#03c0c1'}}
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
                            style={{borderColor: '#03c0c1'}}
                        />
                    </div>
                </div>

                {/* Medicines, Timing Selector, and Dosage */}
                <div className="mb-3">
                    <label className="form-label">Medicines, Timings, and Dosage</label>
                    {formData.medicines.map((medicine, index) => (
                        <div key={index} className="mb-3 d-flex">
                            <input
                                type="text"
                                name="name"
                                className="form-control me-2"
                                placeholder="Medicine name"
                                value={medicine.name}
                                onChange={(e) => handleMedicineChange(index, e)}
                                required
                                style={{borderColor: '#03c0c1'}}
                            />
                            <select
                                name="timeOfDay"
                                className="form-control me-2"
                                value={medicine.timeOfDay}
                                onChange={(e) => handleMedicineChange(index, e)}
                                required
                                style={{borderColor: '#03c0c1'}}
                            >
                                <option value="">Select time</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Night">Night</option>
                            </select>
                            <select
                                name="dosage"
                                className="form-control"
                                value={medicine.dosage}
                                onChange={(e) => handleMedicineChange(index, e)}
                                required
                                style={{borderColor: '#03c0c1'}}
                            >
                                <option value="">Select dosage</option>
                                {[...Array(9)].map((_, i) => (
                                    <option key={i} value={`${(i + 1) * 100}mg`}>
                                        {(i + 1) * 100}mg
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary" onClick={addMedicine}>
                        Add Another Medicine
                    </button>
                </div>

                {/* Description Field */}
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
                        style={{borderColor: '#03c0c1'}}
                    ></textarea>
                </div>

                {/* Advice to Lab (Optional) */}
                <div className="mb-3">
                    <label htmlFor="adviceToLab" className="form-label">Advice to Lab Staff (Optional)</label>
                    <textarea
                        id="adviceToLab"
                        name="adviceToLab"
                        className="form-control"
                        rows="3"
                        placeholder="Any advice for lab staff"
                        value={formData.adviceToLab}
                        onChange={handleInputChange}
                        style={{borderColor: '#03c0c1'}}
                    ></textarea>
                </div>

                {/* Payment Section */}
                <div className="row mb-3">
                    <div className="col-md-6">
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
                            style={{borderColor: '#03c0c1'}}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
                        <select
                            id="paymentStatus"
                            name="paymentStatus"
                            className="form-control"
                            value={formData.paymentStatus}
                            onChange={handleInputChange}
                            required
                            style={{borderColor: '#03c0c1'}}
                        >
                            <option value="">Select status</option>
                            <option value="Paid">Paid</option>
                            <option value="Not Paid">Not Paid</option>
                        </select>
                    </div>
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
}

export default PrescriptionForm;