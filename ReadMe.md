# Mini Service Request Board

A small full-stack app where homeowners can post service requests and tradespeople can browse, search, update, or delete them.

## Tech Stack

- Frontend: Next.js App Router
- Backend: Node.js, Express
- Database: MongoDB
- ODM: Mongoose
- Styling: Plain CSS

## Features

- Light and dark theme with saved preference
- Job dashboard with status summary cards
- Search across title and description
- Category and status filters
- Client-side sorting by newest, oldest, status, or category
- Job detail page with quick status actions and email contact link
- JWT login/register flow
- Optional Google login when Google OAuth credentials are configured

## Project Structure

```txt
Backend/   Express REST API
Frontend/  Next.js UI
```

## Environment Variables

Create `Backend/.env`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000,https://gnta-sigma.vercel.app
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=optional_google_oauth_client_id
```

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://global-tna-assesment-project.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=optional_google_oauth_client_id
```

`GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` must be the same OAuth client ID if Google login is enabled.

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

This inserts 40 jobs: 10 Plumbing, 10 Electrical, 10 Painting, and 10 Joinery.

## Tests

Run backend CRUD and auth tests:

```bash
npm test --prefix Backend
```

## API Endpoints

- `POST /api/auth/register` - create an account and return a JWT
- `POST /api/auth/login` - login with email/password and return a JWT
- `POST /api/auth/google` - login with a Google ID token and return a JWT
- `GET /api/jobs` - list jobs, supports `?category=Plumbing`, `?status=Open`, and `?search=tap`
- `GET /api/jobs/:id` - get one job
- `POST /api/jobs` - create a job, requires `Authorization: Bearer <token>`
- `PATCH /api/jobs/:id` - update status only
- `DELETE /api/jobs/:id` - delete a job, requires `Authorization: Bearer <token>`

## JobRequest Fields

- `title` required string
- `description` required string
- `category` string
- `location` string
- `contactName` string
- `contactEmail` valid email format
- `status` one of `Open`, `In Progress`, `Closed`
- `createdAt` auto-created date

## Deployment

### Backend on Render

1. Push the repository to GitHub.
2. Create a new Render Web Service.
3. Set the root directory to `Backend`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Add environment variables:
   `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and optional `GOOGLE_CLIENT_ID`.

`Backend/render.yaml` is included if you prefer Render Blueprint setup.

### Frontend on Vercel

1. Import the GitHub repository in Vercel.
2. Set the project root directory to `Frontend`.
3. Add environment variables:
   `NEXT_PUBLIC_API_URL=https://your-render-backend-url`
   and optional `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
4. Deploy.

After Vercel deploys, update Render's `FRONTEND_URL` to the Vercel URL. For multiple frontend origins, separate them with commas.
