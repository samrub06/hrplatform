FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/sequelize ./src/sequelize
COPY start.sh /start.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

RUN chmod +x /start.sh

CMD ["/start.sh"]