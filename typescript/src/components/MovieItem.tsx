import React from "react";

type MovieItemProps = {
  title: string;
  img: string;
  children?: React.ReactNode; 
  onClick: () => void;
};

const MovieItem: React.FC<MovieItemProps> = ({ title, img, children, onClick }) => {
  return (
    <div className="movie-item">
      <img className="movie-poster" src={img} alt={title} onClick={onClick}/>
      <h3 className="movie-title">{title}</h3>
      <div className="movie-details">{children}</div>
    </div>
  );
};

export default MovieItem;
