## 도커를 활용한 리액트 앱 배포하기

리액트 프로젝트를 복사해서 시작 

→ 잘 실행 되는지 확인 후 `rm -rf node_modules` 로 노드 모듈 폴더 삭제

### &lt;Dockerfile&gt;

```dockerfile
# 이미지
FROM node:16 AS build

# 작업 디렉토리
WORKDIR /app

# 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

#소스 코드 복사
COPY . ./

#실행
CMD ["npm", "run", "start"]
```

### <docker-compose.yml>

```yaml
services:
  react-app:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_MOVIE_DB_API_KEY=${REACT_APP_MOVIE_DB_API_KEY}
```

> 💡 **만약 docker-compose를 안 쓸 때**
>> `docker build -t my-react-app .` - 이미지 빌드 <br/>
>> `docker run -p 3000:3000 my-react-app` - 포드연결, 컨테이너 실행

<br/>

#### <에러>

```
❌ Cannot connect to the Docker daemon at unix:///Users/mag/.docker/run/docker.sock. Is the docker daemon running?
```


- Docker Desktop 앱을 실행해야 Docker Daemon이 시작됨.
<br/>

### <실행>

빌드 및 실행 - `docker-compose up --build`

네트워크, 컨테이너 정리 - `docker-compose down`

<br/>

### <결과물>
동일하게 잘 실행됨
![image](https://github.com/user-attachments/assets/15d054a6-31b4-4472-9df3-da6427c207a3)
![image](https://github.com/user-attachments/assets/e60adc05-8d7d-4f71-a6d1-8b3b7a627f41)

도커 데스크탑 앱에서 빌드, 실행되는 것을 확인
![image](https://github.com/user-attachments/assets/3cc071f5-b2bd-4075-8645-a1b8ccfb0b81)





