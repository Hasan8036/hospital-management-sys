# Firebase Setup Guide — Cloud Data Storage

This app currently stores all data in React state (in-memory).
Follow these steps to connect it to Firebase Firestore so data
persists across all devices and sessions.

---

## Step 1 — Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it "family-care-hospital"
3. Disable Google Analytics (not needed) → **Create project**
4. In the left sidebar: **Build → Firestore Database**
5. Click **Create database** → choose **Start in test mode** → pick a region → **Done**

---

## Step 2 — Get your Firebase config

1. In Firebase Console: click the ⚙️ gear → **Project settings**
2. Scroll to **Your apps** → click **</>** (web)
3. Register the app with any nickname
4. Copy the `firebaseConfig` object shown

---

## Step 3 — Install Firebase in the app

```bash
npm install firebase
```

---

## Step 4 — Create src/firebase.js

Create this file in your `src/` folder with your own config values:

```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

## Step 5 — Seed initial data (one-time)

Add this to `src/seed.js` and run it once from your browser console
or a temporary button in the app:

```js
import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { INITIAL_ROOMS } from './data';

export async function seedRooms() {
  for (const room of INITIAL_ROOMS) {
    await setDoc(doc(collection(db, 'rooms'), room.id), room);
  }
  console.log('Seeded!');
}
```

---

## Step 6 — Replace useState with Firestore in App.jsx

Replace the `useState(INITIAL_ROOMS)` logic with real-time Firestore reads/writes.

### Load rooms from Firestore

```js
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// In App():
const [rooms, setRooms] = useState([]);

useEffect(() => {
  const unsub = onSnapshot(collection(db, 'rooms'), snapshot => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => a.id.localeCompare(b.id));
    setRooms(data);
  });
  return unsub;
}, []);
```

### Update a room (admit / discharge / checklist)

Replace the `setRooms(prev => ...)` calls with Firestore writes:

```js
// Example: admit patient
async function admitPatient(roomId, data) {
  await updateDoc(doc(db, 'rooms', roomId), {
    status: 'occupied',
    patient: data.patient,
    mrNumber: data.mrNumber,
    contactNumber: data.contactNumber,
    admitDate: data.admitDate,
    admitTime: data.admitTime,
    allocations: increment(1),   // import { increment } from 'firebase/firestore'
  });
}

// Example: toggle checklist item
async function toggleCheck(roomId, checkId) {
  const room = rooms.find(r => r.id === roomId);
  await updateDoc(doc(db, 'rooms', roomId), {
    [`checklist.${checkId}`]: !room.checklist[checkId]
  });
}
```

---

## Security rules (before going live)

In Firebase Console → Firestore → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read, write: if true; // Tighten this with auth later
    }
  }
}
```

---

## Vercel Deployment

1. Push the project to a GitHub repo
2. Go to https://vercel.com → **New Project** → import your repo
3. Framework: **Vite** (auto-detected)
4. Add environment variables in Vercel dashboard under **Settings → Environment Variables**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc. (one for each firebaseConfig value)
5. Update `src/firebase.js` to use:
   ```js
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   ```
6. Click **Deploy** — done! Vercel auto-redeploys on every GitHub push.

---

## Cost

Firebase Firestore free tier (Spark plan) gives you:
- **50,000 reads/day**
- **20,000 writes/day**
- **1 GB storage**

This is more than enough for a single hospital ward.
