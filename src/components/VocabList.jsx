import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, DeleteForever as DeleteAllIcon } from '@mui/icons-material';
import { getVocabList, setVocabList } from '../utils/storage';

export default function VocabList({ vocabs = [], onVocabUpdated }) {
  const [localVocabs, setLocalVocabs] = useState(vocabs);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalVocabs(vocabs);
  }, [vocabs]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentVocab, setCurrentVocab] = useState({ id: null, word: '', meaning: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [searchTerm, setSearchTerm] = useState('');

  // Remove this useEffect since we're now getting vocabs from props
  // and they're already loaded in the parent component

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (vocab) => {
    setCurrentVocab({ ...vocab });
    setEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updatedVocabs = localVocabs.filter(v => v.id !== id);
    setVocabList(updatedVocabs);
    setLocalVocabs(updatedVocabs);
    if (onVocabUpdated) onVocabUpdated(updatedVocabs);
    showSnackbar('Kosakata berhasil dihapus', 'success');
  };

  const handleDeleteAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua kosakata?')) {
      setVocabList([]);
      setLocalVocabs([]);
      if (onVocabUpdated) onVocabUpdated([]);
      showSnackbar('Semua kosakata berhasil dihapus', 'success');
    }
  };

  const handleSaveEdit = () => {
    if (!currentVocab.word.trim() || !currentVocab.meaning.trim()) {
      showSnackbar('Kata dan arti tidak boleh kosong', 'error');
      return;
    }

    const isDuplicate = localVocabs.some(
      v => v.id !== currentVocab.id && v.word.toLowerCase() === currentVocab.word.toLowerCase()
    );

    if (isDuplicate) {
      showSnackbar('Kosakata sudah ada', 'error');
      return;
    }

    const updatedVocabs = localVocabs.map(v => 
      v.id === currentVocab.id ? { ...currentVocab } : v
    );

    setVocabList(updatedVocabs);
    setLocalVocabs(updatedVocabs);
    if (onVocabUpdated) onVocabUpdated(updatedVocabs);
    setEditDialogOpen(false);
    showSnackbar('Kosakata berhasil diperbarui', 'success');
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter vocabs based on search term
  const filteredVocabs = localVocabs.filter(vocab => 
    vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vocab.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate paginated vocabs from filtered list
  const paginatedVocabs = filteredVocabs.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {vocabs.length === 0 ? 'Selamat Datang di Aplikasi Latihan Kosakata' : 'Daftar Kosakata'}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 4, color: 'text.secondary' }}>
          {vocabs.length === 0 
            ? 'Mulai belajar kosakata dengan menambahkan kosakata baru' 
            : 'Kelola daftar kosakata Anda'}
        </Typography>

        {vocabs.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Cari kosakata atau arti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      🔍
                    </Box>
                  ),
                }}
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteAllIcon />}
                onClick={handleDeleteAll}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Hapus Semua
              </Button>
            </Box>
          
            {filteredVocabs.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {searchTerm 
                    ? 'Tidak ada hasil yang cocok dengan pencarian Anda.'
                    : 'Belum ada kosakata yang tersedia. Silakan tambahkan kosakata terlebih dahulu.'
                  }
                </Typography>
              </Paper>
            ) : (
              <>
                <TableContainer component={Paper} elevation={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>No</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Kata</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Arti</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedVocabs.map((vocab, index) => (
                        <TableRow key={vocab.id}>
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell>{vocab.word}</TableCell>
                          <TableCell>{vocab.meaning}</TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(vocab)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(vocab.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredVocabs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Baris per halaman:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} dari ${count}`
                  }
                />
              </>
            )}
          </Box>
        )}

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Kosakata</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, minWidth: 400 }}>
              <TextField
                fullWidth
                label="Kata"
                value={currentVocab.word}
                onChange={(e) => setCurrentVocab({...currentVocab, word: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Arti"
                value={currentVocab.meaning}
                onChange={(e) => setCurrentVocab({...currentVocab, meaning: e.target.value})}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit} variant="contained">Simpan</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}