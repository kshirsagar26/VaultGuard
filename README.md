# 🔐 VaultGuard - Secure Password Manager

A modern, enterprise-grade password manager with **zero-knowledge architecture**, client-side encryption, and a beautiful, responsive interface. VaultGuard provides military-grade security with an intuitive user experience.

![VaultGuard Logo](https://img.shields.io/badge/VaultGuard-Secure%20Password%20Manager-6366f1?style=for-the-badge&logo=shield-check)

## ✨ Key Features

### 🔒 **Security First**
- **Zero-Knowledge Architecture**: Your master password never leaves your device
- **Client-Side Encryption**: All passwords encrypted/decrypted in your browser
- **PBKDF2 + AES-256-GCM**: Industry-standard encryption with 100,000 iterations
- **HTTPS Support**: End-to-end encrypted communication
- **Content Security Policy**: Advanced XSS protection

### 🎨 **Modern UI/UX**
- **Dark/Light Mode**: Seamless theme switching with persistent preferences
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Material-UI Components**: Beautiful, accessible interface components
- **Real-time Search**: Instant password filtering and search
- **Multiple View Modes**: Grid and list views for different preferences

### 🛠️ **Advanced Functionality**
- **Password Generator**: Customizable strong password generation
- **Password Strength Analyzer**: Real-time strength assessment with feedback
- **Category Management**: Organize passwords by categories
- **Favorites System**: Mark and filter important passwords
- **Tags Support**: Add custom tags for better organization
- **Notes & URLs**: Store additional information with each password

### 📊 **Dashboard & Analytics**
- **Password Statistics**: Overview of your password collection
- **Security Insights**: Password strength distribution
- **Quick Actions**: One-click password operations
- **Export/Import**: Secure data portability

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vaultguard-password-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access VaultGuard**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔧 **Backend API**: http://localhost:5000
   - 📊 **Health Check**: http://localhost:5000/api/health

## 🏗️ Architecture Overview

### Frontend (React)
```
client/src/
├── components/           # UI Components
│   ├── Dashboard.js     # Main dashboard interface
│   ├── Login.js         # Enhanced login with VaultGuard branding
│   ├── Register.js      # User registration
│   ├── PasswordDialog.js # Add/edit password modal
│   ├── PasswordCard.js  # Password display cards
│   ├── Sidebar.js       # Navigation sidebar
│   ├── SearchAndFilter.js # Advanced search & filtering
│   └── ThemeToggle.js   # Dark/light mode toggle
├── contexts/            # React Contexts
│   ├── AuthContext.js   # Authentication & encryption
│   └── ThemeContext.js  # Theme management
└── App.js              # Main application
```

### Backend (Node.js/Express)
```
server/
├── database/           # Database management
│   ├── db.js          # SQLite setup & migrations
│   ├── viewer.js      # Database inspection tools
│   └── migrate.js     # Schema migrations
├── routes/            # API endpoints
│   ├── auth.js        # Authentication routes
│   └── passwords.js   # Password management
├── utils/             # Utilities
│   └── crypto.js      # Cryptographic functions
└── index.js          # Server entry point
```

## 🔐 Zero-Knowledge Security Architecture

VaultGuard implements true zero-knowledge architecture ensuring your data remains private:

### Authentication Flow
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

### Security Implementation
- **Master Password**: Never transmitted to server in plain text
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Encryption**: AES-256-GCM for authenticated encryption
- **Rate Limiting**: 5 auth attempts per 15 minutes
- **CSP**: Strict Content Security Policy headers
- **HTTPS**: SSL/TLS encryption support

## 🎨 UI/UX Features

### Dark/Light Mode
- **Automatic Detection**: Respects system preferences
- **Manual Toggle**: Easy theme switching
- **Persistent**: Remembers your preference
- **Consistent**: All components support both themes

### Dashboard Interface
- **Modern Cards**: Beautiful password display cards
- **Quick Actions**: Copy, edit, delete with one click
- **Search & Filter**: Advanced filtering by category, tags, favorites
- **Statistics**: Password collection overview
- **Responsive**: Works on all screen sizes

### Password Management
- **Strength Indicator**: Real-time password strength analysis
- **Generator**: Customizable password generation
- **Categories**: Predefined and custom categories
- **Tags**: Flexible tagging system
- **Notes**: Additional information storage
- **URLs**: Direct website access

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user (zero-knowledge) |
| `POST` | `/api/auth/login` | Login user (zero-knowledge) |
| `GET` | `/api/auth/salt/:username` | Get user's salt for client-side hashing |
| `POST` | `/api/auth/verify` | Verify master password |

### Password Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/passwords` | Get all passwords for user |
| `POST` | `/api/passwords` | Create new password entry |
| `PUT` | `/api/passwords/:id` | Update password entry |
| `DELETE` | `/api/passwords/:id` | Delete password entry |
| `GET` | `/api/passwords/categories` | Get password categories |

## 🛡️ Security Features

### Zero-Knowledge Authentication
1. **Registration**: Client hashes password with PBKDF2 → Sends hash to server
2. **Login**: Client requests salt → Hashes password → Sends hash to server
3. **Verification**: Server compares hashes → Returns user data

### Encryption Process
1. **Key Derivation**: PBKDF2 with 100,000 iterations
2. **Data Encryption**: AES-256-GCM with random IV
3. **Storage**: Encrypted data + IV + authentication tag

### Security Headers
- **Content Security Policy**: XSS prevention
- **HTTP Strict Transport Security**: HTTPS enforcement
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type protection
- **X-XSS-Protection**: Additional XSS protection

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

# Database tools
npm run db:view      # View database contents
npm run db:browser   # Interactive SQLite browser
```

## 🔧 Environment Configuration

### Server Environment Variables
```env
# Server Configuration
PORT=5000
HTTPS_PORT=5001
NODE_ENV=development
USE_HTTPS=false

# SSL Configuration
SSL_KEY_PATH=./ssl/key.pem
SSL_CERT_PATH=./ssl/cert.pem

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=900000
```

## 🚀 Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Configure Production Environment
```env
NODE_ENV=production
USE_HTTPS=true
CLIENT_URL=https://your-domain.com
SSL_KEY_PATH=/path/to/your/key.pem
SSL_CERT_PATH=/path/to/your/cert.pem
```

### 3. Start Production Server
```bash
npm start
```

### Deployment Options
- **Docker**: Containerized deployment
- **Heroku**: Cloud platform deployment
- **AWS**: EC2 with SSL certificates
- **Vercel**: Frontend + serverless backend
- **DigitalOcean**: App Platform deployment

## 📊 Database Management

### View Database Contents
```bash
npm run db:view
```

### Interactive SQLite Browser
```bash
npm run db:browser
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  master_password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Passwords table
CREATE TABLE passwords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  username TEXT,
  password TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  category TEXT DEFAULT 'General',
  tags TEXT,
  favorite BOOLEAN DEFAULT 0,
  expiry_date DATETIME,
  strength INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🎯 Use Cases

### Personal Use
- **Password Storage**: Secure storage for all your passwords
- **Password Generation**: Create strong, unique passwords
- **Organization**: Categorize and tag passwords
- **Accessibility**: Access from any device with internet

### Business Use
- **Team Management**: Secure password sharing (future feature)
- **Compliance**: Meet security compliance requirements
- **Audit Trail**: Track password changes and access
- **Integration**: API for enterprise integration

## 🤝 Contributing

We welcome contributions to VaultGuard! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure security best practices

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## ⚠️ Security Disclaimer

VaultGuard is designed for educational and personal use. For enterprise deployment, additional security measures, audits, and compliance verification may be required. Always consult with security professionals and follow your organization's security policies.

## 🔗 Related Resources

- [PBKDF2 Specification](https://tools.ietf.org/html/rfc2898)
- [AES Encryption Standard](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Material-UI Documentation](https://mui.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Security**: [Security Policy](https://github.com/your-repo/security/policy)

---

**Made with ❤️ and 🔒 for secure password management** 