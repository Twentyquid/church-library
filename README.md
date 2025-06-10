# Church Book Library

Church Book Library is an electronic library web application focused on providing access to a curated collection of Christian books and spiritual classics. The project aims to make timeless Christian literature easily accessible to readers, church members, and seekers worldwide.

## Features

- Browse a featured selection of Christian books
- View book details, including cover, author, and description
- Responsive and user-friendly interface
- Backend API for managing books
- Easy integration with cloud storage for book content

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL
- **Storage:** Supabase (for book files and covers)

## Getting Started

### Prerequisites

- Docker & Docker Compose

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/churchBookLibrary.git
   cd churchBookLibrary
   ```

2. **Configure environment variables:**

   - Copy the example environment files and update them with your settings:
     ```bash
     cp backend/.env.example backend/.env
     cp app/.env.example app/.env
     ```
   - Edit `backend/.env` and `app/.env` as needed.

3. **Run the application with Docker Compose:**

   ```bash
   docker compose up --build
   ```

   This will start the backend, frontend, and database containers with the configured environments.

## Project Structure

```
churchBookLibrary/
├── backend/      # Node.js/Express API and database utilities
├── app/          # React frontend application
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or new features.

## License

This project is licensed under the MIT License.

---

_Empowering the church with timeless Christian literature._
