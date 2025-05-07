import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Shuffle, NavigateBefore, NavigateNext, SwapHoriz, Flip } from '@mui/icons-material';
import { getVocabList } from '../utils/storage';

const styles = {
  cardContainer: {
    perspective: '1000px',
    width: '100%',
    maxWidth: '500px',
    height: '200px',
    margin: '0 auto 20px',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    cursor: 'pointer',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    padding: '20px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardFront: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
  },
  cardBack: {
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    transform: 'rotateY(180deg)',
  },
  flipped: {
    transform: 'rotateY(180deg)',
  },
};

function Flipcard() {
  const [vocabs, setVocabs] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledVocabs, setShuffledVocabs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReversed, setIsReversed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedVocabs = getVocabList();
    setVocabs(savedVocabs);
    if (savedVocabs.length > 0) {
      setShuffledVocabs([...savedVocabs]);
    }
    setIsLoading(false);
  }, []);

  const shuffleVocabs = () => {
    const shuffled = [...vocabs].sort(() => Math.random() - 0.5);
    setShuffledVocabs(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const getRandomCard = () => {
    if (shuffledVocabs.length <= 1) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * shuffledVocabs.length);
    } while (newIndex === currentIndex && shuffledVocabs.length > 1);
    
    setCurrentIndex(newIndex);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (shuffledVocabs.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (shuffledVocabs.length || 1)) % (shuffledVocabs.length || 1));
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleLanguage = () => {
    setIsReversed(!isReversed);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (shuffledVocabs.length === 0) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Tidak ada kosakata yang tersedia. Silakan tambahkan kosakata terlebih dahulu.
        </Typography>
      </Container>
    );
  }

  const currentVocab = shuffledVocabs[currentIndex];

  return (
    <Container>
      <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4, p: 2 }}>
        <div style={styles.cardContainer}>
          <div 
            style={{
              ...styles.card,
              ...(isFlipped ? styles.flipped : {})
            }}
            onClick={toggleFlip}
          >
            <div style={{ ...styles.cardFace, ...styles.cardFront }}>
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="h4" component="div" align="center" sx={{ fontWeight: 'bold', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isReversed ? currentVocab.meaning : currentVocab.word}
                </Typography>
              </CardContent>
            </div>
            <div style={{ ...styles.cardFace, ...styles.cardBack }}>
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="h5" component="div" sx={{ 
                  minHeight: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 2
                }}>
                  {isReversed ? currentVocab.word : currentVocab.meaning}
                </Typography>
              </CardContent>
            </div>
          </div>
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 1 }}>
          <Tooltip title="Previous">
            <IconButton 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
              color="primary"
              size="large"
            >
              <NavigateBefore />
            </IconButton>
          </Tooltip>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isReversed ? "Tampilkan Bahasa Inggris" : "Tampilkan Bahasa Indonesia"}>
              <IconButton 
                onClick={toggleLanguage}
                color="primary"
                size="large"
              >
                <SwapHoriz />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Flip Card">
              <IconButton 
                onClick={toggleFlip} 
                color="primary"
                size="large"
              >
                <Flip />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Tooltip title="Next">
            <IconButton 
              onClick={handleNext} 
              disabled={currentIndex === shuffledVocabs.length - 1}
              color="primary"
              size="large"
            >
              <NavigateNext />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, gap: 1 }}>
          <Button 
            variant="contained" 
            onClick={handlePrev} 
            disabled={shuffledVocabs.length <= 1}
            startIcon={<NavigateBefore />}
            sx={{ minWidth: '120px' }}
          >
            Sebelumnya
          </Button>
          
          <Tooltip title="Acak Kartu">
            <IconButton 
              color="primary" 
              onClick={shuffleVocabs}
              disabled={shuffledVocabs.length <= 1}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabled',
                }
              }}
            >
              <Shuffle />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Kartu Acak">
            <IconButton 
              color="secondary" 
              onClick={getRandomCard}
              disabled={shuffledVocabs.length <= 1}
              sx={{ 
                backgroundColor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabled',
                }
              }}
            >
              <Shuffle />
            </IconButton>
          </Tooltip>
          
          <Typography variant="body1" sx={{ minWidth: '80px', textAlign: 'center' }}>
            {shuffledVocabs.length > 0 ? `${currentIndex + 1} / ${shuffledVocabs.length}` : '0 / 0'}
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={handleNext} 
            disabled={shuffledVocabs.length <= 1}
            endIcon={<NavigateNext />}
            sx={{ minWidth: '120px' }}
          >
            Selanjutnya
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

// Export the Flipcard component directly
export default Flipcard;