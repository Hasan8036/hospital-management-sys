import { db } from './firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';
import { INITIAL_ROOMS } from './data.js';

export async function seedRooms() {
  for (const room of INITIAL_ROOMS) {
    await setDoc(doc(collection(db, 'rooms'), room.id), room);
  }
  console.log('Seeded!');
}