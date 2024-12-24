import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Popular Movies",
};

export default async function PopularPage() {
  const apiKey = process.env.TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`,
    { cache: "no-store" } // 최신 데이터 가져오기
  );

  if (!response.ok) {
    throw new Error("api 못 불러왔다");
  }

  const data = await response.json();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Popular</h1>
        <Link href="/">돌아가기</Link>
      </header>
      <main className={styles.main}>
        {data.results.map((movie) => (
          <div key={movie.id} className={styles.item}>
            <Link href={`/movies/${movie.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
              />
              <h3 className={styles.title}>{movie.title}</h3>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
