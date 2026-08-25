import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Objective } from '../models/index.js';

const seedFileUrl = new URL('../seed/objectives-seed-data.json', import.meta.url);
const DEFAULT_START_DATE = '2026-08-25';
const DEFAULT_TARGET_DATE = '2030-12-31';

const parseDate = (value, label) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} must be a valid date. Received: ${value}`);
  }

  return date;
};

const loadSeedData = async () => {
  const rawSeedData = await fs.readFile(seedFileUrl, 'utf8');
  const seedData = JSON.parse(rawSeedData);

  if (!Array.isArray(seedData.objectives)) {
    throw new Error('Seed data must contain an objectives array.');
  }

  return seedData.objectives;
};

const buildObjective = ({ seedObjective, startDate, targetDate }) => ({
  organization: null,
  sdgNumber: seedObjective.sdgNumber,
  title: seedObjective.title,
  description: seedObjective.description,
  smart: {
    specific: seedObjective.description,
    measurable: seedObjective.description,
    achievable: seedObjective.description,
    relevant: seedObjective.description,
    timeBound: seedObjective.description,
  },
  startDate,
  targetDate,
  status: 'active',
});

const seedObjectives = async () => {
  await mongoose.connect(env.mongoUri);

  const startDate = parseDate(process.env.OBJECTIVES_START_DATE || DEFAULT_START_DATE, 'OBJECTIVES_START_DATE');
  const targetDate = parseDate(process.env.OBJECTIVES_TARGET_DATE || DEFAULT_TARGET_DATE, 'OBJECTIVES_TARGET_DATE');

  if (targetDate <= startDate) {
    throw new Error('OBJECTIVES_TARGET_DATE must be after OBJECTIVES_START_DATE.');
  }

  const seedObjectivesData = await loadSeedData();

  let upsertedCount = 0;
  let modifiedCount = 0;
  let matchedCount = 0;

  for (const seedObjective of seedObjectivesData) {
    const objectiveData = buildObjective({
      seedObjective,
      startDate,
      targetDate,
    });

    const result = await Objective.updateOne(
      {
        sdgNumber: seedObjective.sdgNumber,
        title: seedObjective.title,
      },
      { $set: objectiveData },
      { upsert: true, runValidators: true },
    );

    matchedCount += result.matchedCount;
    upsertedCount += result.upsertedCount;
    modifiedCount += result.modifiedCount;
  }

  console.log(
    `Master objectives migration complete. ` +
      `Processed ${seedObjectivesData.length}, inserted ${upsertedCount}, updated ${modifiedCount}, matched ${matchedCount}.`,
  );
};

seedObjectives()
  .catch((error) => {
    console.error('Objectives migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
