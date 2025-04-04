FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as build
WORKDIR /app

# Copy csproj and restore distinct layers
COPY *.sln .
COPY DigiyatraController/*.csproj ./DigiyatraController/
RUN dotnet restore

# Copy and build app
COPY DigiyatraController/. ./DigiyatraController/
WORKDIR /app/DigiyatraController
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 as runtime
WORKDIR /app
COPY --from=build /app/DigiyatraController/out ./
ENTRYPOINT ["dotnet", "DigiyatraController.dll"]