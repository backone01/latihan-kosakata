const VOCAB_KEY = 'vocabulary_app_vocabs';

export const getVocabList = () => {
  try {
    const saved = localStorage.getItem(VOCAB_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading vocabulary:', error);
    return [];
  }
};

export const saveVocab = (vocab) => {
  try {
    const vocabs = getVocabList();
    const newVocab = {
      ...vocab,
      id: vocab.id || Date.now(),
      createdAt: new Date().toISOString()
    };
    const updatedVocabs = [...vocabs, newVocab];
    localStorage.setItem(VOCAB_KEY, JSON.stringify(updatedVocabs));
    return updatedVocabs;
  } catch (error) {
    console.error('Error saving vocabulary:', error);
    return [];
  }
};

export const isVocabExists = (word, meaning) => {
  const vocabs = getVocabList();
  return vocabs.some(
    v => v.word.toLowerCase() === word.toLowerCase() || 
         v.meaning.toLowerCase() === meaning.toLowerCase()
  );
};

export const setVocabList = (list) => {
  try {
    const validList = Array.isArray(list) ? list : [];
    localStorage.setItem(VOCAB_KEY, JSON.stringify(validList));
    return validList;
  } catch (error) {
    console.error('Error setting vocabulary list:', error);
    return [];
  }
};

export const clearAllVocabs = () => {
  localStorage.removeItem(VOCAB_KEY);
  return [];
};