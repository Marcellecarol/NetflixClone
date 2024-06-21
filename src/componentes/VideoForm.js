import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './VideoForm.css';

const VideoForm = ({ onAddVideo, onEditVideo, editingVideo }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (editingVideo && editingVideo.id.toString() === id) {
      setTitle(editingVideo.title);
      setUrl(editingVideo.url);
      setDescription(editingVideo.description);
      setCategory(editingVideo.category);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setCategory('');
    }
  }, [editingVideo, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoData = {
      id: editingVideo ? editingVideo.id : Date.now(),
      title,
      url,
      description,
      category
    };
    if (editingVideo) {
      onEditVideo(videoData);
    } else {
      onAddVideo(videoData);
    }
    navigate('/');
  };

  return (
    <div className="video-form-container">
      <h2>{editingVideo ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL do vídeo:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Categoria:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editingVideo ? 'Salvar Alterações' : 'Adicionar Vídeo'}</button>
      </form>
      <div className="back-to-home">
      <Link to="/" style={{ color: '#ddd' }}>Voltar para a página principal</Link>
      </div>
    </div>
  );
};

export default VideoForm;
