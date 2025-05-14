FROM node:18

# Ορίζουμε working directory
WORKDIR /app

# Αντιγράφουμε τα αρχεία
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

CMD ["node", "index.js"]
