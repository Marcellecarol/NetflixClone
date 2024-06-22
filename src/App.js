import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import './App.css';
import tmdb from "./tmdb";
import MovieRow from "./componentes/MovieRow";
import FeaturedMovie from "./componentes/FeaturedMovie";
import Header from "./componentes/Header";
import Login from "./componentes/Login";
import Register from "./componentes/Register";
import Profile from "./componentes/Profile";
import VideoForm from "./componentes/VideoForm";

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(localStorage.getItem('loggedInUser') || null);
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

  const getVideoId = (videoUrl) => {
    const videoId = videoUrl.split('v=')[1];
    return videoId ? videoId.split('&')[0] : null;
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
            path="/cadastro-video"
            element={
              <VideoForm
                onAddVideo={handleAddVideo}
                onEditVideo={handleEditVideo}
                editingVideo={editingVideo}
              />
            }
          />
          <Route
            path="/editar-video/:id"
            element={
              <VideoForm
                onAddVideo={handleAddVideo}
                onEditVideo={handleEditVideo}
                editingVideo={editingVideo}
              />
            }
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
                  <section className="videos">
                    <div className="video-form-container">
                      <div className="add-video-button">
                        <Link to="/cadastro-video" onClick={() => setEditingVideo(null)}>Cadastrar Novo Vídeo</Link>
                      </div>
                      <h2>Vídeos Cadastrados</h2>
                      <div className="video-cards">
                        {videos.map((video, index) => (
                          <div key={index} className="video-card">
                            <h3>{video.title}</h3>
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-thumbnail">
                              <img src={`https://img.youtube.com/vi/${getVideoId(video.url)}/0.jpg`} alt={video.title} />
                            </a>
                            <p>{video.description}</p>
                            <p><strong>Categoria:</strong> {video.category}</p>
                            <div className="video-buttons">
                              <Link to={`/editar-video/${video.id}`} onClick={() => handleEditClick(video)}>Editar</Link>
                              <button onClick={() => handleDeleteVideo(video.id)}>Excluir</button>
                            </div>
                          </div>
                        ))}
                      </div>
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

