# Secure Password Manager

A modern, secure web-based password manager with **zero-knowledge architecture** and client-side encryption.

## 🚀 Features
- **Zero-Knowledge Architecture**: Your master password never leaves your device
- **Client-Side Encryption**: All passwords are encrypted/decrypted in your browser
- **PBKDF2 + AES Encryption**: Industry-standard encryption algorithms
- **Password Generator**: Generate strong, customizable passwords
- **Password Strength Checker**: Real-time password strength analysis
- **Modern UI**: Beautiful Material-UI interface with dark theme
- **Search & Filter**: Find passwords quickly with search and category filtering
- **Secure Storage**: SQLite database with encrypted data storage

## 🛡️ Security Features
- **Zero-Knowledge Authentication**: Master password is hashed client-side before server communication
- **PBKDF2 Key Derivation**: 100,000 iterations for secure key generation
- **AES-256-GCM Encryption**: Authenticated encryption for data integrity
- **HTTPS Support**: Secure communication with SSL/TLS encryption
- **Content Security Policy**: Prevents XSS attacks and enforces secure resource loading
- **Rate Limiting**: Stricter limits on authentication endpoints (5 attempts per 15 minutes)
- **CORS Protection**: Configured for secure cross-origin requests
- **Security Headers**: Comprehensive HTTP security headers via Helmet
- **Client-Side Processing**: All sensitive operations happen in your browser

## 🔐 Zero-Knowledge Architecture

This password manager implements true zero-knowledge architecture:

1. **Registration**: Master password is hashed client-side with PBKDF2 before being sent to server
2. **Login**: Client retrieves salt, hashes password locally, sends only the hash
3. **Encryption**: All password encryption/decryption happens in the browser
4. **Server Storage**: Server stores only hashed master passwords and encrypted data

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │  SQLite Database│
│                 │    │                 │    │                 │
│ • Hash Password │◄──►│ • Store Hash    │◄──►│ • Encrypted     │
│ • Encrypt Data  │    │ • Rate Limiting │    │   Data Storage  │
│ • Decrypt Data  │    │ • Security      │    │ • User Accounts │
│ • Generate Keys │    │   Headers       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🏗️ Architecture

### Frontend (React)
- **Authentication**: Zero-knowledge login/registration
- **Encryption**: Client-side PBKDF2 + AES encryption
- **UI**: Material-UI components with dark theme
- **State Management**: React Context for authentication
- **Routing**: React Router for navigation

### Backend (Node.js/Express)
- **API**: RESTful endpoints for authentication and password management
- **Security**: Helmet, CORS, rate limiting, CSP headers
- **Database**: SQLite with encrypted data storage
- **HTTPS**: SSL/TLS support for production

### Security Implementation
- **Master Password**: Never transmitted to server in plain text
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Encryption**: AES-256-GCM for authenticated encryption
- **Rate Limiting**: 5 auth attempts per 15 minutes
- **CSP**: Strict Content Security Policy headers
- **HTTPS**: Optional SSL/TLS encryption

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd password-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Configure environment variables**
   ```bash
   NODE_ENV=production
   USE_HTTPS=true
   CLIENT_URL=https://your-domain.com
   SSL_KEY_PATH=/path/to/your/key.pem
   SSL_CERT_PATH=/path/to/your/cert.pem
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
password-manager/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── database/          # Database configuration
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (zero-knowledge)
- `POST /api/auth/login` - Login user (zero-knowledge)
- `GET /api/auth/salt/:username` - Get user's salt for client-side hashing
- `POST /api/auth/verify` - Verify master password

### Password Management
- `GET /api/passwords` - Get all passwords for user
- `POST /api/passwords` - Create new password entry
- `PUT /api/passwords/:id` - Update password entry
- `DELETE /api/passwords/:id` - Delete password entry
- `GET /api/passwords/categories` - Get password categories

## 🛡️ Security Implementation Details

### Zero-Knowledge Authentication Flow

1. **Registration**:
   ```
   Client: Generate salt → Hash password with PBKDF2 → Send hash + salt to server
   Server: Store hash + salt → Return success
   ```

2. **Login**:
   ```
   Client: Request salt → Hash password with salt → Send hash to server
   Server: Compare hashes → Return user data + salt
   Client: Store actual password for encryption
   ```

### Encryption Process

1. **Key Derivation**: PBKDF2 with 100,000 iterations
2. **Data Encryption**: AES-256-GCM with random IV
3. **Storage**: Encrypted data + IV + authentication tag

### Security Headers

- **Content Security Policy**: Prevents XSS and enforces secure resource loading
- **HTTP Strict Transport Security**: Enforces HTTPS
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Additional XSS protection

## 🎨 UI Features

### Dashboard
- **Password Cards**: Display passwords with copy functionality
- **Search**: Real-time search through passwords
- **Categories**: Filter passwords by category
- **Add/Edit**: Modal dialogs for password management

### Password Generator
- **Customizable Length**: 8-64 characters
- **Character Sets**: Uppercase, lowercase, numbers, symbols
- **Strength Indicator**: Real-time password strength analysis
- **Presets**: Common password patterns

### Security Indicators
- **Password Strength**: Visual strength meter
- **Copy Feedback**: Confirmation when copying passwords
- **Session Management**: Automatic logout on inactivity

## 🛠️ Development Scripts

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

### Server Configuration
```env
PORT=5000                    # HTTP port
HTTPS_PORT=5001             # HTTPS port
NODE_ENV=development        # Environment
USE_HTTPS=false            # Enable HTTPS
SSL_KEY_PATH=./ssl/key.pem # SSL private key
SSL_CERT_PATH=./ssl/cert.pem # SSL certificate
CLIENT_URL=http://localhost:3000 # CORS origin
```

### Security Configuration
```env
RATE_LIMIT_MAX_REQUESTS=100      # General rate limit
AUTH_RATE_LIMIT_MAX_REQUESTS=5   # Auth endpoint rate limit
RATE_LIMIT_WINDOW_MS=900000      # Rate limit window (15 min)
```

## 🛡️ Security Best Practices

### For Users
1. **Strong Master Password**: Use a strong, unique master password
2. **Regular Updates**: Update your master password periodically
3. **Secure Environment**: Only access from trusted devices
4. **HTTPS**: Always use HTTPS in production

### For Developers
1. **Environment Variables**: Never commit sensitive data
2. **SSL Certificates**: Use valid SSL certificates in production
3. **Rate Limiting**: Monitor and adjust rate limits as needed
4. **Security Headers**: Keep security headers up to date
5. **Dependencies**: Regularly update dependencies for security patches

## 🚀 Deployment

### Docker Deployment
```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Heroku**: Use environment variables for configuration
- **AWS**: Use EC2 with SSL certificates
- **Vercel**: Deploy frontend, use serverless functions for backend
- **DigitalOcean**: Use App Platform with SSL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This password manager is designed for educational and personal use. For production use in enterprise environments, additional security measures and audits may be required. Always follow your organization's security policies and consult with security professionals.

## 🔗 Related Links

- [PBKDF2 Specification](https://tools.ietf.org/html/rfc2898)
- [AES Encryption](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/) 