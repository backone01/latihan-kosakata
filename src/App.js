import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Tabs, Tab, Paper } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Quiz from './components/Quiz';
import Flipcard from './components/Flipcard';
import AddVocabulary from './components/AddVocabulary';
import ExcelImport from './components/ExcelImport';
import VocabList from './components/VocabList';
import { getVocabList } from './utils/storage';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
  },
});

function App() {
  const [vocabs, setVocabs] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // Load vocabs on initial render
  useEffect(() => {
    const savedVocabs = getVocabList();
    setVocabs(savedVocabs);
  }, []);

  const handleVocabUpdate = (updatedVocabs) => {
    setVocabs(updatedVocabs);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const VocabManagement = () => (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Tambah Manual" />
          <Tab label="Import Excel" />
        </Tabs>
      </Paper>


      {tabValue === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <AddVocabulary onVocabAdded={handleVocabUpdate} />
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <ExcelImport onImport={handleVocabUpdate} />
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <VocabList vocabs={vocabs} onVocabUpdated={handleVocabUpdate} />
      </Paper>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <main className="py-4">
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/flipcard" element={<Flipcard />} />
              <Route 
                path="/vocab" 
                element={<VocabManagement />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;