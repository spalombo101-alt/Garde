# Garde 👗

A full-stack social app for sharing and exploring digital closets. Like Instagram, but for your wardrobe.

## MVP Features

- **Digital Closet**: Upload and organize your clothing items
- **Social Feed**: See what clothes and outfits your friends are adding
- **Follow System**: Follow friends to see their closets
- **User Profiles**: Showcase your wardrobe to other users
- **Search & Browse**: Discover friends' closets

## Tech Stack

### Frontend
- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Language**: TypeScript
- **UI**: React Native (iOS/Android) & React for Web

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Auth**: JWT

## Project Structure (Monorepo)

```
garde/
├── app/                       # Expo Router pages
├── src/                       # Frontend source
│   ├── screens/              # UI screens
│   ├── stores/               # Zustand state
│   ├── services/             # API client
│   ├── types/                # TypeScript types
│   └── utils/                # Utilities
├── backend/                  # Backend API (Node/Express)
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth middleware
│   │   ├── db/              # Database & migrations
│   │   └── types/           # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md            # Backend docs
├── package.json             # Frontend
├── app.json                 # Expo config
└── tsconfig.json            # Frontend TypeScript
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only) or Expo Go app
- Android: Android Studio or Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/spalombo101-alt/Garde.git
cd Garde

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running Backend

```bash
cd backend

# Setup database
cp .env.example .env
# Update .env with your PostgreSQL connection

# Run migrations
npm run db:migrate

# Start server
npm run dev
```

Backend will be available at: `http://localhost:3000`

### Running Frontend

```bash
# In root directory (not backend)

# Start Expo dev server
npm start

# Then choose:
# - Press 'w' for web browser
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app
```

## Full Stack Development

**Terminal 1** (Backend):
```bash
cd backend
npm run dev
```

**Terminal 2** (Frontend):
```bash
npm start
```

Both will run simultaneously for testing.

## Screens Overview

### Auth Screen
- Email & password login/signup
- Form validation
- Loading states

### Feed Screen
- Browse clothes/outfits from followed users
- Like posts
- View user profiles from feed
- Timestamp tracking

### Closet Screen
- Grid view of personal clothing items
- Add new items with:
  - Image upload
  - Brand name
  - Category (tops, bottoms, dresses, outerwear, shoes, accessories)
  - Color
  - Size
  - Notes
- Delete items (long press)

### Profile Screen
- User profile information
- Follower/Following counts
- Clothing item count
- Follow/Message buttons
- Closet grid view
- Logout button

## State Management

### Auth Store (`src/stores/authStore.ts`)
- User authentication state
- Login/Signup/Logout
- Token restoration on app launch
- Signed-in state tracking

### Closet Store (`src/stores/closetStore.ts`)
- User's clothing items
- Feed posts
- Item upload/deletion
- Like functionality
- Feed fetching

## Type Definitions

All types are in `src/types/index.ts`:
- `User`: User profile data
- `ClothingItem`: Individual clothing items
- `Outfit`: Collections of items
- `Feed`: Social feed posts
- `UserProfile`: Extended user profile with stats

## Next Steps for MVP

1. **Backend Setup**
   - Node.js/Express server
   - PostgreSQL database
   - JWT authentication
   - Image storage (AWS S3 or similar)
   - REST API endpoints

2. **API Integration**
   - Update `authStore.ts` with real API calls
   - Update `closetStore.ts` with backend integration
   - Configure axios base URL

3. **Testing**
   - Add unit tests (Jest)
   - Add integration tests
   - E2E testing (Detox or similar)

4. **Polish**
   - Add loading skeleton screens
   - Improve error handling
   - Add toast notifications
   - Optimize image loading
   - Add pull-to-refresh

5. **Features to Add**
   - User search
   - Outfit combinations
   - Comments on posts
   - Direct messaging
   - Notifications

## API Endpoints (To Be Implemented)

```
POST   /auth/signup          - Register new user
POST   /auth/login           - Login
GET    /auth/me              - Get current user
POST   /closet/items         - Add clothing item
GET    /users/:userId/closet - Get user's closet
GET    /feed                 - Get feed posts
POST   /items/:id/like       - Like an item
```

## Development Notes

- All API calls are stubbed with `// TODO:` comments
- Secure storage not yet implemented (use expo-secure-store)
- Images currently stored as URIs (need backend upload)
- No real-time updates yet (consider Firebase or WebSockets)

## License

MIT

## Contact

Questions? Issues? Start a discussion or open an issue on GitHub!
