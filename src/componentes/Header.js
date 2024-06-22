import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ blackHeader, onLogout, user }) => {
  return (
    <header className={`header ${blackHeader ? 'black' : ''}`}>
      <div className="header--logo">
        <Link to={user ? "/profile" : "/login"}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" />
        </Link>
      </div>
      <div className="header--user">
        {user ? (
          <>
            <Link to="/profile">
              <img className="header--avatar" src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Usuário" />
            </Link>
            <span className="header--username">{user}</span>
            <button className="header--logout" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="header--login">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
