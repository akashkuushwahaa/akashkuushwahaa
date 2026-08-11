FROM node:lts AS build

WORKDIR /app

# Copy the manifests first so dependency installs stay cached across code edits.
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
