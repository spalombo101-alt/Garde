# Garde Backend API

A Node.js/Express REST API for Garde - a digital closet social app.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi

## Features

- User authentication (signup/login with JWT)
- User profiles with followers/following
- Clothing item management (CRUD)
- Social feed from followed users
- Like system for items
- Follow/unfollow users
- Type-safe API with TypeScript

## Project Structure

```
garde-backend/
├── src/
│   ├── db/
│   │   ├── connect.ts         # Database connection pool
│   │   ├── schema.sql         # Database schema
│   │   └── migrate.ts         # Migration script
│   ├── services/
│   │   ├── userService.ts     # User business logic
│   │   ├── clothingService.ts # Clothing items logic
│   │   └── followService.ts   # Follow/follower logic
│   ├── routes/
│   │   ├── auth.ts            # Auth endpoints
│   │   ├── closet.ts          # Closet/item endpoints
│   │   └── users.ts           # User profile endpoints
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication
│   ├── utils/
│   │   └── auth.ts            # Auth utility functions
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── server.ts              # Express app setup
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone and install dependencies:

```bash
cd garde-backend
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your database URL:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/garde_db
JWT_SECRET=your-super-secret-key-change-this
```

4. Create PostgreSQL database:

```bash
createdb garde_db
```

5. Run migrations:

```bash
npm run db:migrate
```

6. Start the server:

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication

```
POST   /auth/signup        - Register new user
POST   /auth/login         - Login user
GET    /auth/me            - Get current user (requires auth)
```

**Signup Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "John Doe",
  "username": "johndoe"
}
```

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Closet / Clothing Items

```
POST   /closet/items              - Add clothing item (requires auth)
GET    /closet/items              - Get user's closet (requires auth)
GET    /closet/:userId/items      - Get specific user's closet
DELETE /closet/items/:itemId      - Delete clothing item (requires auth)
GET    /closet/items/:itemId      - Get specific item
POST   /closet/items/:itemId/like - Like item (requires auth)
DELETE /closet/items/:itemId/like - Unlike item (requires auth)
GET    /closet/items/:itemId/likes- Get likes count
GET    /closet/feed               - Get personalized feed (requires auth)
```

**Add Item Request:**
```json
{
  "imageUri": "data:image/jpeg;base64,...",
  "brand": "Zara",
  "category": "tops",
  "color": "Black",
  "size": "M",
  "notes": "Perfect condition",
  "purchaseDate": "2024-01-15",
  "purchaseUrl": "https://zara.com/product/123"
}
```

### Users / Profiles

```
GET    /users/:userId             - Get user profile
PATCH  /users/:userId             - Update user profile (requires auth)
POST   /users/:userId/follow      - Follow user (requires auth)
DELETE /users/:userId/follow      - Unfollow user (requires auth)
GET    /users/:userId/followers   - Get user's followers
GET    /users/:userId/following   - Get users being followed
```

**Update Profile Request:**
```json
{
  "displayName": "Jane Doe",
  "bio": "Fashion enthusiast",
  "avatarUrl": "https://..."
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Tokens expire in 7 days by default (configurable via `JWT_EXPIRES_IN` env var).

## Database Schema

### Users
- id (UUID, primary key)
- email (unique)
- username (unique)
- display_name
- password_hash
- bio
- avatar_url
- created_at, updated_at

### Clothing Items
- id (UUID)
- user_id (FK to users)
- image_url
- brand, category, color, size
- notes, purchase_date, purchase_url
- created_at, updated_at

### Likes
- id (UUID)
- user_id (FK to users)
- item_id (FK to clothing_items)
- Unique constraint on (user_id, item_id)

### Follows
- id (UUID)
- follower_id (FK to users)
- following_id (FK to users)
- Unique constraint on (follower_id, following_id)
- Check constraint: follower_id ≠ following_id

### Outfits (Future)
- id (UUID)
- user_id (FK to users)
- name, description, image_url
- created_at, updated_at

## Error Handling

API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

Error responses include a JSON body:
```json
{
  "error": "Error description"
}
```

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | - | PostgreSQL connection string |
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| JWT_SECRET | - | Secret key for JWT signing |
| JWT_EXPIRES_IN | 7d | JWT expiration time |
| CORS_ORIGIN | localhost:19000 | Comma-separated CORS origins |
| MAX_FILE_SIZE | 5242880 | Max upload size (bytes) |
| UPLOAD_DIR | ./uploads | Directory for file uploads |

## Future Enhancements

- [ ] Image upload to cloud storage (S3, Cloudinary)
- [ ] WebSocket support for real-time notifications
- [ ] Comments on clothing items
- [ ] Direct messaging between users
- [ ] Outfit combinations
- [ ] Item search/filtering
- [ ] Automatic receipt parsing for item import
- [ ] Rate limiting
- [ ] Input validation (Joi schemas)
- [ ] Request logging (Morgan)
- [ ] API documentation (Swagger)

## License

MIT

## Support

Questions or issues? Open an issue on GitHub!
