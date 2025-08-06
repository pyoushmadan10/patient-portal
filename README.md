
# Patient Portal

A full-stack web application for managing patient documents, built with React (Vite) frontend and Node.js/Express backend using Prisma ORM and PostgreSQL.

## Folder Structure

```
patient-portal/
│
├── backend/
│   ├── package.json
│   ├── .env
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── generated/
│   │   └── prisma/ (if custom output used)
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   └── document.controller.js
│       ├── middleware/
│       │   └── multer.middleware.js
│       └── routes/
│           └── document.routes.js
│
└── frontend/
    ├── package.json
    ├── README.md
    └── src/
        └── ... (React components and assets)
```

## Backend

### Main Packages Used

- Express
- Node.js
- prisma
- @prisma/client
- multer
- dotenv
- react toast for notifications
- lucid-react for icons

### API Routes

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| POST   | `/api/documents/upload` | Upload a new document             |
| GET    | `/api/documents`        | List all documents                |
| GET    | `/api/documents/:id`    | Download a document by ID         |
| DELETE | `/api/documents/:id`    | Delete a document by ID           |

### Sample `.env` file

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
```

Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your actual PostgreSQL credentials.

## Frontend

### Main Packages Used

- react
- vite
- axios (for API requests)


### Features

- Upload documents
- View document list
- Download and delete documents

## Setup Instructions

### Backend

1. Install dependencies:
   ```
   cd backend
   npm install
   ```
2. Configure `.env` with your database credentials.
3. Run Prisma migrations:
   ```
   npx prisma migrate dev
   ```
4. Generate Prisma client:
   ```
   npx prisma generate
   ```
5. Start the server:
   ```
   npm start
   ```

### Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
