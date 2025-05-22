# 📱 NotifyWise - WhatsApp Appointment Reminder SaaS

> **Professional WhatsApp appointment reminder system for service-based businesses**

NotifyWise is a comprehensive SaaS platform that automates WhatsApp appointment reminders, confirmations, and follow-ups for service-based businesses like hair salons, tutors, clinics, real estate agents, and more.

## ✨ Features

### 🎯 Core Features
- **📅 Appointment Management** - Complete CRUD operations for appointments
- **👥 Client Management** - Organize and manage client information
- **📱 WhatsApp Integration** - Automated messaging via 1CONFIRMED API
- **🔔 Smart Notifications** - Confirmations, reminders, and follow-ups
- **📊 Analytics Dashboard** - Track message delivery and appointment stats
- **🌐 Public Booking Page** - Client-facing appointment booking

### 🎨 UI/UX Features
- **🌙 Dark/Light Mode** - Elegant theme switching
- **📱 Mobile-First Design** - Responsive across all devices
- **✨ Modern Animations** - Smooth transitions and interactions
- **🎨 Premium Components** - Glass-morphism and modern design elements

### 🔐 Security Features
- **🔒 JWT Authentication** - Secure user sessions
- **🛡️ Rate Limiting** - API protection against abuse
- **🔐 Data Encryption** - Secure password hashing
- **🚫 Input Validation** - Comprehensive data validation

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Beautiful, accessible components
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### APIs & Services
- **1CONFIRMED** - WhatsApp Business API
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### DevOps & Deployment
- **Vercel** - Frontend deployment
- **Railway/AWS** - Backend deployment
- **GitHub Actions** - CI/CD pipeline
- **MongoDB Atlas** - Cloud database

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- 1CONFIRMED WhatsApp API account
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/notifywise.git
cd notifywise
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
WHATSAPP_API_KEY=your_1confirmed_api_key
WHATSAPP_API_URL=https://api.1confirmed.com/v1
```

### 4. Start Development Servers
```bash
# Run both frontend and backend simultaneously
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Access the Application
- **Admin Dashboard**: http://localhost:3000/dashboard
- **API Documentation**: http://localhost:5000/health
- **Public Booking**: http://localhost:3000/book/[business-id]

## 📁 Project Structure

```
notifywise/
├── 📄 README.md
├── 📄 package.json           # Root package.json with scripts
├── 📄 .env.example          # Environment template
├── 📄 .gitignore            # Git ignore rules
├── 
├── 📁 frontend/             # Next.js frontend application
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   └── 📁 src/
│       ├── 📁 app/          # Next.js App Router
│       ├── 📁 components/   # Reusable UI components
│       ├── 📁 lib/          # Utility functions
│       ├── 📁 hooks/        # Custom React hooks
│       └── 📁 types/        # TypeScript definitions
│
├── 📁 backend/              # Express.js backend API
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📁 src/
│       ├── 📄 index.ts      # Server entry point
│       ├── 📁 config/       # Configuration files
│       ├── 📁 controllers/  # Request handlers
│       ├── 📁 models/       # Database models
│       ├── 📁 routes/       # API routes
│       ├── 📁 middleware/   # Custom middleware
│       ├── 📁 services/     # Business logic
│       └── 📁 utils/        # Helper functions
│
├── 📁 .github/              # GitHub workflows
│   └── 📁 workflows/
│       ├── 📄 ci.yml        # Continuous Integration
│       └── 📄 deploy.yml    # Deployment
│
└── 📁 docs/                 # Documentation
    ├── 📄 API.md           # API documentation
    ├── 📄 DEPLOYMENT.md    # Deployment guide
    └── 📄 DEVELOPMENT.md   # Development guide
```

## 🎮 Usage Guide

### For Business Owners

1. **Sign Up**: Create your business account
2. **Setup Profile**: Configure business details and WhatsApp number
3. **Add Services**: Define your appointment types
4. **Manage Clients**: Add client information
5. **Schedule Appointments**: Book appointments for clients
6. **Monitor Messages**: Track delivery status of notifications

### For Clients

1. **Visit Booking Page**: Access via provided business URL
2. **Select Service**: Choose from available services
3. **Pick Date/Time**: Select convenient appointment slot
4. **Enter Details**: Provide contact information
5. **Receive Confirmation**: Get WhatsApp confirmation immediately

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Clients
- `GET /api/clients` - List clients
- `POST /api/clients` - Add new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client

### Messages
- `GET /api/messages` - Message history
- `POST /api/messages` - Send custom message
- `GET /api/messages/stats` - Message statistics

### Public Booking
- `GET /api/public/business/:id` - Get business info
- `POST /api/public/book` - Create public booking

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)
1. Create new Railway project
2. Connect GitHub repository
3. Add environment variables
4. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access
3. Get connection string
4. Add to environment variables

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📋 Development Roadmap

### Phase 1 (Current)
- [x] Basic appointment management
- [x] WhatsApp integration
- [x] User authentication
- [x] Public booking page

### Phase 2 (Next)
- [ ] Calendar integration (Google Calendar)
- [ ] Email notifications
- [ ] SMS backup notifications
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] Multi-business support
- [ ] Team member management
- [ ] Custom message templates
- [ ] Payment integration

## 🆘 Support

- **Documentation**: Check our [docs](docs/) folder
- **Issues**: Create a GitHub issue
- **Email**: anasbhr1@hotmail.com

## 🙏 Acknowledgments

- [1CONFIRMED](https://1confirmed.com) for WhatsApp API
- [Vercel](https://vercel.com) for hosting platform
- [Tailwind CSS](https://tailwindcss.com) for styling framework
- [Shadcn/UI](https://ui.shadcn.com) for component library

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by Anasbhr**