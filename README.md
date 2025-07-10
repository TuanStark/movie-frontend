# 🎬 MovieTix - Movie Ticket Booking Website

A modern, responsive movie ticket booking application built with Next.js 14, TypeScript, and Tailwind CSS. This application provides a seamless experience for users to browse movies, select showtimes, book seats, and complete payments with Vietnamese payment methods.

## ✨ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with latest features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **SWR** - Data fetching and caching
- **Lucide React** - Beautiful icon library

### Backend Integration
- **REST API** - Integration with Node.js/Express backend
- **Real-time Data** - Live seat availability updates
- **Image Upload** - Cloudinary integration for payment proofs

## 🚀 Features

### � Core Features
- **Movie Browsing**: Browse trending, upcoming, and categorized movies with pagination
- **Movie Details**: Detailed movie information with trailers, cast, showtimes, and reviews
- **Showtime Selection**: View available showtimes across different theaters and dates
- **Seat Selection**: Interactive seat map with real-time availability per showtime
- **Booking System**: Complete booking flow with customer information and payment
- **Payment Integration**: Vietnamese payment methods (Bank Transfer + VNPay)

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Dark Mode**: Full dark/light theme support with system preference detection
- **Loading States**: Professional skeleton loading components for better UX
- **Interactive Elements**: Smooth animations, hover effects, and transitions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 💳 Payment Features
- **Bank Transfer**: QR code generation with complete account details
- **VNPay Integration**: Ready for Vietnamese digital wallet payments
- **Payment Proof Upload**: Mandatory image upload with preview and validation
- **Peak Hour Pricing**: Dynamic pricing (+20k VND) for weekends and evening shows
- **Price Transparency**: Clear breakdown of showtime fees, seat prices, and surcharges

## 📄 Application Pages

### 🏠 Home Page (`/`)
- **Hero Section**: Featured movies with dynamic background
- **Movie Tabs**: Now Showing, Coming Soon, and Trending categories
- **Search & Filters**: Real-time search with genre and date filters
- **Movie Grid**: Responsive grid with pagination and skeleton loading
- **Articles Section**: Latest movie news and reviews

### 🎬 Movie Detail Page (`/movies/[id]`)
- **Movie Information**: Title, synopsis, cast, crew, and ratings
- **Media Gallery**: Trailers, images, and promotional content
- **Showtime Selection**: Available times grouped by theater and date
- **Reviews & Ratings**: User reviews and professional ratings
- **Related Movies**: Recommendations based on genre and popularity

### 🎟️ Booking Page (`/booking/[movieId]?showtime=[id]`)
- **Movie & Showtime Info**: Selected movie and showtime details
- **Interactive Seat Map**: Real-time seat availability with visual indicators
- **Seat Types**: Standard and VIP seats with different pricing
- **Booking Summary**: Selected seats with individual and total pricing
- **Peak Hour Indicators**: Dynamic pricing for weekends and evenings

### 💳 Checkout Page (`/checkout`)
- **Customer Information**: Contact details form with validation
- **Payment Methods**: Bank Transfer with QR code and VNPay options
- **Payment Proof Upload**: Image upload with preview and validation
- **Order Summary**: Complete price breakdown with all fees
- **Booking Confirmation**: Final review before payment submission

### ✅ Confirmation Page (`/confirmation`)
- **Booking Details**: Complete booking information and reference code
- **Digital Ticket**: QR code and booking details for theater entry
- **Payment Information**: Payment method and proof confirmation
- **Next Steps**: Instructions for theater visit and ticket collection

## 🎯 Key Features Implementation

### 🎪 Seat Selection System
- **Showtime-Specific Booking**: Seats are blocked per specific showtime, not globally
- **Real-time Updates**: Live seat availability using SWR data fetching
- **Visual Indicators**: Color-coded seats (available, selected, booked, VIP)
- **Responsive Layout**: Adapts to different screen sizes with touch-friendly controls
- **Validation**: Prevents booking of already reserved seats

### 💰 Dynamic Pricing System
```
Total Price = Showtime Fee + Sum of Seat Prices + Peak Hour Surcharge

Peak Hour Conditions:
- Weekends (Friday, Saturday, Sunday)
- Evening shows (after 18:00)
- Surcharge: +20,000 VND
```

### 🏦 Payment Integration
- **Bank Transfer**:
  - QR code with account details
  - Clickable QR code for enlarged view
  - Complete transfer information display
- **VNPay**: Ready for integration with Vietnamese payment gateway
- **Payment Proof**: Mandatory image upload with file validation (max 5MB, images only)

### 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices with touch interactions
- **Breakpoints**:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- **Performance**: Optimized images and lazy loading

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** or yarn
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TuanStark/movie-frontend.git
   cd movie-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 🧪 API Integration

### Backend Endpoints
- `GET /movies` - Movie listings with pagination and filters
- `GET /movies/{id}` - Detailed movie information
- `GET /showtimes` - Available showtimes by movie and theater
- `GET /seats/theater/{id}` - Seat availability for specific theater
- `POST /booking` - Create new booking with payment proof
- `POST /upload` - Upload payment proof images

### Data Flow
1. **SWR for Caching**: Efficient data fetching with automatic revalidation
2. **Error Handling**: Graceful error states with user-friendly messages
3. **Loading States**: Skeleton components during data fetching
4. **Real-time Updates**: Automatic refresh for seat availability

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (default)/         # Default layout group
│   │   ├── page.tsx       # Home page with movie listings
│   │   ├── HomeClient.tsx # Client-side home component
│   │   ├── movies/        # Movie-related pages
│   │   │   ├── page.tsx   # Movies listing page
│   │   │   └── [id]/      # Movie detail pages
│   │   ├── booking/       # Booking flow
│   │   │   └── [movieId]/ # Seat selection page
│   │   ├── checkout/      # Payment checkout
│   │   │   └── page.tsx   # Customer info & payment
│   │   └── confirmation/  # Booking confirmation
│   │       └── page.tsx   # Success page with ticket
│   ├── globals.css        # Global styles and Tailwind
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── skeletons/        # Loading skeleton components
│   │   ├── HomeSkeleton.tsx
│   │   ├── MovieSkeleton.tsx
│   │   ├── ArticleSkeleton.tsx
│   │   └── CommonSkeleton.tsx
│   └── test/             # Development test components
├── types/                # TypeScript definitions
│   ├── global-type.ts    # Main type definitions
│   └── format-price.ts   # Price formatting utilities
├── lib/                  # Utility functions
├── public/              # Static assets
│   ├── images/          # Image assets
│   └── icons/           # Icon files
└── docs/                # Documentation
    └── SKELETON_LOADING.md
```

## 🧪 Testing & Development

### Component Testing
```bash
# Run development server
npm run dev

# Access component demos
http://localhost:3000/test/skeleton-demo
http://localhost:3000/test/peak-hour-test
```

### Manual Testing Checklist
- [ ] Movie browsing and pagination
- [ ] Search functionality
- [ ] Movie detail page navigation
- [ ] Showtime selection
- [ ] Seat selection (different showtimes)
- [ ] Peak hour pricing calculation
- [ ] Booking flow completion
- [ ] Payment proof upload
- [ ] QR code modal interaction
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark/light mode switching

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization with responsive sizing
- **Code Splitting**: Automatic route-based code splitting for faster loading
- **Lazy Loading**: Components and images load on demand
- **SWR Caching**: Intelligent data caching with background revalidation
- **Bundle Analysis**: Optimized bundle size with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- **Developer**: TuanStark
- **Email**: lecongtuan472004@gmail.com
- **GitHub**: [@TuanStark](https://github.com/TuanStark)

## 🙏 Acknowledgments

- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icon library
- SWR for the excellent data fetching solution
- Cloudinary for image hosting and optimization

---

**Happy Coding! 🎬✨**
