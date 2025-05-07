import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VocabList from './components/VocabList';
import Flipcard from './components/Flipcard';
import Quiz from './components/Quiz';
import ExcelImport from './components/ExcelImport';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<VocabList />} />
          <Route path="/flipcard" element={<Flipcard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/import" element={<ExcelImport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;