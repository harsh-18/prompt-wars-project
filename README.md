# AeroFlow Intelligence - PromptWars Project

A cutting-edge React web application built for the **Hack2Skill Google Prompt Wars** hackathon as a stadium crowd intelligence MVP. This dashboard simulates real-time stadium crowd density, provides wait-time predictions, and utilizes a dynamic pathfinding algorithm to demonstrate smart navigation for massive sporting venues.

## Cloud Run Deployment

This application is containerized and deployed seamlessly to Google Cloud Run, leveraging GCP credits and infrastructure to scale dynamically.

Cloud Run Service: promptwars-project
- **Live URL:** [https://promptwars-project-i46bvv2psq-ew.a.run.app](https://promptwars-project-i46bvv2psq-ew.a.run.app)

## Key Features

- 🏟️ **Live Crowd Density Maps:** Simulated real-time viewing of density across stadium zones.
- ⏱️ **Wait-Time Predictions:** Intelligent queuing estimates for amenities and exits.
- 🗺️ **Dynamic Pathfinding:** Interactive UI showing optimal crowd redirection.
- 🚀 **High-Performance UI:** Built with React/Vite, featuring rich and modern aesthetic design.

## Development

To run this application locally:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Technologies
- **Frontend**: React, Vite
- **Containerization**: Docker, Nginx
- **Cloud**: Google Cloud Run
