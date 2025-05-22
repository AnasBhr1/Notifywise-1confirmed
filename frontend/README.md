# 🎨 NotifyWise Frontend - Premium React Application

## ✨ Features

### 🎭 **Premium Animations & Effects**
- **Framer Motion** powered page transitions and micro-interactions
- **Floating particles** and interactive cursor effects
- **Glassmorphism** and neumorphism design elements
- **Parallax scrolling** and scroll-triggered animations
- **Smooth 60fps** animations optimized for performance

### 🎨 **Advanced UI Components**
- **7 Button Variants**: Premium, Glass, Glow, Gradient, Outline, Ghost, Destructive
- **6 Card Styles**: Default, Glass, Gradient, Neumorphism, Glow, Premium
- **5 Input Types**: Clean, Glass, Gradient, Glow, Premium with icons
- **Animated Dropdowns** with gradient backgrounds
- **Premium Toast Notifications** with blur effects

### 🌙 **Dark/Light Mode**
- **Seamless theme switching** with next-themes
- **Animated transitions** between themes
- **System preference detection**
- **Persistent user preferences**

### 📱 **Responsive Design**
- **Mobile-first** approach
- **Responsive typography** and spacing
- **Touch-optimized** interactions
- **Progressive enhancement**

### 🔐 **Authentication**
- **Multi-step registration** with progress indicators
- **Beautiful login forms** with social authentication
- **JWT token management** with automatic refresh
- **Protected routes** and auth guards

### ⚡ **Performance**
- **Server-side rendering** with Next.js App Router
- **Optimized bundle size** with tree-shaking
- **Image optimization** and lazy loading
- **Fast navigation** with prefetching

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/notifywise.git
cd notifywise/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=NotifyWise
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   └── dashboard/          # Protected dashboard pages
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── appointments/
│   │       ├── clients/
│   │       ├── messages/
│   │       └── settings/
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   ├── auth/               # Auth-specific components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── common/             # Common components
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── auth-provider.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-toast.ts
│   │   ├── use-auth.ts
│   │   └── use-api.ts
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── validations.ts
│   └── types/                  # TypeScript type definitions
│       └── index.ts
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

## 🎨 Component Usage

### Button Component

```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button variant="default">Click me</Button>

// Premium variants
<Button variant="premium" size="lg">
  Premium Action
</Button>

// With icons and loading state
<Button variant="glow" loading icon={<Star />}>
  Loading...
</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card variant="glass">
  <CardHeader>
    <CardTitle>Glass Card</CardTitle>
  </CardHeader>
  <CardContent>
    Beautiful glassmorphism effect
  </CardContent>
</Card>
```

### Input Component

```tsx
import { Input } from '@/components/ui/input';
import { Mail, Eye } from 'lucide-react';

<Input
  variant="glass"
  placeholder="Enter email"
  icon={<Mail className="w-4 h-4" />}
  rightIcon={<Eye className="w-4 h-4" />}
/>
```

## 🎭 Animation Examples

### Page Transitions

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Hover Effects

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="cursor-pointer"
>
  Interactive Element
</motion.div>
```

## 🎨 Customization

### Colors

Update the color palette in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // Add your brand colors
      brand: {
        50: '#f0f9ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      }
    }
  }
}
```

### Typography

Customize fonts in `app/layout.tsx`:

```tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'] 
});
```

### Animations

Modify animations in `tailwind.config.js`:

```javascript
keyframes: {
  "custom-bounce": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  }
},
animation: {
  "custom-bounce": "custom-bounce 2s infinite",
}
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
npm run analyze
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

## 🔐 Authentication Flow

### Login Process

1. User enters credentials
2. Form validation with Zod
3. API call to backend
4. JWT token stored in cookies
5. Redirect to dashboard
6. Auto-refresh token management

### Protected Routes

```tsx
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*']
};
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_ENV=production
```

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['your-image-domain.com'],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### E2E Testing with Playwright

```bash
npm run test:e2e
```

## 🔧 Troubleshooting

### Common Issues

#### Hydration Errors
```tsx
// Use dynamic imports for client-only components
const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
);
```

#### Theme Flash
```tsx
// Add suppressHydrationWarning to html tag
<html lang="en" suppressHydrationWarning>
```

#### Animation Performance
```css
/* Add to globals.css for better animation performance */
* {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## 📚 Dependencies

### Core Dependencies
- **Next.js 14**: React framework with App Router
- **React 18**: JavaScript library for building user interfaces
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework

### UI & Animation
- **Framer Motion**: Production-ready motion library
- **Radix UI**: Unstyled, accessible components
- **Lucide React**: Beautiful & consistent icon library
- **class-variance-authority**: Creating variant-based component APIs

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use **TypeScript** for all new files
- Follow **ESLint** and **Prettier** configurations
- Write **descriptive commit messages**
- Add **tests** for new features
- Update **documentation** as needed

## 👨‍💻 Authors

- **NotifyWise Team** - *Initial work* - [GitHub](https://github.com/notifywise)

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for the deployment platform
- **Tailwind CSS** for the utility-first approach
- **Framer** for the motion library
- **Radix UI** for accessible components

## 📞 Support

- 📧 **Email**: anasbhr1@hotmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/notifywise/issues)

---

**Built with ❤️ by the AnasBhr1**



