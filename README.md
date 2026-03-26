# Blog API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2C3E50.svg)](https://www.prisma.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://jwt.io/)

**A RESTful backend API for a personal blog**.

This API serves as the single source of truth for blog data and can be consumed by **two separate front-ends**:

- A public-facing reader site (view posts + comment)
- A private author dashboard (write, edit, publish/unpublish posts, manage comments)

By keeping the backend completely separate from the front-ends, the project showcases the power and flexibility of an API-first architecture.

## ✨ Features Implemented

### Authentication & Authorization

- User registration and login
- JWT-based authentication (Bearer token in `Authorization` header)
- Protected routes for authors (only authenticated users can create/edit/delete comments)
- Passwords hashed with bcrypt

### Blog Posts

- Full CRUD operations
- Draft vs Published status (`published: boolean`)
- Automatic timestamps (`createdAt`, `updatedAt`)
- Author association
- Ability to publish/unpublish posts

### Comments

- Add comments to published posts only
- View all comments for a post
- Delete comments (admin can delete any comment)

### Database Models (Prisma)

- `User` – firstName, lastName, email, password, role(ADMIN|USER), profileImage
- `Post` – title, content, bannerImage, likes, published, authorId, timestamps
- `Comment` – content, likes, authorId, postId, parentId timestamps

### Additional Goodies

- Proper RESTful route organization
- Error handling and validation
- Prisma schema with relations and indexes for performance

## 🛠 Tech Stack

- **Runtime**: Node.js + Express
- **Database ORM**: Prisma + PostgreSQL
- **Authentication**: JWT (`jsonwebtoken`) + Passport.js JWT Strategy
- **Security**: bcrypt, cors, express-validator
- **Environment**: dotenv
- **Development**: ESLint, Prettier

## 🏗 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/blog-api.git
cd blog-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# → Fill in DATABASE_URL and TOKEN_SECRET

# 4. Run Prisma migrations
npx prisma migrate dev
npx prisma generate

# 5. Start development server
npm start
```
