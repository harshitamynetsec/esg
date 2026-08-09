import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import mongoose from 'mongoose';
import { SDG } from '../models/sdg.js'; // Adjust path to your SDG model
import { esgPillars } from '../models/common.js'; // Adjust path to your common.js

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAeg_Z1R2Q-iN4xrFgl5LZl3B7MZ3l-h6g',
  appId: '1:1051687159410:web:5c4aba63b632366f2de4eb',
  messagingSenderId: '1051687159410',
  projectId: 'esg-app-84533',
  authDomain: 'esg-app-84533.firebaseapp.com',
  storageBucket: 'esg-app-84533.firebasestorage.app',
};

// Initialize Firebase Web SDK
const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app);
const MONGO_URI = 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0'; // Ensure the DB name is included if needed

async function migrateSDGs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    console.log('Fetching SDGs from Firestore...');
    // Replace 'sdgs' with your actual Firestore collection name if it is different
    const querySnapshot = await getDocs(collection(firestoreDb, 'sdgs'));
    
    if (querySnapshot.empty) {
      console.log('No documents found in the Firestore collection.');
      return;
    }

    const firestoreSDGs = [];
    querySnapshot.forEach((doc) => {
      firestoreSDGs.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Found ${firestoreSDGs.length} SDGs in Firestore.`);

    // --- TRANSFORM DATA ---
    const mongooseSDGs = firestoreSDGs.map((fsDoc) => {
      
      // Transform colorHex "0xFFA31C44" -> "#A31C44"
      let formattedColor = fsDoc.colorHex;
      if (formattedColor && formattedColor.startsWith('0xFF')) {
        formattedColor = '#' + formattedColor.substring(4);
      } else if (formattedColor && formattedColor.startsWith('0x')) {
        formattedColor = '#' + formattedColor.substring(2);
      }

      // Ensure categories fit within esgPillars enum
      const mappedPillars = (fsDoc.categories || []).map(cat => cat.toLowerCase()).filter(cat => esgPillars.includes(cat));

      return {
        number: fsDoc.serialNum,
        name: fsDoc.title,
        shortName: fsDoc.short,
        description: fsDoc.description,
        color: formattedColor,
        iconUrl: fsDoc.iconUrl,
        pillars: mappedPillars
      };
    });

    // --- SAVE TO MONGODB ---
    console.log('Saving to MongoDB...');
    
    let savedCount = 0;
    
    // We use findOneAndUpdate with upsert so you can run the script safely multiple times
    // without triggering MongoDB 'unique' constraint errors on the 'number' field.
    for (const sdgData of mongooseSDGs) {
      await SDG.findOneAndUpdate(
        { number: sdgData.number }, // Find by SDG number
        { $set: sdgData },          // Update with new data
        { upsert: true, new: true, runValidators: true } // Create if doesn't exist, validate
      );
      savedCount++;
    }

    console.log(`🎉 Migration successful! Upserted ${savedCount} SDGs into MongoDB.`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected. Exiting process.');
    process.exit(0);
  }
}

migrateSDGs();