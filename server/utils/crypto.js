const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// PBKDF2 configuration
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 32; // 256 bits
const PBKDF2_DIGEST = 'sha256';

// AES configuration
const AES_ALGORITHM = 'aes-256-gcm';
const AES_IV_LENGTH = 16;
const AES_TAG_LENGTH = 16;

/**
 * Generate a random salt for PBKDF2
 */
function generateSalt(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Derive encryption key from master password using PBKDF2
 */
function deriveKey(masterPassword, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(masterPassword, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key);
      }
    });
  });
}

/**
 * Hash master password for storage (using bcrypt for additional security)
 */
async function hashMasterPassword(masterPassword) {
  const saltRounds = 12;
  return await bcrypt.hash(masterPassword, saltRounds);
}

/**
 * Verify master password hash
 */
async function verifyMasterPassword(masterPassword, hash) {
  return await bcrypt.compare(masterPassword, hash);
}

/**
 * Encrypt data using AES-256-GCM
 */
function encrypt(data, key) {
  const iv = crypto.randomBytes(AES_IV_LENGTH);
  const cipher = crypto.createCipher(AES_ALGORITHM, key);
  cipher.setAAD(Buffer.from('password-manager', 'utf8'));
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  // Return IV + Tag + Encrypted data
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt data using AES-256-GCM
 */
function decrypt(encryptedData, key) {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipher(AES_ALGORITHM, key);
  decipher.setAAD(Buffer.from('password-manager', 'utf8'));
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate a secure random password
 */
function generatePassword(length = 16, options = {}) {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options;
  
  let charset = '';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (charset === '') {
    throw new Error('At least one character set must be selected');
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }
  
  return password;
}

/**
 * Check password strength
 */
function checkPasswordStrength(password) {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');
  
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include numbers');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');
  
  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeated characters');
  }
  
  if (/123|abc|qwe|password|admin/i.test(password)) {
    score -= 2;
    feedback.push('Avoid common patterns');
  }
  
  // Determine strength level
  let strength = 'Very Weak';
  if (score >= 6) strength = 'Strong';
  else if (score >= 4) strength = 'Medium';
  else if (score >= 2) strength = 'Weak';
  
  return {
    score: Math.max(0, score),
    strength,
    feedback: feedback.length > 0 ? feedback : ['Good password!']
  };
}

module.exports = {
  generateSalt,
  deriveKey,
  hashMasterPassword,
  verifyMasterPassword,
  encrypt,
  decrypt,
  generatePassword,
  checkPasswordStrength
}; 