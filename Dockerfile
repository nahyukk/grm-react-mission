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