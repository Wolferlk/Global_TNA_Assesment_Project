# Mini Service Request Board

A small full-stack app where homeowners can post service requests and tradespeople can browse, update, or delete them.

## Tech Stack

- Frontend: Next.js App Router
- Backend: Node.js, Express
- Database: MongoDB
- ODM: Mongoose
- Styling: Plain CSS

## Project Structure

```txt
Backend/   Express REST API
Frontend/  Next.js UI
```

## Environment Variables

Create `Backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://sasiofficial25_db_user:99IXD5Ijb86zQLuf@cluster0.yb8drrc.mongodb.net/?appName=Cluster0
FRONTEND_URL=http://localhost:3000
```

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Setup

Install dependencies:

```bash
npm install
npm run install:all
```

## Run Locally

Start both apps from the repository root:

```bash
npm run dev
```

Or run each app separately:

```bash
npm run dev --prefix Backend
npm run dev --prefix Frontend
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000`

## Seed Sample Data

After setting `Backend/.env`, run:

```bash
npm run seed --prefix Backend
```

## API Endpoints

- `GET /api/jobs` - list jobs, supports `?category=Plumbing` and `?status=Open`
- `GET /api/jobs/:id` - get one job
- `POST /api/jobs` - create a job
- `PATCH /api/jobs/:id` - update status only
- `DELETE /api/jobs/:id` - delete a job

## JobRequest Fields

- `title` required string
- `description` required string
- `category` string
- `location` string
- `contactName` string
- `contactEmail` valid email format
- `status` one of `Open`, `In Progress`, `Closed`
- `createdAt` auto-created date
