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
WORKDIR /app
COPY --from=build-env /app/out .

# Expose the port Render expects (Render sets the PORT env var)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Start the application and bind to the dynamic port provided by Render
ENTRYPOINT ["sh", "-c", "dotnet ConvertHub.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
