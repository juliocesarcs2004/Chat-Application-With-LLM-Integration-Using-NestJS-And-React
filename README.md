# AIChat: Chat Application with LLM Integration using NestJS and React

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Backend API Endpoint](#backend-api-endpoint)
- [Bonus Features Implemented](#bonus-features-implemented)

## Project Overview

The application allows users to interact with an AI assistant specialized in front-end development. Users can type questions into a chat interface, and the AI (powered by Google Gemini) will provide relevant answers. The backend handles the LLM interaction and business logic, while the frontend provides a user-friendly chat experience.

## Features

- **Interactive Chat Interface**: Clean and responsive UI built with React and Vite.
- **LLM Integration**: Utilizes Google Gemini (`gemini-1.5-flash-latest`) for generating answers.
- **Domain-Specific Expertise**: The AI is prompted to act as an expert in "Front-end Development Best Practices."
- **Real-time "Bot is typing..." Indicator**: Provides user feedback during response generation.
- **Robust Input Validation**: Backend validation ensures messages are not empty.
- **Graceful Error Handling**: Handles API errors, network issues, and validation failures.
- **Modern Frontend Tooling**: Uses Vite for a fast development experience.
- **Secure by Design**: API keys and sensitive logic are kept strictly on the backend.
- **Rate Limiting**: Backend includes rate limiting (5 requests per minute per IP) to protect resources.
- **Containerized Backend**: Includes a multi-stage `Dockerfile` for easy deployment.

## Technology Stack

- **Frontend**:
  - React 18+ (with Hooks)
  - TypeScript
  - Vite (for development and bundling)
  - `fetch` API for HTTP requests
- **Backend**:
  - NestJS (Node.js framework)
  - TypeScript
  - `@google/genai` SDK for Gemini API
  - `class-validator` & `class-transformer`
  - `@nestjs/config` for environment variable management
  - `@nestjs/throttler` for rate limiting
- **Containerization**:
  - Docker


## Project Structure

├── backend/                  # NestJS backend application
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile            # Dockerfile for backend
│   └── package.json
├── frontend/                 # React frontend application (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.development
│   ├── index.html
│   └── package.json
└── README.md                 # This file


## Prerequisites

- **Node.js**: Version 18.x or later.
- **npm** (or **yarn**).
- **Docker** (Optional, for running the backend in a container).
- **Google Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Setup and Installation

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    -   Create a `.env` file from the example: `cp .env.example .env`
    -   Open `.env` and add your details:
        ```env
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        PORT=3000
        CLIENT_URL=http://localhost:5173
        NODE_ENV=development
        ```

### Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables** (optional, defaults are provided):
    -   The frontend comes with a `.env.development` file:
        ```env
        VITE_BACKEND_URL=http://localhost:3000
        ```
    -   This file is used by Vite during development. No changes are needed if your backend runs on `localhost:3000`.

## Running the Application

You need to run both the backend and frontend servers.

### 1. Start the Backend

-   **Navigate to the `backend/` directory** and run:
    ```bash
    npm run start:dev
    ```
-   The backend will start on `http://localhost:3000`.

### 2. Start the Frontend

-   **Open a new terminal window.**
-   **Navigate to the `frontend/` directory** and run:
    ```bash
    npm run dev
    ```
-   The frontend will be available at `http://localhost:5173`.

### 3. Open the App

-   Open your browser and go to **`http://localhost:5173`**.

## Backend API Endpoint

-   **`POST /chat`**: Receives a message and returns an AI-generated reply.
    -   **Request Body**: `{ "message": "string" }`
    -   **Success Response (200 OK)**: `{ "reply": "string" }`
    -   **Error Responses**: `400 Bad Request`, `429 Too Many Requests`, `500 Internal Server Error`.

## Bonus Features Implemented

-   **Rate Limiting**: The backend limits requests to 5 per minute per IP.
-   **Dockerfile**: A production-ready, multi-stage `Dockerfile` is included for the backend, making it easy to containerize and deploy.
