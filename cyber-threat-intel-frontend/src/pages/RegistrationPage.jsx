// src/pages/RegistrationPage.jsx

import React from 'react';
import RegistrationForm from '../components/Registration/RegistrationForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationPage = () => {
  return (
    <>
      <RegistrationForm />
      <ToastContainer />
    </>
  );
};

export default RegistrationPage;