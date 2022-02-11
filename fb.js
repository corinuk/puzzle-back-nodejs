const dotenv = require("dotenv");
dotenv.config();

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  onAuthStateChanged,
  getRedirectResult,
} = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

initializeApp(firebaseConfig);
const authService = getAuth();
const authStateChanged = onAuthStateChanged;
const getResult = getRedirectResult;
const dbService = getFirestore();
const storageService = getStorage();

module.exports = {
  authService,
  authStateChanged,
  getResult,
  dbService,
  storageService,
};
