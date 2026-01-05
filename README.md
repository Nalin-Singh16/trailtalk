# TrailTalk

TrailTalk is a full-stack campground discovery and discussion platform built with Node.js, Express, MongoDB, and EJS. It allows outdoor enthusiasts to browse curated campgrounds, share new locations with rich imagery, and collaborate through reviews. Server configuration lives in [`app.js`](app.js), with features modularized across [`routes/`](routes), [`controllers/`](controllers), [`models/`](models), and [`views/`](views).

## Tech Stack

- Runtime: Node.js 18+ with Express 4
- Views: EJS templates rendered with `ejs-mate` layouts from [`views/layouts/`](views/layouts)
- Database: MongoDB (Atlas or standalone) via Mongoose models in [`models/trailtalk.js`](models/trailtalk.js), [`models/review.js`](models/review.js), and [`models/user.js`](models/user.js)
- Authentication: Passport local strategy with session storage backed by MongoDB using `connect-mongo`
- Media Storage: Cloudinary image hosting configured in [`cloudinary/index.js`](cloudinary/index.js)
- Validation & Security: Joi schemas in [`schemas.js`](schemas.js), request sanitization, flash messaging, and helmet-friendly middleware
- Client Enhancements: Bootstrap 5 UI with custom styles in [`public/stylesheets/`](public/stylesheets) and client-side validation helpers in [`public/javascripts/validateForms.js`](public/javascripts/validateForms.js)

## Feature Highlights

- **Campground catalog management:** CRUD flows for campgrounds wired through [`routes/campgrounds.js`](routes/campgrounds.js) and [`controllers/campgrounds.js`](controllers/campgrounds.js) with Cloudinary-powered multi-image uploads.
- **User authentication & authorization:** Registration, login, logout, and ownership checks handled by [`routes/users.js`](routes/users.js), [`controllers/users.js`](controllers/users.js), and middleware such as [`middleware.isLoggedIn`](middleware.js:16) and [`middleware.isAuthor`](middleware.js:42).
- **Review system:** Nested reviews with ratings managed by [`routes/reviews.js`](routes/reviews.js), [`controllers/reviews.js`](controllers/reviews.js), and cascade cleanup defined in [`models/trailtalk.js`](models/trailtalk.js:36).
- **Robust validation & security:** Server-side validation via [`middleware.validateCampground`](middleware.js:6) and [`middleware.validateReview`](middleware.js:32), session hardening with signed cookies, and query sanitization using `express-mongo-sanitize`.
- **Responsive UI:** Landing experience designed in [`views/home.ejs`](views/home.ejs) and shared layout partials under [`views/partials/`](views/partials).

## Prerequisites

- Node.js 18.x or newer (LTS recommended)
- npm 9.x or newer (installed with Node)
- MongoDB instance (local community server or MongoDB Atlas cluster)
- Cloudinary account with an API key/secret and an upload folder (default folder name: `trailtalk`)

## Local Setup

1. **Clone the repository**

   ```bash
   git clone <your-fork-or-clone-url>
   cd trailtalk
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Provision environment variables**

   Create a `.env` file in the project root with the following keys. Variable names are case-sensitive and must match the examples exactly.

   ```bash
   NODE_ENV=development
   PORT=3000
   DB_URL=mongodb://127.0.0.1:27017/trailtalk
   secret=replace-with-a-secure-session-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-api-secret
   ```

   - `DB_URL` can target a MongoDB Atlas connection string when deploying remotely.
   - `secret` is consumed by the session store in [`app.js`](app.js) and by `connect-mongo`; ensure you choose a long, random string.
   - Cloudinary credentials must align with the values configured in [`cloudinary/index.js`](cloudinary/index.js).

4. **Start MongoDB**

   - **Local server:** ensure `mongod` is running (e.g., `brew services start mongodb-community@7.0` on macOS Homebrew installations).
   - **Atlas cluster:** confirm network access and user credentials allow connections from your development machine.

5. **Run the development server**

   ```bash
   npm start
   ```

   The application defaults to `http://localhost:3000` (override with `PORT`). Logs will indicate when TrailTalk is listening.

## Database Seeding (Optional)

Seed scripts are available under [`seeds/`](seeds) to populate sample campgrounds.

1. Update the `author` ObjectId in [`seeds/index.js`](seeds/index.js:32) to match an existing user created through the registration UI or MongoDB shell.
2. (Optional) Align the MongoDB connection string in [`seeds/index.js`](seeds/index.js:15) with your target database.
3. Execute the seeder:

   ```bash
   node seeds/index.js
   ```

   The script removes existing campgrounds and inserts 50 sample entries with placeholder imagery. Rerun as needed during development.

## Deployment Notes

- Ensure all environment variables above are present in your hosting platform (Render, Railway, Heroku, etc.).
- Set `NODE_ENV=production` and configure `DB_URL` to point to a production-grade MongoDB cluster.
- Enable HTTPS-only cookies by uncommenting the `secure: true` option under `cookie` in [`app.js`](app.js:75) when serving via TLS.
- Provide persistent storage for the session database (MongoDB) and Cloudinary credentials.

## Available npm Scripts

- `npm start` – launches the Express server defined in [`app.js`](app.js).

With these steps, you can run TrailTalk locally, iterate on features within the modular Express architecture, and deploy to production with managed MongoDB and Cloudinary resources.
