# onShift - Backend

The backend is built with Node.js and Express and is responsible for handling all core functionality of the platform. It handles user authentication, job listings, applications, worker and employer profiles, reviews, and CV uploads. The API communicates with a PostgreSQL database and secures protected endpoints with JWT-based authentication.

## Technologies Used

- Node.js
- Express
- PostgreSQL
- Supabase Storage (for CV file uploads)
- JWT Authentication
- bcrypt (for password hashing)
- node-cron (for scheduled tasks)
- multer (for file uploads)

## Requirements

Make sure you have the following installed:

- Node.js (version 18 or higher)
- PostgreSQL

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/on-shift.git
```

2. Navigate to the backend directory:

```bash
cd backend
```

3. Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5001
```

### Database Setup

This project uses PostgreSQL hosted on [Neon](https://neon.tech).

1. Create a new project on Neon and copy the connection string to your `.env` file as `DATABASE_URL`

2. Run the schema to create all tables. The schema file is located at: `backend/schema.sql`

## Supabase Storage Setup

This project uses [Supabase Storage](https://supabase.com) for CV file uploads.

1. Create a new project on Supabase
2. Create a private storage bucket named `cvs`
3. Copy your project URL and service role key to your `.env` file as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Run Locally

```bash
npm run dev
```

The server starts on `http://localhost:5001`.

### Scheduled Tasks

On server start and every day at midnight, the following tasks run automatically:

- Jobs with a passed date are closed (`status = 'closed'`)
- Pending applications on expired jobs are rejected (`status = 'rejected'`)

### File Uploads

- CV uploads are stored in Supabase Storage
- Supported file format: PDF
- Signed URLs are used to securely access uploaded CVs

## Project Structure

```
backend/
└── src/
    ├── controllers/        # Request handlers
    │   ├── authController.ts
    │   ├── workersController.ts
    │   ├── employersControllers.ts
    │   └── jobsController.ts
    ├── middleware/         # Express middleware
    │   └── auth.ts         # JWT authentication middleware
    ├── routes/             # API route definitions
    │   ├── auth.ts
    │   ├── workers.ts
    │   ├── employers.ts
    │   └── jobs.ts
    ├── db.ts               # PostgreSQL connection pool
    ├── supabase.ts         # Supabase client
    ├── scheduledTasks.ts   # Cron jobs
    └── index.ts            # Entry point
```

## Authentication

- Protected endpoints require a valid JWT token in the `Authorization` header: `Bearer <token>`
- Tokens are issued on login and expire after 8 hours (or 30 days with "remember me")
- Role-based access control ensures workers cannot access employer endpoints and vice versa

## API Endpoints

### Auth

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| POST   | `/api/auth/register` | Register a new user (worker or employer) |
| POST   | `/api/auth/login`    | Login                                    |

### Workers

| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| GET    | `/api/workers/profile/me`           | Get logged in worker profile |
| GET    | `/api/workers/profile/:id`          | Get worker profile by ID     |
| GET    | `/api/workers/profile/:id/reviews`  | Get worker reviews by ID     |
| PATCH  | `/api/workers/profile/contact`      | Update contact information   |
| PATCH  | `/api/workers/profile/bio`          | Update bio                   |
| PATCH  | `/api/workers/profile/experience`   | Update experience            |
| PATCH  | `/api/workers/profile/education`    | Update education             |
| PATCH  | `/api/workers/profile/roles`        | Update roles                 |
| PATCH  | `/api/workers/profile/availability` | Update availability          |
| PATCH  | `/api/workers/availability`         | Toggle availability status   |
| GET    | `/api/workers/saved-jobs`           | Get saved jobs               |
| POST   | `/api/workers/saved-jobs`           | Save a job                   |
| DELETE | `/api/workers/saved-jobs`           | Unsave a job                 |
| GET    | `/api/workers/applications`         | Get applications             |
| POST   | `/api/workers/applications`         | Apply for a job              |
| DELETE | `/api/workers/applications/:id`     | Delete an application        |
| GET    | `/api/workers/recommended-jobs`     | Get recommended jobs         |
| GET    | `/api/workers/saved-employers`      | Get saved employers          |
| POST   | `/api/workers/saved-employers`      | Save an employer             |
| DELETE | `/api/workers/saved-employers`      | Unsave an employer           |
| GET    | `/api/workers/reviews`              | Get worker reviews           |
| POST   | `/api/workers/reviews`              | Create a review              |
| POST   | `/api/workers/cv`                   | Upload CV                    |
| GET    | `/api/workers/cv/url`               | Get signed CV URL            |
| DELETE | `/api/workers/cv`                   | Delete CV                    |

### Employers

| Method | Endpoint                                 | Description                            |
| ------ | ---------------------------------------- | -------------------------------------- |
| GET    | `/api/employers/profile/me`              | Get logged in employer profile         |
| PATCH  | `/api/employers/profile/contact`         | Update contact information             |
| PATCH  | `/api/employers/profile/description`     | Update description                     |
| GET    | `/api/employers/profile/:id`             | Get employer profile by ID             |
| GET    | `/api/employers/profile/:id/jobs`        | Get public job listings by employer ID |
| GET    | `/api/employers/profile/:id/reviews`     | Get employer reviews by ID             |
| GET    | `/api/employers/jobs`                    | Get all job listings                   |
| POST   | `/api/employers/jobs`                    | Create a job listing                   |
| GET    | `/api/employers/jobs/:id`                | Get job details by ID                  |
| PUT    | `/api/employers/jobs/:id`                | Update a job listing                   |
| PATCH  | `/api/employers/jobs/:id/close`          | Close a job listing                    |
| PATCH  | `/api/employers/jobs/:id/reopen`         | Reopen a job listing                   |
| GET    | `/api/employers/applications`            | Get all applications                   |
| PATCH  | `/api/employers/applications/:id/hire`   | Hire an applicant                      |
| PATCH  | `/api/employers/applications/:id/reject` | Reject an applicant                    |
| GET    | `/api/employers/workers`                 | Get all available workers              |
| GET    | `/api/employers/workers/random`          | Get random workers                     |
| GET    | `/api/employers/workers/:id/cv-url`      | Get signed CV URL for a worker         |
| GET    | `/api/employers/saved-workers`           | Get saved workers                      |
| POST   | `/api/employers/saved-workers`           | Save a worker                          |
| DELETE | `/api/employers/saved-workers`           | Unsave a worker                        |
| GET    | `/api/employers/reviews`                 | Get employer reviews                   |
| POST   | `/api/employers/reviews`                 | Create a review                        |

### Jobs

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | `/api/jobs`     | Get all public job listings |
| GET    | `/api/jobs/:id` | Get job details by ID       |
