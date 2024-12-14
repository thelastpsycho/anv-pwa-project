# The Anvaya Beach Resort Bali - Mobile App

Official mobile application for The Anvaya Beach Resort Bali, providing guests with easy access to hotel services and information.

## Features

### Guest Services

- Room authentication using WiFi credentials
- Real-time weather information for Kuta, Bali
- Dark/Light mode theme preference
- Table reservations for dining venues
- Activity and experience bookings
- Local attractions guide
- 24/7 guest support access

### Technical Features

- Progressive Web App (PWA) capabilities
- Offline functionality
- Automatic updates
- Responsive design for all devices
- Real-time data synchronization
- Secure authentication system

## Technical Stack

### Core Technologies

- Vue 3 with Composition API
- TypeScript for type safety
- Tailwind CSS for styling
- Pinia for state management
- Vite as build tool

### Additional Tools

- Vue Router for navigation
- Material Design Icons
- PWA plugin for offline capabilities
- ESLint & Prettier for code quality

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Lint and fix files
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Project Structure

```
src/
├── assets/        # Static assets (images, icons)
├── components/    # Reusable Vue components
├── data/         # Static data (amenities, activities)
├── router/       # Vue Router configuration
├── services/     # API services
├── stores/       # Pinia state management
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── views/        # Page components
```

## Key Features Implementation

### Authentication System

```typescript
// WiFi credentials authentication
const success = await authStore.login(roomNumber, password);

// Admin access
username: admin;
password: admin;
```

### Weather Integration

```typescript
// Real-time weather data for Kuta
const weatherData = await fetch(
  "https://api.open-meteo.com/v1/forecast?latitude=-8.7213&longitude=115.1697"
);
```

### Reservation System

```typescript
// Table reservation handling
const reservation = {
  venueId: number;
  date: string;
  time: string;
  guests: number;
  // ...other details
};
```

## Configuration

### Vite Configuration

```typescript
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://10.201.59.16:9090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [vue(), VitePWA()],
});
```

### Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=your_api_url
```

## PWA Features

### Capabilities

- Installable on mobile devices
- Works offline
- Automatic updates
- Background sync
- Push notifications (planned)

### Cache Strategy

- Weather data: 15-minute cache
- Static assets: Long-term cache
- API responses: Network-first strategy

## Support

For assistance:

- Contact front desk
- Dial Extension 0 from room phone
- Email: info@theanvayabali.com

## Security Notes

- Secure authentication using WiFi credentials
- API endpoint protection
- Data encryption in transit
- Session management
- Regular security updates

## Performance Optimization

- Lazy loading of routes
- Image optimization
- Efficient caching strategies
- Minimal bundle size
- Code splitting

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

Private and Confidential
All rights reserved - The Anvaya Beach Resort Bali

```

This README provides:
1. Comprehensive feature list
2. Detailed technical information
3. Clear setup instructions
4. Code examples
5. Configuration details
6. Security and performance notes
7. Support information
8. Contribution guidelines
```
