import React, { useState, useEffect } from 'react';
import './VideoForm.css';

const VideoForm = ({ onAddVideo, onEditVideo, editingVideo }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setUrl(editingVideo.url);
      setDescription(editingVideo.description);
    }
  }, [editingVideo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && url) {
      if (editingVideo) {
        onEditVideo({ id: editingVideo.id, title, url, description });
      } else {
        onAddVideo({ title, url, description });
      }
      setTitle('');
      setUrl('');
      setDescription('');
    }
  };

  return (
    <div className="video-form-container">
      <h2>{editingVideo ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>URL do Vídeo:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">{editingVideo ? 'Salvar Alterações' : 'Adicionar Vídeo'}</button>
      </form>
    </div>
  );
};

export default VideoForm;
