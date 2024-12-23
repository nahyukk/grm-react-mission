import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Now Playing Movies",
};

export default async function NowPlayingPage() {
  const apiKey = process.env.TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=1`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch now playing movies");
  }

  const data = await response.json();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Now Playing Movies</h1>
        <Link href="/">돌아가기</Link>
      </header>
      <main className={styles.main}>
        {data.results.map((movie) => (
          <div key={movie.id}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
