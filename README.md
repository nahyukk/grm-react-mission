## TypeScript로 영화 목록 확인 앱 리팩토링하기

TypeScript를 사용하여 영화 목록 확인 앱을 리팩토링하고, 컴포넌트의 Props와 상태에 타입을 명시하여 코드의 안정성을 확보합니다. TypeScript로 리팩토링된 영화 목록 확인 앱 코드와 실행 결과 스크린샷을 결과물로 제출합니다.

기존 리액트 부분에서 만든 영화 앱으로 리팩토링한다.

- 폴더를 복사해와서 package.json에서 name 살짝 변경 후 `npm install`
- 잊지 말고 `.env` 파일 다시 만들기

### <TypeScript 설정>

`npm install typescript @types/react @types/react-dom @types/node`

- **`typescript`**: TypeScript 컴파일러.
- **`@types/react` 및 `@types/react-dom`**: React와 DOM 관련 타입 정의.
- **`@types/node`**: Node.js 관련 타입 정의.

`npx tsc --init` → tsconfig.json 파일 생성


**파일 확장자 변경** 

`.js` → `.tsx`

`mv src/App.js src/App.tsx` , `mv src/components/MovieList.js src/components/MovieList.tsx` : 이런 식으로 하면 된다.

### <타입 적용>



### <type.ts 새로 만들기>

```tsx
export type Movie = {
  id: number;
  title: string;
  poster_path: string; // 에러 보고 늦게 추가함
  release_date: string;
  vote_average: number;
};

export type MovieApiResponse = {
  results: Movie[];
};
```

`Property 'poster_path' does not exist on type 'Movie'.`

`poster_path: string;` 추가 해줌

에러를 하나씩 처리해 나간다는 느낌으로 진행했다.

1. 전체적으로 `<LanguageContext.Provider>` 같은 태그는 JSX 문법이다. ts에서 사용할 수 없는 에러가 난다. 
    
    ```tsx
    "Cannot use JSX unless the '--jsx' flag is provided."
    ```
    
    이를 허용하기 위해  tsconfig.json에서  `"jsx": "react-jsx",`  추가
    

1. 기본 프로젝트 파일 뿐 아니라 config.js, reportWebVitals.js 등 파일도 ts로 변경해줘야 한다.
    
    해주고 나서 import 부분에 여전히 에러가 나있으면 경로 부분 다시 입력 해주면 된다. (js → ts 이슈)
    

1. 이런 메세지들이 많이 뜬다. undefined일 때 가능성을 처리하기 위해 반환 값을 확인하는 코드가 필요하다.
    
    `Property 'language' does not exist on type 'LanguageContextType | undefined'`.
    

### <config.ts>

```tsx
const API_KEY: string | undefined = process.env.REACT_APP_MOVIE_DB_API_KEY;
const BASE_URL: string = "https://api.themoviedb.org/3";

export { API_KEY, BASE_URL };
```

환경변수가 정의되지 않으면 `undefined`일 수 있으니 `string | undefined`으로 설정

### <App.tsx 리팩토링>

- **`movieId`**: 선택된 영화 ID(`number`) 또는 선택되지 않은 경우(`null`)를 명시

```java
const [movieId, setMovieId] = useState<number | null>(null); 
```

- **`id: number`**: `id`가 숫자임을 명시.
- **`: void`**: 반환값이 없음을 명시.

```java
const handleMovieSelect = (id: number): void => {
    setMovieId(id);
  };

	const handleUnmount = (): void => {
		setMovieId(null);
	}
```

### <MovieList.tsx 리펙토링>

App.ts에서 내려받은 props → `<MovieList onMovieSelect={handleMovieSelect} />`

```tsx
type MovieListProps = {
  onMovieSelect: (id: number) => void;
};
```

- 여기서 `onMovieSelect`는 `id`를 인자로 받고, 반환값이 없는 함수 타입

```tsx
const MovieList: React.FC<MovieListProps> = ({ onMovieSelect }) => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider");
  }

  const { language } = context;

```

- `const MovieList: React.FC<MovieListProps>` : MovieList는 리액트 함수형 컴포넌트고, MovieListProps 타입에 정의된 Props만 받을 수 있다.

- `if (!context)` context가 null 또는 undefined 일 가능성 처리 코드 ⭐꼭 필요함!

```tsx
const [movies, setMovies] = useState<Movie[]>([]);
```

- 초기값은 빈 배열(`[]`)이며, 타입은 `Movie[]`로 정의 (상태에 타입을 명시)

### <MovieItem.tsx >

```tsx
type MovieItemProps = {
  title: string;
  img: string;
  children?: React.ReactNode; 
  onClick: () => void;
};

const MovieItem: React.FC<MovieItemProps> = ({ ~~~
```

설명 위와 동일

### <MovieDetails.tsx>

```tsx
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
```

타입 설정

```tsx
const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onUnmount }) => {
	const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext 에러");
  }

  const { language } = context;

  const [movieDetails, setMovieDetails] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
```

- `MovieDetail`: 영화 세부 정보 객체의 타입.
- `null`: 초기값으로 설정, 데이터가 아직 로드되지 않았음을 의미.

⇒ 초기값은 `null`로 설정되며, 데이터가 로드되면 `MovieDetail` 객체로 업데이트

```tsx
return (
    <div>
      {error ? (
        <div className="error-div">
          <p className="error-message">{error}</p>
          <button onClick={onUnmount}>언마운트</button>
        </div>
      ) **: movieDetails ? (**
        <div>
          <div className="movie-detail-header">
            <h2>{movieDetails.title}</h2>
            <button onClick={onUnmount}>언마운트</button>
          </div>
          <p>{movieDetails.overview}</p>
          <p>개봉일: {movieDetails.release_date}</p>
          <p>평점: {movieDetails.vote_average} / 10</p>
        </div>
			) **: (
				<p>Loading...</p>
      )**}
    </div>
  );
```

movieDetails와 error이 null 가능성을 조건부로 처리

### <ChangeLanguage.tsx>

```tsx
const ChangeLanguage: React.FC = () => {
  const context = useContext(LanguageContext);

	if (!context) {
    throw new Error("ChangeLanguage 에러");
  } // null 인지 확인하는 강제되는 코드

  const { language, toggleLanguage } = context;
```

### <LanguageContext.tsx>

```tsx
type LanguageContextType = {
  language: string;
  toggleLanguage: () => void;
};

export const LanguageContext = createContext<LanguageContextType | undefined>
  (undefined);

	type LanguageProviderProps = {
		children: React.ReactNode;
	};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
```

타입을 명확히! props 타입도!

### <결과물>

리액트 결과물과 동일하게 잘 나온다.
![image](https://github.com/user-attachments/assets/c212f755-875b-4bd8-a439-d52b1259231e)
![image](https://github.com/user-attachments/assets/e7cac540-714c-42b4-8c68-f518a5096892)
![image](https://github.com/user-attachments/assets/136cd11d-1350-4acb-9a43-0fa0d2840559)



### <추가>

리팩토링을 하고 vsCode 상으로는 에러가 안보여서 잘 나오겠지 했는데 WebVitals 에 관한 에러가 떴다.

- `reportWebVitals.js` 파일에 대한 타입 선언 파일이 없기 때문에 발생
- `reportWebVitals.js` → `reportWebVitals.ts`

`npm install web-vitals` 최신 버전 설치했는데 npm error가 떴다. react-scripts와 typescript의 의존성 충돌을 해결 못해서 발생한 문제. =호환성 문제

**<reportWebVitals.ts>**

```tsx
import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
```

**<index.tsx>**

```tsx
const root = ReactDOM.createRoot(document.getElementById('root'));
```

이 부분이 아래 처럼 변경되었다. `document.getElementById` 가 `null`일 가능성을 처리
```tsx
const container = document.getElementById('root');
if (!container) {
  throw new Error("Root container not found. Check your HTML file.");
}

const root = ReactDOM.createRoot(container);
```
