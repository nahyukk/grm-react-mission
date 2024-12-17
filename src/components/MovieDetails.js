import "./MovieDetails.css";
import React, { useContext, useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";

const MovieDetails = ({ movieId, onUnmount }) => {
  const [movieDetails, setMovieDetails] = useState({});
  const [error, setError] = useState();
	const { language } = useContext(LanguageContext);

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
      ) : (
        <div>
          <div className="movie-detail-header">
            <h2>{movieDetails.title}</h2>
            <button onClick={onUnmount}>언마운트</button>
          </div>
          <p>{movieDetails.overview}</p>
          <p>개봉일: {movieDetails.release_date}</p>
          <p>평점: {movieDetails.vote_average} / 10</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
