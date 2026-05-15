# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

COPY ConvertHub.Api.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# ─────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0

# ── System packages ───────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    # LibreOffice — minimal set for DOCX/XLSX/PPTX → PDF
    libreoffice-core \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    fonts-dejavu \
    fonts-liberation \
    # SkiaSharp native deps (SVG rendering)
    libfontconfig1 \
    libfreetype6 \
    libpng16-16 \
    libx11-6 \
    libxext6 \
    # GDI+ support
    libgdiplus \
    # Ghostscript / poppler (PDF tools)
    ghostscript \
    poppler-utils \
    # FFmpeg (media conversion)
    ffmpeg \
    # ImageMagick (fallback image ops)
    imagemagick \
    # Python + pdf2docx (Word fallback)
    python3 \
    python3-pip \
    python3-venv \
    # Misc shared libs
    libnss3 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# ── Verify soffice is accessible ──────────────────────────────────────────────
RUN which soffice || (echo "soffice not found after install" && exit 1)
RUN soffice --version || (echo "soffice failed to run" && exit 1)

# ── Python venv + pdf2docx (fallback Word engine) ─────────────────────────────
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir pdf2docx

# ── App ───────────────────────────────────────────────────────────────────────
WORKDIR /app
COPY --from=build-env /app/out .

# Create temp upload directory
RUN mkdir -p /app/TempUploads && chmod 777 /app/TempUploads

ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "dotnet ConvertHub.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
