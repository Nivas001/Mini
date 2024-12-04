import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Patient from './Patient';
import PrescriptionForm from './Prescription';
import View from './View_list';

function App() {
  return (
      <Router>
        <Routes>
            <Route path={"/"} element={<View />} />
          {/*  Uncomment these 3 lines to run View Daily Patient Card*/}
          {/*<Route path="/" element={<Patient />} />*/}
          {/*  <Route path="/prescription/:patientId/:appointmentId" element={<PrescriptionForm />} />*/}
          {/*  <Route path="/view" element={<View />} />*/}
        </Routes>
      </Router>
  );
}

export default App;
