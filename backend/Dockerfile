# Use the official .NET 9.0 SDK as the build image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# Copy the project file and restore dependencies
COPY ConvertHub.Api.csproj ./
RUN dotnet restore

# Copy the remaining source code and build the application
COPY . ./
RUN dotnet publish -c Release -o out

# Use the official .NET 9.0 runtime as the final image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
RUN apt-get update && apt-get install -y \
    ffmpeg \
    ghostscript \
    libgdiplus \
    libreoffice \
    poppler-utils \
    imagemagick \
    python3 \
    python3-pip \
    python3-venv \
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
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install pdf2docx

WORKDIR /app
COPY --from=build-env /app/out .

# Expose the port Render expects (Render sets the PORT env var)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Start the application and bind to the dynamic port provided by Render
ENTRYPOINT ["sh", "-c", "dotnet ConvertHub.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
