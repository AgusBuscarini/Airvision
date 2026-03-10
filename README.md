# AirVision ✈️

AirVision is a web platform that visualizes aircraft positions in real time using data from the OpenSky Network API.

The project consists of a backend built with Spring Boot and a frontend built with React, displaying aircraft data on an interactive map.

## Project Showcase

[![AirVision Demo](https://img.youtube.com/vi/DMg6GLUva5g/0.jpg)](https://www.youtube.com/watch?v=DMg6GLUva5g)

---

## Features

- Real-time flight visualization
- Interactive map using Leaflet
- Backend REST API
- Airline and flight management
- User authentication
- PostgreSQL database
- Dockerized environment

---

## Tech Stack

Backend
- Java
- Spring Boot
- JPA / Hibernate
- PostgreSQL

Frontend
- React
- TypeScript
- Leaflet

Infrastructure
- Docker
- REST APIs
- OpenSky Network API

---

## Architecture
React Frontend
↓
Spring Boot REST API
↓
PostgreSQL Database
↓
External API (OpenSky Network)

---

## Project Structure
airvision
│
├── backend
│ ├── controller
│ ├── service
│ ├── repository
│ └── model
│
├── frontend
│ ├── components
│ ├── pages
│ └── services
│
├── docker-compose.yml
└── README.md

---

## Running the Project

Clone the repository:
```bash
git clone https://github.com/agusbuscarini/airvision
```

Start the application using Docker:
```bash
docker compose up
```

Backend will run on:
http://localhost:8080

Frontend will run on:
http://localhost:3000

---

## Future Improvements

- Advanced flight statistics
- Airline management features
- Premium analytics dashboard
- Improved real-time updates

---

## Author

Agustín Buscarini

Backend Developer  
Java • Spring Boot • React • PostgreSQL
