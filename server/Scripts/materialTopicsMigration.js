import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import mongoose from 'mongoose';
import { MaterialTopic } from '../models/materialTopic.js'; // Adjust path
import { SDG } from '../models/sdg.js'; // Adjust path
import { esgPillars } from '../models/common.js'; // Adjust path

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
const MONGO_URI = 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0';

// A dummy organization ID to satisfy the index/schema if these are global templates
// If you have a real Organization ID, replace this string.
const DEFAULT_ORGANIZATION_ID = new mongoose.Types.ObjectId(); 

async function migrateMaterialTopics() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    // --- STEP 1: CREATE SDG MAPPINGS ---
    console.log('Building SDG ID maps to resolve references...');
    
    // A. Get Firestore SDGs (Maps Firestore ID -> Serial Number)
    const fsSdgsSnap = await getDocs(collection(firestoreDb, 'sdgs'));
    const firestoreSdgMap = {}; 
    fsSdgsSnap.forEach(doc => {
      firestoreSdgMap[doc.id] = doc.data().serialNum;
    });

    // B. Get MongoDB SDGs (Maps Serial Number -> MongoDB ObjectId)
    const mongoSdgs = await SDG.find({});
    const mongoSdgMap = {};
    mongoSdgs.forEach(sdg => {
      mongoSdgMap[sdg.number] = sdg._id;
    });

    // --- STEP 2: FETCH MATERIAL TOPICS FROM FIRESTORE ---
    console.log('Fetching Material Topics from Firestore...');
    const querySnapshot = await getDocs(collection(firestoreDb, 'material_topics')); // Update collection name if different
    
    if (querySnapshot.empty) {
      console.log('No documents found in the Firestore collection.');
      return;
    }

    const firestoreTopics = [];
    querySnapshot.forEach((doc) => {
      firestoreTopics.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Found ${firestoreTopics.length} Material Topics in Firestore.`);

    // --- STEP 3: TRANSFORM DATA ---
    const mongooseTopics = firestoreTopics.map((fsDoc) => {
      
      // Transform colorHex "0xFFE01483" -> "#E01483"
      let formattedColor = fsDoc.colorHex;
      if (formattedColor && formattedColor.startsWith('0xFF')) {
        formattedColor = '#' + formattedColor.substring(4);
      } else if (formattedColor && formattedColor.startsWith('0x')) {
        formattedColor = '#' + formattedColor.substring(2);
      }

      // Map category to valid enum
      let mappedPillar = (fsDoc.category || '').toLowerCase();
      if (!esgPillars.includes(mappedPillar)) {
        mappedPillar = 'social'; // Fallback if missing/invalid
      }

      // Resolve SDG IDs: Firestore ID -> Serial Number -> MongoDB ObjectId
      const resolvedSdgIds = (fsDoc.sdgIds || []).map(fsId => {
        const serialNum = firestoreSdgMap[fsId];
        return mongoSdgMap[serialNum];
      }).filter(Boolean); // .filter(Boolean) removes any undefined values

      return {
        organization: DEFAULT_ORGANIZATION_ID,
        title: fsDoc.name,
        pillar: mappedPillar,
        serialNum: fsDoc.serialNum,
        color: formattedColor,
        sdgs: resolvedSdgIds,
        impactScore: 3, // Default values required by your Mongoose schema
        stakeholderPriority: 3,
        financialMateriality: 3,
        status: 'active'
      };
    });

    // --- STEP 4: SAVE TO MONGODB ---
    console.log('Saving to MongoDB...');
    let savedCount = 0;
    
    for (const topicData of mongooseTopics) {
      // Using findOneAndUpdate prevents duplicate key errors on (organization, title) index
      await MaterialTopic.findOneAndUpdate(
        { title: topicData.title, organization: topicData.organization }, 
        { $set: topicData }, 
        { upsert: true, new: true, runValidators: true } 
      );
      savedCount++;
    }

    console.log(`🎉 Migration successful! Upserted ${savedCount} Material Topics into MongoDB.`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected. Exiting process.');
    process.exit(0);
  }
}

migrateMaterialTopics();