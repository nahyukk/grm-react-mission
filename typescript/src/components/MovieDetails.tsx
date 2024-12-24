import "./MovieDetails.css";
import React, { useContext, useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";

type MovieDetailsProps = {
  movieId: number;
  onUnmount: () => void; 
};

type MovieDetail = {
  title: string;
  overview: string;
  release_date: string;
  vote_average: number
};


const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onUnmount }) => {
	const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext 에러");
  }

  const { language } = context;

  const [movieDetails, setMovieDetails] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
	

  useEffect(() => {
    let isMounted = true;
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("API 요청 실패!");
        }

        if (isMounted) {
          setMovieDetails(data);
          console.log("MovieDetails 컴포넌트가 마운트됨");
        }
      } catch (err) {
        setError("API 호출 대실패!");
      }
    };

    fetchMovieDetails();
    return () => {
      isMounted = false;
      console.log("MovieDetails 컴포넌트 언마운트됨");
    };
  }, [movieId, language]);

  return (
    <div>
      {error ? (
        <div className="error-div">
          <p className="error-message">{error}</p>
          <button onClick={onUnmount}>언마운트</button>
        </div>
      ) : movieDetails ? (
        <div>
          <div className="movie-detail-header">
            <h2>{movieDetails.title}</h2>
            <button onClick={onUnmount}>언마운트</button>
          </div>
          <p>{movieDetails.overview}</p>
          <p>개봉일: {movieDetails.release_date}</p>
          <p>평점: {movieDetails.vote_average} / 10</p>
        </div>
			) : (
				<p>Loading...</p>
      )}
    </div>
  );
};

export default MovieDetails;
