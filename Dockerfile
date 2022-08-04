FROM node:slim
WORKDIR /home
COPY . .
RUN npm install
EXPOSE 3001
ENTRYPOINT npm run docker