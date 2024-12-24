## 1. Next.js로 영화 목록 확인 앱 페이지화하기
### <구조>

```java
app/
│
├── popular/
│   ├── page.js 
│   ├── page.module.css
│ 
├── now-playing/
│   ├── page.js 
│   ├── page.module.css
│
├── page.js         
└── layout.js
```

홈 페이지와 인기 영화 페이지를 만들었다. 추가로 now-playing도 만들어 줌.

처음에는 글자 클릭으로 만들었다가 홈이 너무 재미가 없어서 영화 몇개 보여주고 “더 보러가기" link로 다른 페이지로 이동할 수 있도록 했다.
### <page.js> - 홈

```jsx
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

```

### <popular/page.js>

```jsx
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
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
            />
            <h3 className={styles.title}>{movie.title}</h3>
          </div>
        ))}
      </main>
    </div>
  );
}

```

### <now-playing/page.js>

```jsx
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
    throw new Error("api 못 불러왔다");
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

```

### <결과물>
홈
![image](https://github.com/user-attachments/assets/b5c204a0-1336-4f25-9568-8cf06c318555)
popular
![image](https://github.com/user-attachments/assets/5e275f35-1715-4b7e-84f6-93c14844fdaf)
now-playing
![image](https://github.com/user-attachments/assets/7fd90111-9cb8-4aa7-b42b-a34a312b1ce0)

## 2. Next.js에서 동적 라우팅 구현하기

### <구조>

```java
app/
│
├── movies/[id]
│   ├── page.js 
│   ├── page.module.css
│
├── popular/
│   ├── page.js 
│   ├── page.module.css
│ 
├── now-playing/
│   ├── page.js 
│   ├── page.module.css
│
├── page.js         
└── layout.js
```

동적 라우팅 페이지 만들기
### <movies/[id]/page.js>

```jsx
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Movie Details",
};

export default async function MovieDetailPage({ params }) {
	const { id } = params

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
			<Link href="/">돌아가기</Link>
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
```

### <now-playing, polular / page.js >

이미지와 제목 부분을 클릭하면 디테일 페이지(동적 라우팅)로 이동할 수 있도록 `Link 태그`로 감싸줬다. 

```jsx
<Link href={`/movies/${movie.id}`}>
  <Image
    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
    alt={movie.title}
    width={200}
    height={300}
  />
  <p>{movie.title}</p>
</Link>
```

추가로 홈에도 똑같이 해줬다.

### <결과물>
![image](https://github.com/user-attachments/assets/9828f2f1-f48d-4b1f-b16a-52bea287d97f)

### <문제>

여기서 돌아가기를 클릭하면 각 페이지로 돌아가게 하고 싶었는데 서버사이드를 유지하면서는 불가능하다.

**방법1)** 클라이언트 사이드로 돌려서 `useRouter`을 쓰는 방법

```jsx
import { useRouter } from 'next/router';

function GoBackButton() {
  const router = useRouter();

  const goBack = () => {
    router.back(); // 이전 페이지로 이동
  };

  return (
    <button onClick={goBack}>이전 페이지로 가기</button>
  );
}

export default GoBackButton;
```

방법2) 클라이언트 사이드로 돌려서 `window.history.back()` 쓰기

```jsx
<button onClick={() => window.history.back()}>이전 페이지로 가기</button>
```

서버사이드를 유지하고 싶지만 기능을 쓰고 싶으니 이전 페이지로 가는 버튼을 클라이언트 사이드 컴포넌트로 만들어서 다른 컴포넌트에 넣어주면 되나 싶었는데.. 서버 사이드에서 클라이언트 사이드 컴포넌트를 호출하면 에러가 난다. 불가능 한가보다... 서버사이드, 클라이언트 사이드 이 부분 조금 더 공부가 필요함.

