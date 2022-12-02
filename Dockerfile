FROM node:18.11.9

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8800
CMD ["npm", "run", "dev"]