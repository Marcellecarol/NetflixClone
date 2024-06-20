import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout(); 
    }
  };

  return (
    <div className="profile">
      <div className="profile--content">
        <h2 className="profile--title">Perfil do Usuário</h2>
        {user ? (
          <div>
            <p className="profile--welcome">Bem-vindo, {user}!</p>
            <button className="profile--logout" onClick={handleLogout}>Logout</button>
            <div className="profile--back">
              <Link to="/">Voltar para a página principal</Link>
            </div>
          </div>
        ) : (
          <p>Usuário não logado.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
