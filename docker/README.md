## 1. 비동기 처리 학습 (Async/Await 활용하기)
### <구조>

컴포넌트 1개로 시작

```jsx
src/
│
├── components/
│   └── MovieList.js
│
├── App.js
├── App.css           
└── config.js  
```

### <App.js>

App.js에서는 MovieList만 보여지도록 했다.

```jsx
return (
    <div className="App">
     <MovieList></MovieList>
    </div>
  );
```

### <컴포넌트>

```jsx
import { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../config";

import React from "react";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
  const IMG_URL = "https://image.tmdb.org/t/p/w200";

  useEffect(() => {
    
		fetchMovieData();
  }, []);

	const fetchMovieData = async () => {
		try {
			const response = await fetch(API_URL);
			const data = await response.json();

			setMovies(data.results);
		} catch (error) {
			// 에러 표시 보여주는 코드 작성 예정
		}
	};

  return (
		<div>
			<h1>Popular MovieList</h1>
			<div className="movie-container">
				{movies.map((movie) => (
					<div key={movie.id} className="movie-item">
						<img 
							src={`${IMG_URL}${movie.poster_path}`}
							alt={movie.title}
						/>
						<h3>{movie.title}</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default MovieList;
```

### <결과물>
![image](https://github.com/user-attachments/assets/b5e308b8-b9d3-49a7-8aa1-36b85d834ad4)


## 2. 리액트에서 컴포넌트 재사용성 높이기

### <구조>

```jsx
src/
│
├── components/
│   ├── MovieList.js
│   ├── MovieItem.js 
│
├── App.js
├── App.css           
└── config.js  
```

### <컴포넌트 MovieList.js>

1. margin도 없고, padding도 없고 보기가 영 별로라 css를 추가했다. css는 적당히 썼다.
    
    ```jsx
    import { useEffect, useState } from "react";
    import { API_KEY, BASE_URL } from "../config";
    
    import React from "react";
    import MovieItem from "./MovieItem";
    import "./MovieList.css"
    
    ```
    
2. children prop을 쓸 예정이라 어떤 내용이 있는지 보기 위한 콘솔 로그 (Tip 2 확인)
    
    ```jsx
    const MovieList = () => {
      const [movies, setMovies] = useState([]);
    
      const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
      const IMG_URL = "https://image.tmdb.org/t/p/w200";
    
      useEffect(() => {
        fetchMovieData();
      }, []);
    
      const fetchMovieData = async () => {
        try {
          const response = await fetch(API_URL);
          const data = await response.json();
    			console.log(data.results);
          setMovies(data.results);
    
        } catch (error) {
          // 에러 표시 보여주는 코드 작성 예정
        }
    	 };
    ```
    
3. children prop 사용해 보기
    
    ```jsx
    return (
     	   <div>
     	     <h1>Popular MovieList</h1>
     	     <div className="movie-container">
     	       {movies.map((movie) => (
     	         <MovieItem
     	           key={movie.id}
     	           title={movie.title}
     	           img={`${IMG_URL}${movie.poster_path}`}>
    							<p>{movie.release_date}</p>
    							<p>{movie.vote_average} / 10</p>
    						<	/MovieItem>
     	       ))}
     	     </div>
     	   </div>
     	 );
    };
    
    export default MovieList;
    ```
    

### <컴포넌트 MovieItem.js>

props로 title, img, children을 가지고 와서 return 해준다. 

MovieList에서 title={movie.title}이렇게 props를 내려줬으므로 {movie.title}이 아닌 {title}로 써야된다.

{children} 도 살포시 가져온다.

```jsx
const MovieItem = ({ title, img, children }) => {
  return (
    <div className="movie-item">
      <img src={img} alt={title} />
      <h3 className="movie-title">{title}</h3>
			<div className="movie-details">{children}</div>
    </div>
  );
};

export default MovieItem;
```

### <결과물>
![image](https://github.com/user-attachments/assets/a16b350f-3471-4318-8db0-aec6d8cdcf35)


## 3. React Context를 이용한 글로벌 상태 관리
### <구조>

```jsx
src/
│
├── components/
│   ├── MovieList.js
│   ├── MovieItem.js 
│   ├── LanguageSelector.js 
├── context
│   ├── LanguageContext.js
│
├── App.js
├── App.css           
└── config.js  
```

### <콘텍스트 / LanguageContext.js>

- `createContext`로 `LanguageContext` 생성.
- `LanguageProvider`라는 함수를 만들어 **상태와 변경 함수** 관리. 기본을 `en-US`로 했다.
- `children`을 통해 하위 컴포넌트를 감싸기.
- `LanguageContext`와 `LanguageProvider`를 내보내기.

```jsx
import { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState("en-US");

  const toggleLanguage = () => {
    setLanguage((prevLanguage) =>
      prevLanguage === "en-US" ? "ko-KR" : "en-US"
    );
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

```

App.js 에서 LanguageProvider로 감싸준다. -  toggle 버튼 만들어주려고 헤더도 만들었다.

```jsx
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
```

### <컴포넌트 / ChangeLanguage.js>

일반 button 보다 토글 버튼으로 하고 싶어서 input에 checkbox로 하고 css를 줬다.

```jsx
import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import "./ChangeLanguage.css"

const ChangeLanguage = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <div className="toggle-container">
      <p>{language}</p>
      <label className="toggle-switch">
        <input
          type="checkbox"
          onChange={toggleLanguage}
          checked={language === "en-US"}
        />
				<span className="slider">
          <span className={`text left ${language === "ko-KR" ? "show" : "hide"}`}>
            한글
          </span>
          <span className={`text right ${language === "en-US" ? "show" : "hide"}`}>
            ENG
          </span>
        </span>
      </label>
    </div>
  );
};

export default ChangeLanguage;
```

### <컴포넌트 / MovieList.js > 수정

1. useContext로 LanguageContext 가져오기
2. API_URL에 language 변화 추가해 주기
3. fetchMovieData 함수 안에 넣어서 (원래는 초기에 1회 불러오는 것) 언어를 바꿀 때마다 최신 값으로 반영될 수있도록 한다. (이미지는 정적 값이라 밖에 있는 것이 맞음)
4. useEffect에 의존성 배열 추가

```jsx
const MovieList = () => {
  const { language } = useContext(LanguageContext);
  const [movies, setMovies] = useState([]);

  const IMG_URL = "https://image.tmdb.org/t/p/w200";

 useEffect(() => {
		const fetchMovieData = async () => {
			const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}`;
	
			try {
				const response = await fetch(API_URL);
				const data = await response.json();
				console.log(data.results);
				setMovies(data.results);
			} catch (error) {
				// 에러 표시 보여주는 코드 작성 예정
			}
		};
    fetchMovieData();
  }, [language]);

  
```

### <결과물>
![image](https://github.com/user-attachments/assets/7f331de1-98db-474d-bb28-c46c6914608b)

![image](https://github.com/user-attachments/assets/729654d7-5d8d-4082-8445-2e3c0c98efc3)

![image](https://github.com/user-attachments/assets/36a876bb-7add-4e3d-aa6d-3f16aa4e77af)

## 4. 컴포넌트 라이프사이클 이해하기 (useEffect 활용)

포스터를 클릭하면 디테일 페이지를 마운트 했다가 언마운트 버튼을 누르면 언마운트 되는 것으로 구현.

### <구조>

```jsx
src/
│
├── components/
│   ├── MovieList.js
│   ├── MovieItem.js 
│   ├── MovieDetails.js
│   ├── LanguageSelector.js 
│
├── context
│   ├── LanguageContext.js
│
├── App.js
├── App.css           
└── config.js  
```

### <컴포넌트 / MovieDetails.js>

```jsx
import "./MovieDetails.css"
import React, { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../config";

const MovieDetails = ({ movieId, onUnmount }) => {
  const [movieDetails, setMovieDetails] = useState({});

  useEffect(() => {
		let isMounted = true;
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
        );

        const data = await response.json();
        if (isMounted) {
					setMovieDetails(data)
					console.log("MovieDetails 컴포넌트가 마운트됨");
				};
      } catch (err) {
       
      }
    };

    fetchMovieDetails();
		return () => {
			isMounted = false;
			console.log("MovieDetails 컴포넌트 언마운트됨");
		};
  }, [movieId]);

  return (
    <div>
			<div className="movie-detail-header">
      <h2>{movieDetails.title}</h2>
			<button onClick={onUnmount}>언마운트</button>
			</div>
      <p>{movieDetails.overview}</p>
      <p>개봉일: {movieDetails.release_date}</p>
      <p>평점: {movieDetails.vote_average} / 10</p>
    </div>
  );
};

export default MovieDetails;
```

### <App.js>

movieId를 useState로 받아서 id를 

```
const [movieId, setMovieId] = useState();

  const handleMovieSelect = (id) => {
    setMovieId(id);
  };
```

```jsx
{movieId ? <MovieDetails movieId={movieId} /> : <MovieList onMovieSelect={handleMovieSelect}></MovieList>}
```

### <컴포넌트 / MovieList.js, MovieItem.js>

```jsx
const MovieList = ({ onMovieSelect }) => {

<MovieItem
  key={movie.id}
  title={movie.title}
  img={`${IMG_URL}${movie.poster_path}`}
	onClick={() => onMovieSelect(movie.id)}
>
```

### <결과물>

마운트/ 언마운트 확인을 위해 React Developer Tools로 DOM 요소를 확인함.
첫 화면

![image](https://github.com/user-attachments/assets/754b78be-99ff-4f01-af96-44d7788bd0da)


마운트 된 상태

![image](https://github.com/user-attachments/assets/cb862881-c29a-4f59-9d01-14baee0e3174)


언마운트 된 상태

![image](https://github.com/user-attachments/assets/9f984823-45b0-4235-b0ab-c84a601f7009)

## 5. 리액트 앱에서 에러 처리 및 예외 처리 구현하기
### <MovieDetails.js>

**error 상태 관리**

```jsx
const [error, setError] = useState();
```

확실하게 API 요청 실패되면 에러를 던질 수 있도록 함

```jsx
if (!response.ok) {
          throw new Error("API 요청 실패!");
        }
```

삼항연산자로 error일 때 아닐 때의 ui를 작성함

```jsx
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
```

### <결과물>

![image](https://github.com/user-attachments/assets/c9b6009c-ff4e-47fa-ab28-70e1fa2ba40b)




