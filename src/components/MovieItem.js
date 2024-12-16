import React from "react";

const MovieItem = ({ title, img, children }) => {
  return (
    <div className="movie-item">
      <img className="movie-poster" src={img} alt={title} />
      <h3 className="movie-title">{title}</h3>
      <div className="movie-details">{children}</div>
    </div>
  );
};

export default MovieItem;
