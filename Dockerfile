FROM node:slim
WORKDIR /app
COPY . .
EXPOSE 3001
ENTRYPOINT npm run docker