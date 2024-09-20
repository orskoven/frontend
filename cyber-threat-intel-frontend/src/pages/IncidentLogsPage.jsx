import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IncidentLogList from '../components/IncidentLog/IncidentLogList';
import IncidentLogDetail from '../components/IncidentLog/IncidentLogDetail';
import IncidentLogForm from '../components/IncidentLog/IncidentLogForm';

const IncidentLogsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<IncidentLogList />} />
      <Route path="/create" element={<IncidentLogForm />} />
      <Route path="/edit/:id" element={<IncidentLogForm />} />
      <Route path="/:id" element={<IncidentLogDetail />} />
    </Routes>
  );
};

export default IncidentLogsPage;
