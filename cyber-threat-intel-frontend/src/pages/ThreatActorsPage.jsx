import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ThreatActorList from '../components/ThreatActor/ThreatActorList';
import ThreatActorDetail from '../components/ThreatActor/ThreatActorDetail';
import ThreatActorForm from '../components/ThreatActor/ThreatActorForm';

const ThreatActorsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ThreatActorList />} />
      <Route path="/create" element={<ThreatActorForm />} />
      <Route path="/edit/:id" element={<ThreatActorForm />} />
      <Route path="/:id" element={<ThreatActorDetail />} />
    </Routes>
  );
};

export default ThreatActorsPage;
