import "./App.css";
import ChangeLanguage from "./components/ChangeLanguage";
import MovieList from "./components/MovieList";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <header className="app-header">
          <h1>Hello Movie</h1>
          <ChangeLanguage />
        </header>
        <MovieList></MovieList>
      </div>
    </LanguageProvider>
  );
}

export default App;
