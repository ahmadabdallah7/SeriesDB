# SeriesDB

SeriesDB is a full-stack web application that allows users to search for TV shows and organize them into personalized lists such as Favorites, Watchlist, Watching, and Watched.
The application uses an external public API to retrieve show information and provides user authentication so every user can maintain their own collections.

## Screenshots

<img width="1826" height="944" alt="SeriesDB 1" src="https://github.com/user-attachments/assets/8ed2fd29-e74e-4a9c-ae42-2a3e7d0fc6c3" />
<img width="1785" height="942" alt="SeriesDB 2" src="https://github.com/user-attachments/assets/ea061917-4f14-4ebe-9b41-84c475ed2038" />
<img width="1758" height="942" alt="SeriesDB 3" src="https://github.com/user-attachments/assets/b3f8fcb3-4fe6-4465-ba3f-62bbfca20f3d" />
<img width="1777" height="946" alt="SeriesDB 4" src="https://github.com/user-attachments/assets/6f301e70-35c8-4419-aca2-8c666e7f11d7" />
<img width="1755" height="944" alt="SeriesDB 5" src="https://github.com/user-attachments/assets/3b4e6ff8-9bb3-49bd-ba04-21d2ec43aeeb" />
<img width="1793" height="943" alt="SeriesDB 6" src="https://github.com/user-attachments/assets/36647f95-02e3-4954-b72c-d637e75ccff1" />
<img width="1867" height="944" alt="SeriesDB 7" src="https://github.com/user-attachments/assets/33631222-0059-4c8e-9e40-abaee4c8809f" />
<img width="1867" height="941" alt="SeriesDB 8" src="https://github.com/user-attachments/assets/90ee8685-a572-4457-ac9d-ae173349b902" />

---

## Features

### Search TV Shows

- Search for any TV show using an external API.
- View show details including:
  - Poster image
  - Rating
  - Genres
  - Status
  - Summary

### User Authentication

- User registration and login.
- Passwords securely hashed using bcrypt.
- Session-based authentication using Passport.js.

### Favorites

- Add shows to your favorites list.
- Remove shows from favorites.
- Favorites are stored per user.

### Watchlist

- Save shows you plan to watch later.
- Remove shows from your watchlist.

### Watching

- Track shows you are currently watching.
- Move shows between lists when appropriate.

### Watched

- Keep a record of completed shows.
- Remove shows from your watched list.

### User Feedback

- Snackbar notifications for:
  - Successful actions
  - Errors
  - Authentication messages

### Responsive Design

- Mobile-friendly layout using Bootstrap and Material UI.
- Responsive navigation and show cards.

---

## Tech Stack

### Frontend

- React
- Next.js
- Axios
- Bootstrap 5
- Material UI (MUI)

### Backend

- Node.js
- Express.js
- Passport.js
- Express Session
- bcrypt

### Database

- PostgreSQL

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ahmadabdallah7/SeriesDB
cd SeriesDB
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file for the backend:

```env
USER="your_database_user"
PASSWORD="your_database_password"
HOST="localhost"
PORT="5432"
DATABASE="SeriesDB"
SESSION_SECRET="your_secret_key"
```

### 4. Database Schema

The application uses PostgreSQL to store user accounts and personalized show lists.

### Main Tables

#### users

Stores registered user accounts.

| Column   | Type               |
| -------- | ------------------ |
| id       | SERIAL PRIMARY KEY |
| email    | VARCHAR            |
| password | VARCHAR            |

#### favorites, watching, watched and watchlist

Stores users' lists of TV shows.

| Column    | Type               |
| --------- | ------------------ |
| id        | SERIAL PRIMARY KEY |
| user_id   | INTEGER            |
| show_id   | INTEGER            |
| show_name | VARCHAR            |
| status    | VARCHAR            |
| genres    | TEXT[]             |
| rating    | FLOAT              |
| summary   | TEXT               |
| image_url | TEXT               |

Each list table is linked to a user through the `user_id` field.

---

## Running the Application

### Start the backend server

```bash
npm run server
```

### Start the frontend

```bash
npm run client
```

The frontend will run on:

```text
http://localhost:3001
```

The backend will run on:

```text
http://localhost:3000
```

---

## Possible Future Improvements

- User profiles
- Show recommendations
- Search history
- Statistics dashboard
- User reviews and ratings

---

This project is for my personal portfolio purposes.
https://github.com/ahmadabdallah7
https://www.linkedin.com/in/ahmadabdallah7
