import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [salt, setSalt] = useState(null);
  const [masterPassword, setMasterPassword] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedSalt = localStorage.getItem('salt');
    
    if (savedUser && savedSalt) {
      setUser(JSON.parse(savedUser));
      setSalt(savedSalt);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, userSalt, password) => {
    setUser(userData);
    setSalt(userSalt);
    setMasterPassword(password);
    setIsAuthenticated(true);
    
    // Store user data in localStorage (salt is needed for encryption)
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('salt', userSalt);
  };

  const logout = () => {
    setUser(null);
    setSalt(null);
    setMasterPassword(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('salt');
  };

  // Hash master password for server communication (zero-knowledge)
  const hashMasterPasswordForServer = (password, salt) => {
    // Use PBKDF2 with high iterations for server authentication
    const iterations = 100000;
    const keyLength = 32;
    
    return CryptoJS.PBKDF2(password, salt, {
      keySize: keyLength / 4,
      iterations: iterations,
      hasher: CryptoJS.algo.SHA256
    }).toString();
  };

  // Client-side encryption utilities
  const deriveKey = async (password, salt) => {
    const iterations = 100000;
    const keyLength = 32;
    const digest = 'sha256';
    
    return CryptoJS.PBKDF2(password, salt, {
      keySize: keyLength / 4, // CryptoJS uses 32-bit words
      iterations: iterations,
      hasher: CryptoJS.algo.SHA256
    });
  };

  const encrypt = (data, key) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return iv.toString() + ':' + encrypted.toString();
  };

  const decrypt = (encryptedData, key) => {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encrypted = parts[1];
    
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const generatePassword = (length = 16, options = {}) => {
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
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  };

  const checkPasswordStrength = (password) => {
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
  };

  const value = {
    user,
    salt,
    masterPassword,
    isAuthenticated,
    login,
    logout,
    hashMasterPasswordForServer,
    deriveKey,
    encrypt,
    decrypt,
    generatePassword,
    checkPasswordStrength
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 