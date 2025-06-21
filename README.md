# MovieTix - Movie Ticket Booking Website

A modern, responsive movie ticket booking website built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **NextAuth.js** - Authentication
- **Zustand** - State management

## Features

- 🌟 Responsive design for mobile, tablet, and desktop
- 🌙 Dark/Light theme toggle
- 🎬 Browse now-showing and upcoming movies
- 🔍 Search functionality
- 🎟️ Interactive seat selection
- 📱 Modern UI with animations and transitions
- 🔒 User authentication (login/register)
- 👤 User profiles with booking history
- 🎫 Booking management

## Pages

1. **Home Page**
   - Movie listings (Now Showing & Coming Soon)
   - Search functionality
   - Movie cards with poster, title, genre, rating

2. **Movie Detail Page**
   - Full movie information (trailer, synopsis, cast, etc.)
   - Available showtimes by theater location

3. **Booking Page**
   - Interactive seat selection map
   - Booking summary with price calculation

4. **Checkout Page**
   - Contact information form
   - Booking summary

5. **Confirmation Page**
   - Booking details
   - QR code for ticket

6. **Authentication Pages**
   - Login
   - Registration

7. **Profile Page**
   - User information
   - Booking history
   - Account settings

## Authentication

The site includes a full authentication system with:

- Email/password login
- User registration
- Protected routes
- Role-based access (user/admin)
- User profiles

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/movie-ticket-booking.git
   cd movie-ticket-booking
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo User Accounts

For testing purposes, you can use these demo accounts:

- Regular User: john@example.com / password123
- Admin User: admin@example.com / admin123

## Screenshots

(Add screenshots here once the application is complete)

## Project Structure

```
movie-ticket-booking/
├── app/                 # App router pages
│   ├── page.tsx         # Home page
│   ├── movies/[id]/     # Movie details page
│   ├── booking/[id]/    # Booking page
│   ├── checkout/[id]/   # Checkout page
│   ├── confirmation/    # Confirmation page
│   ├── auth/            # Authentication pages
│   └── profile/         # User profile page
├── components/          # Reusable components
├── lib/                 # Utility functions and mock data
├── styles/              # Global styles
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Notes

- This is a demo project with mock data
- No actual payment processing
- In a production app, you would integrate with:
  - Movie data API
  - Payment gateway
  - Backend for storing bookings and user data

## License

MIT
