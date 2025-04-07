# Trupt - Food Donation Platform

A full-stack web application that connects food donors with volunteers to reduce food waste and help those in need.

## 🌟 Features

- **User Management**
  - User and organization registration/login
  - Profile management
  - Role-based access (Donors, Volunteers, Organizations)

- **Donation System**
  - Create food donations with details
  - Real-time donation tracking
  - Image upload support
  - Freshness rating system
  - Emergency time window specification

- **Location Services**
  - MapmyIndia integration
  - Location-based suggestions
  - Distance calculation
  - Real-time location tracking

- **Community Features**
  - Social feed
  - Post creation and interaction
  - Like and comment system
  - User engagement metrics

- **Real-time Communication**
  - Socket.IO integration
  - Live donation updates
  - Instant notifications

## 🛠️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- Socket.IO Client
- Flowbite React
- Progressive Web App (PWA) support

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Multer for file uploads

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trupt.git
cd trupt
```

2. Install dependencies:
```bash
# Frontend
cd Frontend
npm install

# Backend
cd ../Backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env)
VITE_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Backend (.env)
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MAPMYINDIA_API_KEY=your_api_key
```

## 🚀 Running the Application

### Development Mode
```bash
# Frontend
cd Frontend
npm run dev

# Backend
cd Backend
npm run dev
```

### Production Mode
```bash
# Frontend
cd Frontend
npm run build
npm run preview

# Backend
cd Backend
npm start
```

## 📱 API Endpoints

### User Routes
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `GET /users/logout` - User logout

### Organization Routes
- `POST /orgs/registerOrg` - Register new organization
- `POST /orgs/loginOrg` - Organization login
- `GET /orgs/profile` - Get organization profile
- `GET /orgs/logout` - Organization logout

### Donation Routes
- `POST /donations/create` - Create new donation
- `GET /donations` - Get all donations
- `PUT /donations/:id` - Update donation status

### Maps Routes
- `GET /maps/get-suggestions` - Get location suggestions
- `GET /maps/get-distance` - Calculate distance between points

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Token blacklisting
- Request validation
- File upload restrictions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


