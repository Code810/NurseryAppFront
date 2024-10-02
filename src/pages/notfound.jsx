import React from 'react';
import './notfound.css'; // Import the custom CSS file for kid-friendly animations
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="container">
    <div className="gif">
      <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="gif_ing" />
    </div>
    <div className="content">
      <h1 className="main-heading">404</h1>
      <p>
        ...Səhifə tapılmadı.
      </p>
      <Link to="/" target="blank">
        <button className='btnnotfound'>geri qayıt <i className="far fa-hand-point-right"></i></button>
      </Link>
    </div>
  </div>

  );
};

export default PageNotFound;
