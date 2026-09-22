# Garde 👗

A social app for sharing and exploring digital closets. Like Instagram, but for your wardrobe.

## MVP Features

- **Digital Closet**: Upload and organize your clothing items
- **Social Feed**: See what clothes and outfits your friends are adding
- **Follow System**: Follow friends to see their closets
- **User Profiles**: Showcase your wardrobe to other users
- **Search & Browse**: Discover friends' closets

## Tech Stack

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Language**: TypeScript
- **UI**: React Native (iOS/Android) & React for Web
- **Image Handling**: expo-image-picker
- **Storage**: expo-secure-store for auth tokens

## Project Structure

```
garde/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with auth routing
│   ├── auth.tsx           # Auth screen entry point
│   ├── index.tsx          # Root redirect
│   └── (tabs)/            # Tab-based navigation
│       ├── _layout.tsx    # Tabs layout
│       ├── feed.tsx       # Feed screen
│       ├── closet.tsx     # Closet screen
│       └── profile.tsx    # Profile screen
├── src/
│   ├── screens/           # Full screen components
│   ├── components/        # Reusable components
│   ├── stores/            # Zustand state stores
│   │   ├── authStore.ts
│   │   └── closetStore.ts
│   ├── services/          # API clients
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── app.json               # Expo configuration
├── package.json
└── tsconfig.json          # TypeScript config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only) or Expo Go app
- Android: Android Studio or Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/spalombo101-alt/garde.git
cd garde

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Devices

```bash
# Web browser
npm run web

# iOS simulator (Mac only)
npm run ios

# Android emulator
npm run android

# Or scan QR code with Expo Go app
npm start
```

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
