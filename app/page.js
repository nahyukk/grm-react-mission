import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Next Movie",
};

export default async function Home() {
  const apiKey = process.env.TMDB_API_KEY;

  // TMDB API 호출
  const popularResponse = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`
  );
  const nowPlayingResponse = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=1`
  );

  if (!popularResponse.ok || !nowPlayingResponse.ok) {
    throw new Error("Failed to fetch movies");
  }

  const popularMovies = (await popularResponse.json()).results.slice(0, 5);
  const nowPlayingMovies = (await nowPlayingResponse.json()).results.slice(0, 5);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Next Movie</h1>
      <p>영화 영화 영화!!!</p>

      <section>
        <div className={styles.header}>
          <h2>인기 영화</h2>
          <Link href="/popular">
            <p>인기 영화 더 보러가기</p>
          </Link>
        </div>
        <div className={styles.movieGrid}>
          {popularMovies.map((movie) => (
            <div key={movie.id} className={styles.movie}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className={styles.header}>
          <h2>지금 상영작</h2>
          <Link href="/now-playing">
            <p>지금 상영작 더 보러가기</p>
          </Link>
        </div>
        <div className={styles.movieGrid}>
          {nowPlayingMovies.map((movie) => (
            <div key={movie.id} className={styles.movie}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
