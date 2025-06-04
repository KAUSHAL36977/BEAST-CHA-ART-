# BrosTracker Backend

A Node.js/Express backend for the BrosTracker application, providing API endpoints for user management, authentication, and workspace functionality.

## Features

- User authentication with JWT
- User management (CRUD operations)
- Workspace management
- Error handling middleware
- Database integration with Prisma
- API documentation with Swagger

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/brostracker"
JWT_SECRET="your-secret-key"
PORT=5000
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The server will be running at `http://localhost:5000`.

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID
- PATCH `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user
- GET `/api/users/:id/workspaces` - Get user's workspaces

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── app.js          # Express application setup
├── prisma/             # Prisma schema and migrations
├── server.js           # Entry point
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Run the server in development mode
- `npm start` - Run the server in production mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 