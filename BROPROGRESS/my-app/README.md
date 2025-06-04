# BrosTracker

A full-stack application for tracking personal and group progress, built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Workspace management
- Progress tracking
- Real-time updates
- Responsive design
- Docker support

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Chakra UI
- React Query

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL
- Docker (optional)

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd brostracker
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration

4. Start the development servers:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Docker Development

1. Build and start the containers:
```bash
npm run docker:up
```

2. Stop the containers:
```bash
npm run docker:down
```

## Project Structure

```
brostracker/
├── frontend/           # React frontend
├── backend/           # Node.js/Express backend
├── docker-compose.yml # Docker configuration
└── package.json      # Root package.json
```

## Available Scripts

- `npm start` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm test` - Run tests for both frontend and backend
- `npm run lint` - Run ESLint for both frontend and backend
- `npm run format` - Format code with Prettier
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run docker:build` - Build Docker containers

## API Documentation

The API documentation is available at `http://localhost:5000/api-docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
