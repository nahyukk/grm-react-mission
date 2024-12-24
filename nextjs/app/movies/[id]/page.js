import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Movie Details",
};

export default async function MovieDetailPage({ params }) {
  const { id } = params;

  const apiKey = process.env.TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ko-KR`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("api 못 불러왔다");
  }

  const movie = await response.json();

  return (
    <div>
      <Link className={styles.goback} href="/">
        돌아가기
      </Link>
      <div className={styles.container}>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={200}
          height={300}
        />
        <h3 className={styles.title}>{movie.title}</h3>
        <p>{movie.overview}</p>
        <div className={styles.details}>
          <p>Release Date: {movie.release_date}</p>
          <p>Rating: {movie.vote_average}</p>
        </div>
      </div>
    </div>
  );
}
