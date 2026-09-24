# Movie Content Management System

A full-stack movie content management application built with **Spring Boot**, **Angular**, and **PostgreSQL**.

The application allows users to search for movies using the **OMDb API**, import movie metadata into a personal library, and manage saved movies through a simple web interface.

---

## Live Demo

### Frontend
https://movie-content-ui.onrender.com

### Backend API
https://movie-content-management.onrender.com/api/contents

### GitHub Repository
https://github.com/ahmetxars/movie-content-management

---

## Features

- Search movies by title using the OMDb API
- Display movie information including:
  - Title
  - Release year
  - Genre
  - IMDb rating
  - Director
  - Plot
  - Poster
- Add movies to the library
- Store movie data in PostgreSQL
- List saved movies
- Edit saved movie information
- Delete movies
- REST API communication between frontend and backend
- Centralized exception handling
- CORS configuration
- Responsive Angular interface
- Cloud deployment using Render

---

## Tech Stack

### Backend

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- Lombok
- Docker

### Frontend

- Angular 21
- TypeScript
- SCSS
- Angular Forms
- Angular HttpClient
- RxJS

### External Services

- OMDb API
- Render Web Service
- Render Static Site
- Render PostgreSQL

---

## Project Structure

The project contains separate backend and frontend applications.

```text
movie-content-management/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── ui/
    ├── src/
    ├── angular.json
    └── package.json
```

---

## Application Architecture

```text
User
  |
  v
Angular Frontend
  |
  | REST API
  v
Spring Boot Backend
  |
  +----------> PostgreSQL
  |
  +----------> OMDb API
```

The Angular frontend communicates with the Spring Boot backend through REST APIs.

The backend is responsible for:

- Business logic
- PostgreSQL database operations
- OMDb API integration
- Error handling
- Movie import operations

---

## Backend Architecture

The backend uses a layered architecture.

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
PostgreSQL
```

Additional packages are used for specific responsibilities.

```text
client
OMDb API communication

dto
External API data transfer

entity
Database entities

exception
Custom exceptions and global exception handling

config
Application configuration such as CORS
```

---

## API Endpoints

Base URL:

```text
https://movie-content-management.onrender.com/api/contents
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contents` | Get all saved movies |
| GET | `/api/contents/{id}` | Get a saved movie by ID |
| POST | `/api/contents` | Create a movie manually |
| PUT | `/api/contents/{id}` | Update a saved movie |
| DELETE | `/api/contents/{id}` | Delete a saved movie |
| GET | `/api/contents/search?title={title}` | Search a movie using OMDb |
| POST | `/api/contents/import?title={title}` | Import an OMDb movie into PostgreSQL |

---

## Example API Requests

### Get all saved movies

```http
GET /api/contents
```

### Search for a movie

```http
GET /api/contents/search?title=Interstellar
```

The backend sends a request to the OMDb API and returns the movie information.

### Import a movie

```http
POST /api/contents/import?title=Interstellar
```

The backend retrieves the movie information from OMDb and saves it to PostgreSQL.

### Update a movie

```http
PUT /api/contents/1
```

### Delete a movie

```http
DELETE /api/contents/1
```

---

## Database

The application uses PostgreSQL for persistent storage.

A saved movie contains fields such as:

```text
id
title
year
genre
rating
plot
poster
director
createdAt
```

Spring Data JPA and Hibernate are used to communicate with PostgreSQL.

---

## OMDb Integration

The backend communicates with the OMDb API to retrieve movie metadata.

The user searches for a movie title from the Angular frontend.

The request flow is:

```text
Angular
   |
   v
Spring Boot
   |
   v
OMDb API
```

The returned movie information can then be imported into the PostgreSQL database.

---

## Running the Project Locally

### Requirements

Make sure the following tools are installed:

- Java 21
- Node.js
- npm
- Docker
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/ahmetxars/movie-content-management.git

cd movie-content-management
```

---

## 2. Start PostgreSQL

Go to the backend directory:

```bash
cd backend
```

Start PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

Local PostgreSQL configuration:

```text
Database: moviedb
Port: 5432
Username: movieuser
Password: moviepass
```

These credentials are intended only for local development.

---

## 3. Configure the OMDb API Key

Create an API key from:

https://www.omdbapi.com/

Then define the API key as an environment variable.

On macOS or Linux:

```bash
export OMDB_API_KEY=your_omdb_api_key
```

---

## 4. Start the Spring Boot Backend

From the `backend` directory:

```bash
./mvnw spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

The API is available at:

```text
http://localhost:8080/api/contents
```

---

## 5. Start the Angular Frontend

Open another terminal.

Go to the frontend directory:

```bash
cd ui
```

Install dependencies:

```bash
npm install
```

Start Angular:

```bash
npm start
```

The frontend will run at:

```text
http://localhost:4200
```

---

## Environment Variables

The backend supports the following environment variables:

| Variable | Description |
|---|---|
| `OMDB_API_KEY` | OMDb API key |
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `PORT` | Backend server port |

Example:

```text
DB_URL=jdbc:postgresql://hostname:5432/database

DB_USERNAME=database_user

DB_PASSWORD=database_password

OMDB_API_KEY=your_api_key

CORS_ALLOWED_ORIGINS=http://localhost:4200
```

Sensitive values such as database passwords and API keys should not be committed to source control.

---

## Deployment

The application is deployed using Render.

### Backend

The Spring Boot backend is containerized using Docker and deployed as a Render Web Service.

```text
https://movie-content-management.onrender.com
```

Backend API:

```text
https://movie-content-management.onrender.com/api/contents
```

### Frontend

The Angular application is deployed as a Render Static Site.

```text
https://movie-content-ui.onrender.com
```

### Database

The production database uses Render PostgreSQL.

---

## Error Handling

The backend includes centralized exception handling.

Handled cases include:

- Movie not found in OMDb
- Saved content not found by ID
- Invalid API requests

Instead of exposing raw backend exceptions, the application returns structured HTTP error responses.

Example:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Movie not found"
}
```

---

## CORS

The backend contains a CORS configuration that allows the Angular frontend to communicate with the REST API.

The allowed origins can be configured using:

```text
CORS_ALLOWED_ORIGINS
```

This makes it possible to use different frontend URLs for local development and production deployment.

---

## Docker

The backend contains a Dockerfile for cloud deployment.

It uses Java 21 and creates the Spring Boot executable JAR before starting the application.

The project also contains a Docker Compose configuration for running PostgreSQL locally.

---

## Current Functionality

The application currently supports the following full flow:

```text
Search Movie
     |
     v
OMDb API
     |
     v
Display Movie
     |
     v
Add to Library
     |
     v
PostgreSQL
     |
     v
List Saved Movies
     |
     +---- Edit
     |
     +---- Delete
```

---

## Future Improvements

Possible future improvements include:

- User authentication and authorization
- Personal user accounts
- Favorites
- Watchlists
- Pagination
- Search filters
- Genre filters
- Sorting
- Duplicate movie prevention
- Dedicated movie detail pages
- Unit tests
- Integration tests
- Swagger / OpenAPI documentation
- Environment-specific Angular configuration
- Improved loading states
- Improved mobile UI

---

## Author

**Ahmet Arslan**

GitHub:

https://github.com/ahmetxars
