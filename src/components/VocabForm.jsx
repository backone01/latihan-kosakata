import React, { useState, useEffect } from 'react';

export default function VocabForm({ onSubmit, initialValues }) {
  const [formData, setFormData] = useState({ word: '', meaning: '' });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        word: initialValues.word || '',
        meaning: initialValues.meaning || ''
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="word" className="form-label">Kata</label>
        <input
          type="text"
          className="form-control"
          id="word"
          name="word"
          value={formData.word}
          onChange={handleChange}
          placeholder="Masukkan kata"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="meaning" className="form-label">Arti</label>
        <textarea
          className="form-control"
          id="meaning"
          name="meaning"
          rows="3"
          value={formData.meaning}
          onChange={handleChange}
          placeholder="Masukkan arti"
          required
        ></textarea>
      </div>

      <div className="d-flex justify-content-end">
        <button 
          type="button" 
          className="btn btn-secondary me-2" 
          onClick={() => onSubmit(null)}
        >
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Simpan
        </button>
      </div>
    </form>
  );
}