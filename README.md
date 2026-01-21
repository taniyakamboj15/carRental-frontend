# Premium Car Rental Frontend 🚗✨

> **Designed & Developed by Taniya Kamboj**

Welcome to the cutting-edge frontend interface for the Premium Car Rental platform. This application is engineered to deliver a seamless, high-performance, and visually stunning experience for users looking to rent luxury electric and sports vehicles.

Built with modern web technologies, it emphasizes performance, accessibility, and a "wow" factor in every interaction.

## 🌟 Key Features

### 1. **Immersive User Experience**
- **Dynamic Hero Section**: featuring cinematic backgrounds and motion-enhanced typography.
- **Glassmorphism Design**: Modern UI elements with backdrop blurs and subtle transparencies.
- **Responsive Layouts**: Flawlessly adapts to Desktops, Tablets, and Mobile devices.

### 2. **Advanced Fleet Management**
- **Real-time Availability**: Instant feedback on vehicle status.
- **Smart Filtering**: Filter fleet by specific cities or browse the entire collection (Admin).
- **Interactive Booking**: Seamless flow from selection to confirmation.

### 3. **Intelligent Location Services**
- **Interactive Maps**: Built with `react-leaflet`, allowing users to pinpoint pickup locations visually.
- **Geolocation Integration**: One-tap "Locate Me" functionality.
- **Reverse Geocoding**: Automatically converts coordinates to readable addresses using OpenStreetMap APIs.

### 4. **Secure & Robust Authentication**
- **Role-Based Access Control**: Different views for Guests, Registered Users, and Superusers.
- **KYC Verification**: Integrated document submission flow (Profile -> KYC) to ensure trust and safety.
- **Token Management**: Secure handling of JWTs with automatic context updates.

## 🛠️ Technology Stack

This project leverages a curated stack of strictly typed, high-performance libraries:

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Flash-fast HMR and bundling)
- **Styling**: 
  - [Tailwind CSS v3](https://tailwindcss.com/) for utility-first styling.
  - **Framer Motion** for complex animations and page transitions.
- **State Management**: 
  - **React Context API** for global auth state.
  - **TanStack Query (React Query)** for efficient server state management, caching, and data synchronization.
- **Maps**: `react-leaflet` + `leaflet`
- **Icons**: `lucide-react`
- **Forms & Validation**: Controlled components with strict type safety.

## 📂 Project Structure

A clean, feature-based architecture ensures scalability and maintainability:

```
src/
├── api/            # Centralized Axios instance & API utilities
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
│   ├── common/     # Generic atoms (Buttons, Inputs, Maps)
│   └── features/   # Business-logic rich components (BookingModal, VehicleCard)
├── context/        # Global State (AuthContext)
├── hooks/          # Custom Hooks (useLocationPicker, useVehicles, useProfile)
├── layouts/        # Page wrappers (Navbar, Footer)
├── pages/          # Route views (Home, Vehicles, Profile, Dashboard)
└── types/          # TypeScript interfaces/types for strict type checking
```

## 🚀 Getting Started

Follow these steps to set up the development environment locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carRental-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🎨 Design Philosophy

The design strictly adheres to a "Premium & Trustworthy" aesthetic. We avoided generic Bootstrap-like looks in favor of:
- **Whitespace**: Generous breathing room for content.
- **Typography**: Clean sans-serif fonts for readability.
- **Color Palette**: A sophisticated blend of Indigo (Trust), Purple (Luxury), and White/Gray (Cleanliness).

---

*© 2024 Car Rental Platform. All Rights Reserved.*
