import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { saveVocab, getVocabList } from '../utils/storage';

function AddVocabulary({ onVocabAdded }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!word.trim() || !meaning.trim()) {
      setError('Kata dan arti harus diisi');
      return;
    }

    // Check for duplicates (case insensitive)
    const existingVocabs = getVocabList();
    const isDuplicate = existingVocabs.some(
      v => v.word.toLowerCase() === word.trim().toLowerCase() || 
           v.meaning.toLowerCase() === meaning.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError('Kosakata sudah ada dalam daftar');
      return;
    }

    // Add new vocabulary
    const newVocab = {
      word: word.trim(),
      meaning: meaning.trim(),
      id: Date.now()
    };

    saveVocab(newVocab);
    setSnackbarMessage('Kosakata berhasil ditambahkan');
    setOpenSnackbar(true);
    
    // Reset form
    setWord('');
    setMeaning('');
    setError('');
    
    // Notify parent component with updated list
    if (onVocabAdded) {
      onVocabAdded(getVocabList());
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Tambah Kosakata Baru
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Kata (Bahasa Inggris)"
          variant="outlined"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Arti (Bahasa Indonesia)"
          variant="outlined"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
        >
          Tambah Kosakata
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AddVocabulary;
