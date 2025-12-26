# Neura Dynamics Assignment - Document Repository API

A secure, containerized RESTful API for managing a document repository. Users can register, authenticate using JWT, upload documents with metadata, and manage their own documents with strict ownership enforcement.

---

## Features

* **User Authentication**: Register & login with JWT-based authentication
* **Authorization & Privacy**: Strict ownership checks (403 for unauthorized access)
* **Document Management**: Upload, list, update, and delete documents (CRUD operations)
* **File Storage**: Local disk storage using Multer
* **Relational Database**: PostgreSQL with proper foreign keys
* **Containerized Setup**: Docker + docker-compose for API and DB

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **Authentication**: JWT, bcrypt
* **File Uploads**: Multer
* **Real-Time**: WebSockets (ws)
* **Testing**: Jest + Supertest
* **Containerization**: Docker, docker-compose

---

## Project Structure

```
NeuraDynamics/
├── __tests__/
│   └── auth_documents.test.js
├── config/
│   └── db.js
├── controllers/
│   ├── docController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── docRoute.js
│   └── userRoute.js
├── uploads/
├── utils/
│   └── multer.js
├── ws/
│   └── updateStatus.js
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── server.js
```

---

## Database Schema

### Users

* `id` (Primary Key)
* `email` (Distinct)
* `password` (hashed value)
* `created_at`

### Categories

* `id` (Preimary Key)
* `name` (Distinct)

### Documents

* `id` (Primary Key)
* `title`
* `file_path`
* `user_id` (Foreign Key - users.id)
* `category_id` (Foreign Key - categories.id)
* `created_at`

Ownership is enforced using `user_id` in all protected queries.

---

## Containerization (Docker)

### Prerequisites

* Docker Desktop
* Docker Compose

### Setup

```bash
# Build and start services
docker-compose up --build
```

API will be available at:

```
http://localhost:3000
```

---

## Real-Time Upload Status (WebSocket)

A WebSocket endpoint provides real-time upload progress updates.

```
ws://localhost:3000/ws/upload-status
```
This allows clients to receive live feedback during file uploads.
---


## 🛠️ Database Initialization (First Run)

After containers start, initialize tables:

```bash
docker exec -it neura_db psql -U postgres -d neuradb
```

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

---

## API Endpoints

### Authentication

* `POST /auth/register`
* `POST /auth/login`

### Documents (JWT Protected)

* `POST /documents/upload`
* `GET /documents`
* `PATCH /documents/:id`
* `DELETE /documents/:id`

### Sample Request (Upload)

```bash
curl -X POST http://localhost:3000/documents/upload \
  -H "Authorization: Bearer <jwt_token>" \
  -F "title=My Document" \
  -F "categoryId=1" \
  -F "file=file.pdf"
```

---

## Testing

Automated tests are implemented using Jest and Supertest to test user registration & login, document upload by a User A & User B cannot delete User A’s document (403 response).


### Run Tests (LOCAL ONLY)
```bash
  npm test
```
**NOTE: Tests are intended to be run locally, not inside Docker containers.**

---
