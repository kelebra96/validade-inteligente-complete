FROM node:18.19-alpine3.19

WORKDIR /app

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install

# Copiar código da aplicação
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV VITE_DISABLE_CLIENT=true

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "dev", "--host", "0.0.0.0"]