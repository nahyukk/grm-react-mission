import { useContext, useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";
import React from "react";
import MovieItem from "./MovieItem";
import "./MovieList.css";
import { Movie } from "../types";

type MovieListProps = {
  onMovieSelect: (id: number) => void;
};

const MovieList: React.FC<MovieListProps> = ({ onMovieSelect }) => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext 에러");
  }

  const { language } = context;
  const [movies, setMovies] = useState<Movie[]>([]);

  const IMG_URL = "https://image.tmdb.org/t/p/w200";

  useEffect(() => {
    const fetchMovieData = async () => {
      const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}`;

      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        // 에러 표시 보여주는 코드 작성 예정
      }
    };
    fetchMovieData();
  }, [language]);

  return (
    <div>
      <h2>Popular MovieList</h2>
      <div className="movie-container">
        {movies.map((movie) => (
          <MovieItem
            key={movie.id}
            title={movie.title}
            img={`${IMG_URL}${movie.poster_path}`}
            onClick={() => onMovieSelect(movie.id)}
          >
            <p className="movie-rdate">{movie.release_date}</p>
            <p className="movie-vote">{movie.vote_average} / 10</p>
          </MovieItem>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
