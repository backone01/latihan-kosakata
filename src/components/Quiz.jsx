import React, { useState, useEffect } from 'react';
import { getVocabList } from '../utils/storage';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  LinearProgress, 
  IconButton,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import { CheckCircle, Close, ArrowForward } from '@mui/icons-material';

export default function Quiz() {
  const [vocabs, setVocabs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    const loadedVocabs = getVocabList();
    setVocabs(loadedVocabs);
    if (loadedVocabs.length > 0) {
      generateOptions(loadedVocabs, 0);
    }
  }, []);

  const generateOptions = (vocabList, index) => {
    if (vocabList.length < 4) return;

    const currentVocab = vocabList[index];
    const correct = currentVocab.meaning;
    setCorrectAnswer(correct);
    
    const otherMeanings = vocabList
      .filter((_, i) => i !== index)
      .map(v => v.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [...otherMeanings, correct]
      .sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const handleAnswer = (answer) => {
    if (showFeedback) return; // Prevent multiple submissions
    
    const isAnswerCorrect = answer === correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
      // Auto-proceed to next question after a short delay
      setTimeout(() => {
        if (currentIndex < vocabs.length - 1) {
          setCurrentIndex(prev => prev + 1);
          generateOptions(vocabs, currentIndex + 1);
        } else {
          setShowResult(true);
        }
      }, 1000);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert('Silakan pilih jawaban terlebih dahulu!');
      return;
    }

    if (currentIndex < vocabs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      generateOptions(vocabs, currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
    const shuffled = [...vocabs].sort(() => 0.5 - Math.random());
    setVocabs(shuffled);
    generateOptions(shuffled, 0);
  };

  if (vocabs.length < 4) {
    return (
      <div className="alert alert-warning">
        <h4 className="alert-heading">Kosakata Tidak Cukup</h4>
        <p className="mb-0">Minimal dibutuhkan 4 kosakata untuk memulai kuis. Silakan tambahkan lebih banyak kosakata terlebih dahulu.</p>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / vocabs.length) * 100);
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h2 className="card-title">Kuis Selesai!</h2>
          <div className={`display-4 fw-bold mb-3 ${percentage >= 70 ? 'text-success' : 'text-danger'}`}>
            {percentage}%
          </div>
          <p className="h5 mb-4">
            Skor Anda: {score} dari {vocabs.length}
          </p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={resetQuiz}
          >
            Mulai Kuis Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <LinearProgress 
          variant="determinate" 
          value={(currentIndex + 1) / vocabs.length * 100} 
          sx={{ height: 10, mb: 4 }} 
        />
        
        <h4 className="mb-4">Apa arti dari: <strong>{vocabs[currentIndex]?.word}</strong>?</h4>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === correctAnswer;
            let buttonVariant = 'outlined';
            
            if (showFeedback) {
              if (isSelected) {
                buttonVariant = isCorrect ? 'contained' : 'contained';
              } else if (isCorrectOption) {
                buttonVariant = 'contained';
              }
            }
            
            return (
              <Button
                key={index}
                variant={buttonVariant}
                color={
                  !showFeedback ? 'primary' :
                  isSelected ? 
                    (isCorrect ? 'success' : 'error') :
                  isCorrectOption ? 'success' : 'primary'
                }
                onClick={() => handleAnswer(option)}
                disabled={showFeedback && !isSelected && !isCorrectOption}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:disabled': {
                    opacity: 0.8
                  }
                }}
              >
                {option}
                {showFeedback && isSelected && (
                  <Box sx={{ position: 'absolute', right: 8 }}>
                    {isCorrect ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <Close fontSize="small" />
                    )}
                  </Box>
                )}
              </Button>
            );
          })}
        </Box>

        <Collapse in={showFeedback && !isCorrect}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                Lanjut
              </Button>
            }
          >
            <strong>Jawaban benar:</strong> {correctAnswer}
          </Alert>
        </Collapse>

        <div className="d-grid mt-4">
          <Button 
            className="btn btn-primary btn-lg"
            onClick={handleNext}
          >
            {currentIndex === vocabs.length - 1 ? 'Selesai' : 'Lanjut'}
          </Button>
        </div>
      </div>
    </div>
  );
}