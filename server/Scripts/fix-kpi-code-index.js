import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI
  || 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0';
const DATABASE_NAME = 'test';
const STALE_INDEX_NAME = 'code_1';

async function fixKpiCodeIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected.');

    const db = mongoose.connection.useDb(DATABASE_NAME);
    const kpisCollection = db.collection('kpis');

    const indexes = await kpisCollection.indexes();
    const staleIndex = indexes.find((index) => index.name === STALE_INDEX_NAME);

    if (!staleIndex) {
      console.log(`No "${STALE_INDEX_NAME}" index found on kpis collection. Nothing to do.`);
      return;
    }

    console.log(`Found stale index "${STALE_INDEX_NAME}":`, staleIndex.key);
    await kpisCollection.dropIndex(STALE_INDEX_NAME);
    console.log(`Dropped index "${STALE_INDEX_NAME}" from kpis collection.`);

    const remaining = await kpisCollection.indexes();
    console.log('Remaining indexes:', remaining.map((index) => index.name));
  } catch (error) {
    console.error('Failed to fix kpis code index:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

fixKpiCodeIndex();
