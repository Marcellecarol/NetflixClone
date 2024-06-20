import React from 'react';
import './SerieCard.css';

const SerieCard = ({ id, title, posterUrl, isFavorite, onToggleFavorite }) => {
  return (
    <div className="serie-card">
      <img src={`https://image.tmdb.org/t/p/w300${posterUrl}`} alt={title} />
      <div className="serie-card-info">
        <h3>{title}</h3>
        <button onClick={() => onToggleFavorite(id)}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default SerieCard;
