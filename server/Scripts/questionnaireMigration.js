import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import mongoose from 'mongoose';
import { Questionnaire } from '../models/Questionnaire.js';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI
  || 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0';

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

async function migrateData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    console.log('Fetching questions from Firestore using Web SDK...');
    // If your rules require authentication, you would import 'getAuth' and 'signInWithEmailAndPassword' here first
    
    const querySnapshot = await getDocs(collection(firestoreDb, 'subscribed_questions'));
    
    if (querySnapshot.empty) {
      console.log('No documents found. Check your collection name or Firestore rules.');
      return;
    }

    const firestoreQuestions = [];
    querySnapshot.forEach((doc) => {
      firestoreQuestions.push({ id: doc.id, ...doc.data() });
    });

    // --- TRANSFORM & SAVE DATA (Same transformation logic as before) ---
    // --- 3. TRANSFORM DATA ---
    const mongooseQuestions = firestoreQuestions.map((fsDoc) => {
      
      const formattedOptions = (fsDoc.answerOptions || []).map((opt, index) => ({
          label: opt,
          value: index.toString() 
      }));

      // --- ADD THIS MAPPING LOGIC ---
      let mappedPillar = fsDoc.esgCategory;
      
      // Look at your common.js file to see what `esgPillars` contains.
      // If it expects 'E', 'S', 'G', use this:
    //   if (mappedPillar === 'Environmental') mappedPillar = 'E';
    //   if (mappedPillar === 'Social') mappedPillar = 'S';
    //   if (mappedPillar === 'Governance') mappedPillar = 'G';

      // OR, if it expects lowercase, uncomment these instead:
      if (mappedPillar === 'Environmental') mappedPillar = 'environmental';
      if (mappedPillar === 'Social') mappedPillar = 'social';
      if (mappedPillar === 'Governance') mappedPillar = 'governance';
      // ------------------------------

      return {
        prompt: fsDoc.question,
        pillar: mappedPillar, // <--- Use the mapped variable here
        inputType: 'single_choice', 
        options: formattedOptions,
        order: fsDoc.number,
        tooltip: fsDoc.tooltip,
        category: fsDoc.category,
        objective: fsDoc.objective,
        indicator: fsDoc.indicator,
        exampleKpis: fsDoc.exampleKpis,
        industryRelevance: fsDoc.industryRelevance,
        sdgs: fsDoc.sdgs || []
      };
    });
    mongooseQuestions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    console.log(`Restoring ${mongooseQuestions.length} questions onto the existing compass questionnaire...`);

    const updated = await Questionnaire.findOneAndUpdate(
      { type: 'compass', version: 1 },
      { $set: { questions: mongooseQuestions } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      console.log('No existing compass questionnaire document found (type=compass, version=1). Nothing was updated.');
    } else {
      console.log(`Migration successful! Questionnaire "${updated.title}" now has ${updated.questions.length} questions.`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

migrateData();