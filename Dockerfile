FROM node:slim
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
ENTRYPOINT npm run docker