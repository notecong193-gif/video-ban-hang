FROM node:20-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip git ffmpeg libsndfile1 ca-certificates \
    libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx remotion browser ensure

COPY requirements.txt ./
RUN python3 -m pip install --break-system-packages -r requirements.txt
RUN git clone --depth 1 https://github.com/pnnbao97/VieNeu-TTS.git /tmp/VieNeu-TTS \
    && python3 -m pip install --break-system-packages -e /tmp/VieNeu-TTS

COPY . .
RUN mkdir -p /app/out /app/public

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "uvicorn api_server:app --host 0.0.0.0 --port ${PORT}"]
