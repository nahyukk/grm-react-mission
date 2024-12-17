import { useState } from "react";
import "./App.css";
import ChangeLanguage from "./components/ChangeLanguage";
import MovieList from "./components/MovieList";
import { LanguageProvider } from "./context/LanguageContext";
import MovieDetails from "./components/MovieDetails";

function App() {
  const [movieId, setMovieId] = useState();

  const handleMovieSelect = (id) => {
    setMovieId(id);
  };

	const handleUnmount = () => {
		setMovieId(null);
	}

  return (
    <LanguageProvider>
      <div className="App">
        <header className="app-header">
          <h1>Hello Movie</h1>
          <ChangeLanguage />
        </header>
				{movieId ? (
          <MovieDetails movieId={movieId} onUnmount={handleUnmount} />
        ) : (
          <MovieList onMovieSelect={handleMovieSelect} />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
