
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { increment, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// --- LATEST KHABAR: FIREBASE CONFIGURATION ---
// IMPORTANT: Replace these placeholder values with your actual
// Firebase project's configuration credentials.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app, increment, serverTimestamp, Timestamp };

/*
--- FIRESTORE SCHEMA SPECIFICATION ---

Collection: 'articles'
  Document: (auto-generated Firestore ID)
  
  Fields:
  - id (string): Auto-generated document ID from Firestore
  - title (string): Article headline
  - content (string): Full article body (HTML supported)
  - category (string): Category filter ("Politics", "Cricket", "Tech", "World", etc.)
  - imageUrl (string): Public HTTPS URL to cover image
  - timestamp (Timestamp): Server-generated publish time
  - views (number): Article view counter (incremented atomically)
  - seoDescription (string): SEO meta description (fallback to truncated content)

Security Rules:
- Public READ: All users can read articles
- Public UPDATE: Only 'views' field via atomic increment()
- Admin WRITE: Only authenticated users can create/update/delete content
*/

