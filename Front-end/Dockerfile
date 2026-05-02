FROM node:20-slim
WORKDIR /app
# Solo copiamos el package.json por ahora
COPY package.json ./
RUN npm install
# Copiamos el resto después
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]