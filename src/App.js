import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import tmdb from "./tmdb";
import MovieRow from "./componentes/MovieRow";
import FeaturedMovie from "./componentes/FeaturedMovie";
import Header from "./componentes/Header";
import Login from "./componentes/Login";
import Register from "./componentes/Register";
import Profile from "./componentes/Profile";
import SerieCard from "./componentes/SerieCard";
import VideoForm from "./componentes/VideoForm";
import { getFavorites, addToFavorites, removeFromFavorites } from "./utils/localStorage";

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(localStorage.getItem('loggedInUser') || null);
  const [favorites, setFavorites] = useState(getFavorites());
  const [videos, setVideos] = useState(JSON.parse(localStorage.getItem('videos')) || []);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      let list = await tmdb.getHomeList();
      setMovieList(list);

      let originals = list.find(item => item.slug === 'originals');
      if (originals) {
        let randomChosen = Math.floor(Math.random() * (originals.items.results.length - 1));
        let chosen = originals.items.results[randomChosen];
        let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');
        setFeaturedData(chosenInfo);
      }
      setLoading(false);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  const handleLogin = (username) => {
    localStorage.setItem('loggedInUser', username);
    setUser(username);
  };

  const handleRegister = (username) => {
    
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const toggleFavorite = (id) => {
    const serie = movieList.find(item => item.id === id);
    if (!serie) return;

    if (favorites.find(item => item.id === id)) {
      removeFromFavorites(id);
      setFavorites(favorites.filter(item => item.id !== id));
    } else {
      addToFavorites(serie);
      setFavorites([...favorites, serie]);
    }
  };

  const handleAddVideo = (video) => {
    setVideos([...videos, { ...video, id: Date.now() }]);
  };

  const handleEditVideo = (video) => {
    setVideos(videos.map(v => (v.id === video.id ? video : v)));
    setEditingVideo(null);
  };

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
  };

  return (
    <Router>
      <div className="page">
        <Header blackHeader={blackHeader} onLogout={handleLogout} user={user} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={
              user ? (
                <>
                  {featuredData && <FeaturedMovie item={featuredData} />}
                  <section className="lists">
                    {movieList.map((item, key) => (
                      <MovieRow key={key} title={item.title} items={item.items} />
                    ))}
                  </section>
                  <section className="favorites">
                    <h2>My Favorites</h2>
                    <div className="serie-cards">
                      {favorites.map(serie => (
                        <SerieCard
                          key={serie.id}
                          id={serie.id}
                          title={serie.title}
                          posterUrl={serie.posterUrl}
                          isFavorite={favorites.some(item => item.id === serie.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  </section>
                  <section className="video-form">
                    <VideoForm onAddVideo={handleAddVideo} onEditVideo={handleEditVideo} editingVideo={editingVideo} />
                  </section>
                  <section className="videos">
                    <h2>Vídeos Cadastrados</h2>
                    <div className="video-cards">
                      {videos.map((video, index) => (
                        <div key={index} className="video-card">
                          <h3>{video.title}</h3>
                          <video width="300" controls>
                            <source src={video.url} type="video/mp4" />
                            Seu navegador não suporta a tag de vídeo.
                          </video>
                          <p>{video.description}</p>
                          <button onClick={() => handleEditClick(video)}>Editar</button>
                          <button onClick={() => handleDeleteVideo(video.id)}>Excluir</button>
                        </div>
                      ))}
                    </div>
                  </section>
                  <footer>
                    Direitos de imagem para Netflix <br />
                    Dados recolhidos do site Themoviedb.org
                  </footer>
                  {loading && (
                    <div className="loading">
                      <img src="https://media.giphy.com/media/sSgvbe1m3n93G/giphy.gif" alt="Loading" />
                    </div>
                  )}
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
