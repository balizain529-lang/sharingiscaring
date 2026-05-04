FROM node:20-slim

# Install Chrome (Remotion render), FFmpeg (mix-audio + auto-trim), Inter fonts
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-inter \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy render server
COPY render-server/package.json render-server/index.js ./

# Copy Remotion project
COPY b-roll-remotion/ ./b-roll-remotion/

# Install render server deps
RUN npm install

# Install Remotion project deps
WORKDIR /app/b-roll-remotion
RUN npm install

WORKDIR /app

ENV PORT=3100
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

EXPOSE 3100

CMD ["node", "index.js"]
