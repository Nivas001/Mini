import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import './Prescription.css';

const PrescriptionForm = () => {
    //used to get id from patient list
    const { patientId, appointmentId } = useParams();
    const [patientName, setPatientName] = useState("");
    const [chiefComplaint, setChiefComplaint] = useState("");

    useEffect(() => {
        const fetchPatientName = async () => {
            try {
                const patientDocRef = doc(db, "Patients", patientId);
                const patientDoc = await getDoc(patientDocRef);

                if (patientDoc.exists()) {
                    setPatientName(patientDoc.data().patient_name || "");
                } else {
                    console.log("No such document in Patients collection!");
                }
            } catch (error) {
                console.error("Error fetching patient name:", error);
            }
        };

        const fetchChiefComplaint = async () => {
            try {
                const appointmentDocRef = doc(db, "Patient Appointments", appointmentId);
                const appointmentDoc = await getDoc(appointmentDocRef);

                if (appointmentDoc.exists()) {
                    setChiefComplaint(appointmentDoc.data().reason_for_visit || "");
                } else {
                    console.log("No such document in Patient Appointments collection!");
                }
            } catch (error) {
                console.error("Error fetching chief complaint:", error);
            }
        };

        if (patientId && appointmentId) {
            fetchPatientName();
            fetchChiefComplaint();
        }
    }, [patientId, appointmentId]);



    //used to store values in these variables
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: '',
        chiefComplaint: '',
        medicines: [
            { type: '', name: '', dosage: '', days: '', timeOfDay: { morning: false, afternoon: false, evening: false,night: false }, foodTiming: '' }
        ],
        adviceToLab: '',
        paymentAmount: '',
        followUpDate: '',
        isBooked: false,
        additionalProblems: [], // Initialize additionalProblems as an empty array
        onExamination: '',
        radiographReport: '',
        comments: '',
        treatmentPlan: '',
        consent: ''
    });

    const [errors, setErrors] = useState({}); // State for tracking validation errors

    // Function to handle input change
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

    // Function to remove a specific problem
    const handleRemoveProblem = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            additionalProblems: prevData.additionalProblems.filter((_, i) => i !== index),
        }));
    };


    // Medicine change handler function
    const handleMedicineChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index][name] = value;


        // If syrup type is selected, set default time to after food and days to 3
        if (name === 'type' && value === 'syrup') {
            updatedMedicines[index].foodTiming = 'after'; // Default food timing for syrup
            updatedMedicines[index].days = 3; // Default days for syrup
        }

        // Update dosage based on selected medicine name
        if (name === 'name') {
            const medicineDefaults = {
                'Augmentin': { dosage: '625 mg' },
                'Taxim O': { dosage: '200 mg' },
                'Pan': { dosage: '40 mg', foodTiming: 'before' },
                'Dolo': { dosage: '650 mg' },
                'P': { dosage: '125 mg' }
            };

            if (medicineDefaults[value]) {
                updatedMedicines[index].dosage = medicineDefaults[value].dosage;
                updatedMedicines[index].foodTiming = medicineDefaults[value].foodTiming || updatedMedicines[index].foodTiming;
            }
        }






        setFormData({ ...formData, medicines: updatedMedicines });
    };


    const handleFoodTimingChange = (index, e) => {
        const { value } = e.target;
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index].foodTiming = value;

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

        // Toggle session (morning, afternoon, evening, night) checked state
        updatedMedicines[index].timeOfDay[time] = event.target.checked;

        setFormData({ ...formData, medicines: updatedMedicines });
    };


    // Validation function
    // const validateForm = () => {
    //     const newErrors = {};
    //
    //     // Phone number validation
    //     if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
    //         newErrors.phoneNumber = "Phone number is required.";
    //     } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
    //         newErrors.phoneNumber = "Phone number must be 10 digits.";
    //     }
    //
    //     // Medicines validation
    //     formData.medicines.forEach((medicine, index) => {
    //         if (!medicine.name || medicine.name.trim() === "") {
    //             newErrors[`medicine-name-${index}`] = "Medicine name is required.";
    //         }
    //         if (!medicine.dosage || medicine.dosage.trim() === "") {
    //             newErrors[`medicine-dosage-${index}`] = "Dosage is required.";
    //         }
    //         if (!medicine.days || medicine.days < 0) {
    //             newErrors[`medicine-days-${index}`] = "Days must be greater than or equal to 0.";
    //         }
    //         if (!medicine.foodTiming || (medicine.foodTiming !== "before" && medicine.foodTiming !== "after")) {
    //             newErrors[`medicine-foodTiming-${index}`] = "Food timing must be either 'before' or 'after'.";
    //         }
    //     });
    //
    //     // Payment validation
    //     if (!formData.paymentAmount || isNaN(formData.paymentAmount)) {
    //         newErrors.paymentAmount = "Valid payment amount is required.";
    //     }
    //
    //     return newErrors; // Return the errors instead of setting state
    // };



    const handleSubmit = async (event) => {
        event.preventDefault();

        //for validation
        // if (!validateForm()) {
        //     return;
        // }

        try {
            // Add data to Firestore
            const prescriptionRef = collection(db, 'Prescription');  // Reference to the Prescription collection
            await addDoc(prescriptionRef, {
                patientName: patientName,
                appointmentId: appointmentId,
                patientId: patientId,
                phoneNumber: formData.phoneNumber,
                chiefComplaint: chiefComplaint,
                medicines: formData.medicines,
                adviceToLab: formData.adviceToLab,
                paymentAmount: formData.paymentAmount,
                followUpDate: formData.followUpDate,
                //isBooked: formData.isBooked,
                additionalProblems: formData.additionalProblems,
                onExamination: formData.onExamination,
                radiographReport: formData.radiographReport,
                comments: formData.comments,
                treatmentPlan: formData.treatmentPlan,
                consent: formData.consent,
                createdAt: new Date()  // Add timestamp for record creation

            });

            // Log success message
            alert("Prescription added successfully!");
            window.location.href = 'http://localhost:3000/';

            // Optionally clear the form or provide feedback
            setFormData({
                patientName: '',
                phoneNumber: '',
                chiefComplaint: '',
                medicines: [
                    { type: '', name: '', dosage: '', days: '', timeOfDay: { morning: false, afternoon: false, night: false }, foodTiming: { morning: '', afternoon: '', night: '' } }
                ],
                adviceToLab: '',
                paymentAmount: '',
                followUpDate: '',
                isBooked: false,
                additionalProblems: [],
                onExamination: '',
                radiographReport: '',
                comments: '',
                treatmentPlan: '',
                consent: ''
            });
        } catch (error) {
            console.error('Error adding prescription to Firebase:', error);
        }
    };



    const handleSubmitWithCustomDialog = (e) => {
        e.preventDefault();


        // Perform validation first
        // const errors = validateForm();
        //
        // // Check if there are any errors
        // if (Object.keys(errors).length > 0) {
        //     // Display validation errors to the user
        //     console.error("Validation errors:", errors);
        //     alert("Please correct the highlighted errors before proceeding.");
        //     return; // Prevent modal from opening
        // }

        // Show the custom modal
        const modal = document.getElementById("custom-confirm-dialog");
        modal.style.display = "flex";

        // Attach event listeners for Yes and No buttons
        const yesButton = document.getElementById("confirm-yes");
        const noButton = document.getElementById("confirm-no");

        const closeModal = () => {
            modal.style.display = "none";
        };

        // Handle Yes button click
        yesButton.onclick = () => {
            closeModal(); // Close modal
            handlePrint(); // Trigger print
        };

        // Handle No button click
        noButton.onclick = () => {
            closeModal(); // Close modal
            console.log("Form submitted without printing.");
        };
    };



    // const handlePrint = () => {
    //     const doc = new jsPDF();
    //     doc.setFontSize(16);
    //     doc.text('Patient Prescription Details', 10, 10);
    //     doc.setFontSize(12);
    //     doc.text(`Patient Name: ${formData.patientName}`, 10, 20);
    //     doc.text(`Phone Number: ${formData.phoneNumber}`, 10, 30);
    //
    //     doc.text('Medicines:', 10, 40);
    //     formData.medicines.forEach((medicine, index) => {
    //         doc.text(`${index + 1}. ${medicine.name} - Dosage: ${medicine.dosage}`, 10, 50 + (index * 20));
    //         ['morning', 'afternoon', 'night'].forEach((time) => {
    //             if (medicine.timeOfDay[time]) {
    //                 doc.text(
    //                     `${time.charAt(0).toUpperCase() + time.slice(1)} - ${medicine.foodTiming[time]}`,
    //                     10,
    //                     60 + (index * 20)
    //                 );
    //             }
    //         });
    //     });
    //
    //     doc.text(`Description: ${formData.description}`, 10, 70 + (formData.medicines.length * 20));
    //     if (formData.followUpDate) {
    //         doc.text(`Follow-Up Date: ${formData.followUpDate}`, 10, 80 + (formData.medicines.length * 20));
    //     }
    //     if (formData.adviceToLab) {
    //         doc.text(`Advice to Lab: ${formData.adviceToLab}`, 10, 90 + (formData.medicines.length * 20));
    //     }
    //     doc.text(`Payment Amount: ₹${formData.paymentAmount}`, 10, 100 + (formData.medicines.length * 20));
    //
    //     doc.save('Patient_Prescription.pdf');
    // };

//     function handlePrint(patientData) {
//         const prescriptionWindow = window.open('', '_blank');
//         const template = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <style>
//             /* Include the same CSS here from the template above */
//         .entire_body {
//             font-family: 'Arial', sans-serif;
//             margin: 0;
//             padding: 0;
//             color: #333;
//         }
//         .prescription-container {
//             width: 8.5in;
//             height: 11in;
//             padding: 20px;
//             box-sizing: border-box;
//             background-color: #f9fcff;
//         }
//         .header {
//             display: flex;
//             justify-content: space-between;
//             text-align: center;
//             margin-bottom: 20px;
//         }
//         .header img {
//             height: 60px;
//         }
//         .header h1 {
//             margin: 5px 0;
//             font-size: 24px;
//             color: #03c0c1;
//         }
//         .header p {
//             margin: 2px 0;
//             font-size: 14px;
//             color: #555;
//         }
//         .patient-details {
//             margin-bottom: 20px;
//         }
//         .patient-details label {
//             font-weight: bold;
//         }
//         .patient-details div {
//             margin-bottom: 5px;
//         }
//         .footer {
//             display: flex;
//             justify-content: space-between;
//             margin-top: 50px;
//         }
//         .footer div {
//             text-align: center;
//             width: 45%;
//         }
//         .footer div span {
//             display: block;
//             margin-top: 20px;
//             border-top: 1px solid #000;
//         }
//         .large-icon {
//             opacity: 0.1;
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             font-size: 300px;
//             color: #03c0c1;
//         }
//         </style>
//     </head>
//     <body class="entire_body">
//         <div class="prescription-container">
//             <div class="header">
//
//                 <div class="left-align">
//                     <img src="logo.jpg" alt="Dental Clinic Logo">
//                 </div>
//
//
//                 <div class="middle-align">
//                     <h1>Dr. Nithya's <br>Dental and Smile Design Clinic</h1>
//                 </div>
//
//
//                  <div class="right-align">
//                     <p>Dr. Nithya Selvaraj, MDS</p>
//                     <p>Prosthodontist & Implantologist</p>
//                     <p>Reg. No: 49867-A</p>
//                     <p>+91 974-121-7007</p>
//                     <p>dr.nit.sel@gmail.com</p>
//                 </div>
//             </div>
//
//             <hr>
//
// <!--                <p>201, Downtown Street, New York City</p>-->
// <!--                <p>DR. NAME SURNAME</p>-->
// <!--                <p>DENTAL SURGEON, MPH<br>Medical Officer, Dept. of Oral Medicine</p>-->
//             <div class="patient-details">
//                 <div><label>Name:</label> ${patientData.name}</div>
//                 <div><label>Age:</label> ${patientData.age}</div>
//                 <div><label>Sex:</label> ${patientData.gender === 'M' ? '[X] M [ ] F' : '[ ] M [X] F'}</div>
//                 <div><label>Adv:</label> ${patientData.advice}</div>
//             </div>
//             <div class="large-icon">&#128701;</div>
//             <div class="footer">
//                 <div>
//                     <p>Date</p>
//                     <span>${patientData.date}</span>
//                 </div>
//                 <div>
//                     <p>Signature</p>
//                     <span></span>
//                 </div>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
//         prescriptionWindow.document.write(template);
//         prescriptionWindow.document.close();
//         prescriptionWindow.print();
//     }

    function handlePrint(patientData) {
        const prescriptionWindow = window.open('', '_blank');

        // Assuming formData.medicines is an array of objects like [{ name: 'Medicine1', dosage: '100mg', days: 5, timing: 'Before food' }, ...]
        const medicinesHtml = formData.medicines?.map((medicine, index) => `
        <span style="font-weight: bold">Medicine ${index + 1}: ${medicine.name || 'Not Provided'}</span></br>
        <span style="font-weight: bold">Dosage: <span style="font-weight: normal ">${medicine.dosage || 'Not Provided'}</span> </span>
        <span style="font-weight: bold">No. of Days:<span style="font-weight: normal"> ${medicine.days || 'Not Provided'}</span></span> <br>
        <span style="font-weight: bold">When to take: <span style="font-weight: normal">${medicine.foodTiming || 'Not Provided'}</span></span>
        <br><br>
    `).join('') || '<p>No medicines provided.</p>';

        //console.log("Patient Data: ", {patientName});
        console.log("Patient Name: ", patientName); // Log the exact name

        const template = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/html">
    <head>
        <style>
            .print_entire_body{
            font-family: 'Inter', sans-serif;
        }
        .header-container{
            display: flex;
            justify-content: space-between;
        }
        .header-container h1{
            margin-top: 4%;
            font-size: 28px;
            color:  #03c0c1;;
        }

        .header-container .left{
            margin-left: 3%;
            margin-top: 2%;
            width: 60%;
        }
        .header-container img{
            margin-top: 35px;
            margin-right: 2%;
            height: 75px;
            width: 75px;
            border-radius: 10px;
        }
        .header-container .right{
            margin-top: 12px;
        }

        .header-container .right p{
            font-size: 14px;
            width: 100%;
            margin: 8px;
            margin-right: 20px;
        }
        .patient-details{
            display: flex;
            justify-content: space-between;
        }

        .patient-details1, .patient-details, .patient-details3{
            margin: 0 7% 0% 3.0%;
        }

        .patient-details2{
            margin-left: 3%;
        }

        
        .footer {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
            }
            .footer div {
                text-align: center;
                width: 45%;
            }
            .footer div span {
                display: block;
                margin-top: 20px;
                border-top: 1px solid #000;
            }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    </head>
    <body class="print_entire_body">
    <div class="header-container">
        <div class="left" style="display: flex">
            <img src="data:image/jpeg;base64,<base64_data>" alt="Dental clinic logo">
            <h1>Dr. Nithya's <br>Dental and Smile Design Clinic</h1>

        </div>

        

        <div class="right">
            <p style="font-weight: bold; font-size: 16px">Dr. Nithya Selvaraj, MDS</p>
            <p>Prosthodontist & Implantologist</p>
            <p>Reg. No: 49867-A</p>
            <p>+91 974-121-7007</p>
            <p>dr.nit.sel@gmail.com</p>
        </div>
    </div>


    <hr style="color: #03c0c1">

    <div class="patient-details">
        <div class="patient_name">
            <h3>Name : ${patientName || 'Not Provided'}</h3>
        </div>
<!--        <div class="patient_age">-->
<!--            <h3>Gender/ Age : </h3>-->
<!--        </div>-->
    </div>

    <div class="patient-details1" style="display: flex">
        <h4>Cheif Complaint : ${chiefComplaint || ''}</h4>
    </div>

    <div class="patient-details2">
        <h3>Medicinal Diagnosis</h3>
        <span style="font-weight: bold">On Examination: <span style="font-weight: normal">${formData.onExamination || 'Not Provided'}</span></span> 
        <h2>Medicine:</h2>
                ${medicinesHtml}
        </div>

    <div class="patient-details3"><br>
        <h2>Treatment Details</h2>
        <span style="font-weight: bold"> Radiography Report :<span style="font-weight: normal">${formData.radiographReport || ''}</span></span><br>
        <span style="font-weight: bold">Proposed Treatment Plan : <span style="font-weight: normal">${formData.treatmentPlan || ''}</span> </span><br>
        <span style="font-weight: bold">Consent from Patient : <span style="font-weight: normal">${formData.consent || ''}</span> </span><br>
        <span style="font-weight: bold">Payment Amount : <span style="font-weight: normal">${formData.paymentAmount || 'Not Provided'}</span> </span><br>
        <span style="font-weight: bold;">Follow up date : <span style="font-weight: normal">${formData.followUpDate || 'Not Provided'}</span> </span><br>
    </div>

    <div class="footer">
        <div>
            <p>Date</p>
            <span>${patientData.date || new Date().toLocaleDateString()}</span>
        </div>
        <div>
            <p>Signature</p>
            <span></span>
        </div>
    </div>

    </body>
    </html>
    `;
        prescriptionWindow.document.write(template);
        prescriptionWindow.document.close();

        // Wait for the content to load before printing
        prescriptionWindow.onload = () => {
            prescriptionWindow.print();
            prescriptionWindow.close();
        };
    }






    return (

        <div className="container mt-5 prescription_body" style={{ fontFamily: 'Inter, sans-serif', color: '#333' }}>
            <h2 className="text-center" style={{ color: '#03c0c1', marginBottom: '30px' }}>
                Patient Prescription Details
            </h2>

            <form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{borderColor: '#03c0c1'}}>

                {/* Personal Details */}
                <div className="mb-4 p-3" style={{backgroundColor: '#f8f9fa'}}>
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
                                value={patientName}
                                //value={formData.patientName}
                                onChange={(e) => setPatientName(e.target.value)} // Allows manual changes if needed
                                required
                                style={{borderColor: '#03c0c1'}}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="cheifComplaint" className="form-label">Chief Complaint</label>
                            <input
                                type="tel"
                                id="cheifComplaint"
                                name="cheifComplaint"
                                className="form-control"
                                placeholder=""
                                value={chiefComplaint}
                                onChange={handleInputChange}
                                required
                                style={{borderColor: '#03c0c1'}}
                            />
                        </div>
                    </div>

                </div>

                {/*On Examination*/}
                <div className="mb-4 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <h4>Diagnosis Details</h4>
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
                            <div key={index} className="col-md-3 mb-3 d-flex align-items-center">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter additional problem"
                                    value={problem}
                                    onChange={(e) => handleAdditionalProblemChange(e, index)}
                                    style={{borderColor: '#03c0c1'}}
                                />
                                <button
                                    type="button"
                                    className="btn btn-warning ms-2"
                                    onClick={() => handleRemoveProblem(index)}
                                >
                                    -
                                </button>
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
                </div>


                {/* Medicine Details */}
                <div className="mb-4 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <h4>Medicine Details</h4>
                    {formData.medicines.map((medicine, index) => (
                        <div key={index} className="mb-3 p-2 rounded d-flex align-items-center"
                             style={{border: '1px solid #03c0c1', backgroundColor: '#e9f8f9'}}>

                            {/* Type Selection */}
                            <div className="me-2">
                                <label className="form-label mb-1">Type</label>
                                <select
                                    name="type"
                                    className="form-select"
                                    value={medicine.type || "tablet"}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    required
                                    style={{borderColor: '#03c0c1', width: '100px'}}
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
                                    style={{borderColor: '#03c0c1', width: '150px'}}
                                >
                                    {getMedicineOptions(medicine.type || "tablet").map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                                {errors[`medicine-name-${index}`] && <span className="error">{errors[`medicine-name-${index}`]}</span>}

                            </div>

                            {/* Custom Name Input */}
                            {medicine.name === 'Other' && (
                                <div className="me-2">
                                    <label className="form-label mb-1">Medicine Name</label>
                                    <input
                                        type="text"
                                        name="customName"
                                        className="form-control"
                                        placeholder="Enter Medicine name"
                                        value={medicine.customName}
                                        //value={medicine.name}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        required
                                        style={{borderColor: '#03c0c1', width: '185px'}}
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
                                    style={{borderColor: '#03c0c1', width: '100px'}}
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
                                    style={{borderColor: '#03c0c1', width: '80px'}}
                                />
                            </div>

                            {/* Time of Day Selection (Checkboxes) */}
                            <div className="me-2">
                                <label className="form-label mb-1">Time</label>
                                <div className="d-flex flex-wrap">
                                    {["morning", "afternoon", "evening", "night"].map((time) => (
                                        <label key={time} className="form-check-label me-2" style={{cursor: 'pointer'}}>
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
                                    value={medicine.foodTiming}
                                    onChange={(e) => handleFoodTimingChange(index, e)}
                                    style={{borderColor: '#03c0c1', width: '150px'}}
                                >
                                    <option value="after">After Food</option>
                                    <option value="before">Before Food</option>
                                    {/*<option value="both">Before and After Food</option>*/}
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
                        {/* Radiograph Report */}
                        <div className="col-md-6">
                            <label htmlFor="chiefComplaint" className="form-label">Radiograph Report</label>
                            <textarea
                                id="radiographReport"
                                name="radiographReport"
                                className="form-control"
                                rows="3"
                                placeholder="Enter Radiograph Report"
                                value={formData.radiographReport}
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
                                    style={{borderColor: '#03c0c1'}}
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
                                    style={{borderColor: '#03c0c1'}}
                                />
                                <label htmlFor="consentNo" className="form-check-label">
                                    Do Not Proceed with Treatment Plan
                                </label>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Advice to Lab */}
                <div className="mb-4 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <h4>Lab Advice</h4>
                    <div className="mb-3">
                        <textarea
                            id="adviceToLab"
                            name="adviceToLab"
                            className="form-control"
                            rows="3"
                            placeholder=""
                            value={formData.adviceToLab}
                            onChange={handleInputChange}
                            style={{borderColor: '#03c0c1'}}
                        ></textarea>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="mb-4 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <h4>Payment & Follow-Up Date</h4>

                    <div className="row mb-3">
                        {/* Payment Amount */}
                        <div className="col-md-4">
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
                                style={{borderColor: '#03c0c1', width: '100%'}}
                            />
                        </div>

                        {/* Follow-Up Date */}
                        <div className="col-md-3">
                            <label htmlFor="followUpDate" className="form-label">Follow-Up Date (If needed)</label>
                            <input
                                type="date"
                                id="followUpDate"
                                name="followUpDate"
                                className="form-control"
                                value={formData.followUpDate}
                                onChange={handleInputChange}
                                style={{borderColor: '#03c0c1', width: '100%'}}
                            />
                        </div>
                    </div>

                    {/* Conditional checkbox for booking on the follow-up date */}
                    {/*{formData.followUpDate && (*/}
                    {/*    <div className="form-check mb-3">*/}
                    {/*        <input*/}
                    {/*            type="checkbox"*/}
                    {/*            id="isBooked"*/}
                    {/*            name="isBooked"*/}
                    {/*            className="form-check-input"*/}
                    {/*            checked={formData.isBooked}*/}
                    {/*            onChange={handleInputChange}*/}
                    {/*        />*/}
                    {/*        <label htmlFor="isBooked" className="form-check-label">*/}
                    {/*            Patient wants to book an appointment on the follow-up date?*/}
                    {/*        </label>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>


                {/* Submit and Print Buttons */}
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary me-2"
                            style={{backgroundColor: '#03c0c1', border: 'none'}}>
                        Submit Prescription
                    </button>
                    <button type="button" className="btn btn-success" onClick={handlePrint}>
                        Print Prescription
                    </button>
                </div>



                {/*/!* Custom Confirm Dialog *!/*/}
                {/*<div id="custom-confirm-dialog" className="modal" style={{display: 'none', top:0, left:0, justifyContent: "center",*/}
                {/*alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", width: "100%", height: "100%"}}>*/}
                {/*    <div className="modal-content" style={{backgroundColor: "white", padding: "20px", textAlign: "center", width: "25%" }}>*/}
                {/*        <p>Do you want to print the prescription?</p>*/}
                {/*        <div style={{display: "flex", gap: "15px", justifyContent:"center"}}>*/}
                {/*            <button id="confirm-yes" className="btn btn-primary">Yes</button>*/}
                {/*            <button id="confirm-no" className="btn btn-secondary">No</button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}


            </form>
        </div>
    );
};

export default PrescriptionForm;
