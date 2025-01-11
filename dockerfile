# Stage 1: Build Stage
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사
COPY package*.json prisma/schema.prisma ./

# 모든 종속성 설치 (devDependencies 포함)
RUN npm install --production=false

# Prisma 클라이언트 생성
RUN npx prisma generate

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 결과물만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# 로그 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/dist/logs && chown -R appuser:appgroup /app/dist/logs

# 실행 사용자 추가
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main"]
