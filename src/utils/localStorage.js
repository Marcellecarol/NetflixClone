export const getFavorites = () => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = (serie) => {
  const favorites = getFavorites();
  favorites.push(serie);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

export const removeFromFavorites = (id) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(serie => serie.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
};
