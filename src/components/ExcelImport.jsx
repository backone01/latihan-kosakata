import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import { setVocabList, getVocabList } from '../utils/storage';

export default function ExcelImport({ onImport }) {
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Format: [['Kata', 'Arti'], ['apple', 'apel'], ...]
      const vocabs = jsonData
        .filter((row, index) => index > 0 && row[0] && row[1]) // Skip header & empty rows
        .map(row => ({
          word: row[0].toString().trim(),
          meaning: row[1].toString().trim()
        }));

      // Gabungkan dengan data yang sudah ada
      const existingVocabs = getVocabList();
      const updatedVocabs = [...existingVocabs, ...vocabs];
      setVocabList(updatedVocabs);
      
      // Notify parent component about the import
      if (onImport) {
        onImport(updatedVocabs);
      }
      
      alert(`Berhasil mengimpor ${vocabs.length} kosakata!`);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Import Kosakata dari Excel
      </Typography>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        id="excel-upload"
        style={{ display: 'none' }}
      />
      <label htmlFor="excel-upload">
        <Button variant="contained" component="span">
          Pilih File Excel
        </Button>
      </label>
      {fileName && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          File dipilih: {fileName}
        </Typography>
      )}
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Format file Excel: Kolom A untuk kata, Kolom B untuk arti. Baris pertama diabaikan (header).
      </Typography>
    </Container>
  );
}