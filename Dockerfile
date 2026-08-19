FROM node:20-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip git ffmpeg libsndfile1 ca-certificates \
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

# Start API immediately. VieNeu is only loaded when /render is called.
CMD ["sh", "-c", "uvicorn api_server:app --host 0.0.0.0 --port ${PORT}"]
