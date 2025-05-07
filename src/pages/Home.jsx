import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          Selamat Datang di Aplikasi Latihan Kosakata
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Pilih mode latihan yang Anda inginkan:
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/quiz"
            size="large"
          >
            Mulai Kuis
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/flipcard"
            size="large"
          >
            Kartu Flash
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
