import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";

// ==================================================
// CONFIGURATION
// ==================================================

const DATABASE_NAME = "test";

const MONGO_URI = 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0'; 


const SDG_COLLECTION = "sdgs";

// IMPORTANT:
// SDG KPIs are master/template definitions.
// Keep them separate from company-specific KPIs.
const KPI_COLLECTION = "kpi_templates";

const JSON_FILE = "./server/seed/sdg-kpis.json";

// ==================================================
// MIGRATION
// ==================================================

async function migrateKPIs() {

    try {

        console.log("==============================================");
        console.log("        ESG KPI MIGRATION");
        console.log("==============================================");
        console.log("");

        // --------------------------------------------------
        // CONNECT TO MONGODB
        // --------------------------------------------------

        if (!MONGO_URI) {
            throw new Error(
                "MONGO_URI is not defined in environment variables."
            );
        }

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected.");
        console.log("");

        const db = mongoose.connection.useDb(
            DATABASE_NAME
        );

        const sdgsCollection =
            db.collection(SDG_COLLECTION);

        const kpisCollection =
            db.collection(KPI_COLLECTION);

        // --------------------------------------------------
        // READ JSON FILE
        // --------------------------------------------------

        if (!fs.existsSync(JSON_FILE)) {
            throw new Error(
                `KPI JSON file not found: ${JSON_FILE}`
            );
        }

        const fileContent =
            fs.readFileSync(
                JSON_FILE,
                "utf8"
            );

        const data =
            JSON.parse(fileContent);

        if (
            !data.kpis ||
            !Array.isArray(data.kpis)
        ) {
            throw new Error(
                "Invalid JSON format. Expected { kpis: [...] }"
            );
        }

        console.log(
            `Loaded ${data.kpis.length} KPIs from JSON.`
        );

        console.log("");

        // --------------------------------------------------
        // VALIDATE KPI COUNT
        // --------------------------------------------------

        if (data.kpis.length !== 51) {

            console.warn(
                `WARNING: Expected 51 KPIs but found ${data.kpis.length}.`
            );

            console.log("");
        }

        // --------------------------------------------------
        // VALIDATE SDGs
        // --------------------------------------------------

        console.log(
            "Checking SDG relationships..."
        );

        const sdgNumbers = [
            ...new Set(
                data.kpis.map(
                    kpi => kpi.sdgNumber
                )
            )
        ];

        const sdgs =
            await sdgsCollection
                .find({
                    number: {
                        $in: sdgNumbers
                    }
                })
                .toArray();

        const sdgMap =
            new Map();

        sdgs.forEach(
            sdg => {
                sdgMap.set(
                    sdg.number,
                    sdg
                );
            }
        );

        // --------------------------------------------------
        // CHECK MISSING SDGs
        // --------------------------------------------------

        const missingSdgs =
            sdgNumbers.filter(
                number =>
                    !sdgMap.has(number)
            );

        if (
            missingSdgs.length > 0
        ) {

            console.error(
                "ERROR: Missing SDGs:"
            );

            missingSdgs.forEach(
                number => {
                    console.error(
                        `  SDG ${number}`
                    );
                }
            );

            throw new Error(
                "Migration stopped because required SDGs are missing."
            );
        }

        console.log(
            `All ${sdgNumbers.length} SDGs found.`
        );

        console.log("");

        // --------------------------------------------------
        // VALIDATE SDG DATA
        // --------------------------------------------------

        for (
            const [number, sdg]
            of sdgMap
        ) {

            if (
                !sdg._id ||
                !sdg.name
            ) {

                throw new Error(
                    `SDG ${number} is missing _id or name.`
                );
            }
        }

        // --------------------------------------------------
        // VALIDATE KPI CODES
        // --------------------------------------------------

        console.log(
            "Checking KPI codes..."
        );

        const codes =
            data.kpis.map(
                kpi => kpi.code
            );

        const duplicateCodes =
            codes.filter(
                (code, index) =>
                    codes.indexOf(code) !== index
            );

        if (
            duplicateCodes.length > 0
        ) {

            console.error(
                "Duplicate KPI codes found:"
            );

            [
                ...new Set(
                    duplicateCodes
                )
            ].forEach(
                code => {
                    console.error(
                        `  ${code}`
                    );
                }
            );

            throw new Error(
                "Migration stopped because duplicate KPI codes exist."
            );
        }

        console.log(
            `All ${codes.length} KPI codes are unique.`
        );

        console.log("");

        // --------------------------------------------------
        // VALIDATE EACH KPI'S SDG
        // --------------------------------------------------

        console.log(
            "Validating KPI → SDG mappings..."
        );

        for (
            const kpi of data.kpis
        ) {

            const sdg =
                sdgMap.get(
                    kpi.sdgNumber
                );

            if (!sdg) {

                throw new Error(
                    `${kpi.code} references missing SDG ${kpi.sdgNumber}`
                );
            }

            if (!kpi.name) {

                throw new Error(
                    `${kpi.code} is missing KPI name`
                );
            }
        }

        console.log(
            "All KPI → SDG mappings are valid."
        );

        console.log("");

        // --------------------------------------------------
        // SHOW SDG DISTRIBUTION
        // --------------------------------------------------

        console.log(
            "KPI distribution:"
        );

        for (
            let number = 1;
            number <= 17;
            number++
        ) {

            const count =
                data.kpis.filter(
                    kpi =>
                        kpi.sdgNumber === number
                ).length;

            const sdg =
                sdgMap.get(number);

            console.log(
                `  SDG ${number}: ${count} KPIs — ${sdg?.name || "Unknown"}`
            );
        }

        console.log("");

        // --------------------------------------------------
        // CREATE UNIQUE INDEX
        // --------------------------------------------------

        console.log(
            "Creating KPI template indexes..."
        );

        await kpisCollection.createIndex(
            {
                code: 1
            },
            {
                unique: true
            }
        );

        // Useful for retrieving all KPIs for an SDG
        await kpisCollection.createIndex(
            {
                sdgId: 1
            }
        );

        // Useful when querying SDG number
        await kpisCollection.createIndex(
            {
                sdgNumber: 1
            }
        );

        console.log(
            "Indexes ready."
        );

        console.log("");

        // --------------------------------------------------
        // PREPARE DOCUMENTS
        // --------------------------------------------------

        const operations = [];

        for (
            const kpi of data.kpis
        ) {

            const sdg =
                sdgMap.get(
                    kpi.sdgNumber
                );

            const now =
                new Date();

            const kpiDocument = {

                // ------------------------------------------
                // KPI IDENTITY
                // ------------------------------------------

                code:
                    kpi.code,

                name:
                    kpi.name,

                description:
                    kpi.description ||
                    null,

                // ------------------------------------------
                // KPI TARGET
                // ------------------------------------------

                target:
                    kpi.target ||
                    null,

                unit:
                    kpi.unit ||
                    null,

                // ------------------------------------------
                // SDG RELATIONSHIP
                // ------------------------------------------

                sdgId:
                    sdg._id,

                sdgNumber:
                    sdg.number,

                sdgName:
                    sdg.name,

                // ------------------------------------------
                // METADATA
                // ------------------------------------------

                status:
                    "active",

                source:
                    data.source ||
                    "ESG Report",

                sourceVersion:
                    data.version ||
                    null,

                createdAt:
                    now,

                updatedAt:
                    now
            };

            operations.push({

                updateOne: {

                    filter: {
                        code: kpi.code
                    },

                    update: {
                        $set: kpiDocument
                    },

                    upsert: true
                }

            });
        }

        // --------------------------------------------------
        // MIGRATE
        // --------------------------------------------------

        console.log(
            "Starting KPI template migration..."
        );

        console.log("");

        const result =
            await kpisCollection.bulkWrite(
                operations,
                {
                    ordered: true
                }
            );

        // --------------------------------------------------
        // RESULTS
        // --------------------------------------------------

        console.log(
            "=============================================="
        );

        console.log(
            "        MIGRATION COMPLETED"
        );

        console.log(
            "=============================================="
        );

        console.log(
            `Matched:  ${result.matchedCount}`
        );

        console.log(
            `Modified: ${result.modifiedCount}`
        );

        console.log(
            `Inserted: ${result.upsertedCount}`
        );

        console.log("");

        // --------------------------------------------------
        // FINAL VALIDATION
        // --------------------------------------------------

        const total =
            await kpisCollection.countDocuments();

        console.log(
            `Total KPI templates in MongoDB: ${total}`
        );

        if (
            total !== data.kpis.length
        ) {

            throw new Error(
                `Migration validation failed. Expected ${data.kpis.length}, found ${total}.`
            );
        }

        console.log("");

        // --------------------------------------------------
        // VALIDATE EVERY RELATIONSHIP
        // --------------------------------------------------

        console.log(
            "Validating stored SDG relationships..."
        );

        const migratedKPIs =
            await kpisCollection
                .find({})
                .toArray();

        let relationshipErrors = 0;

        for (
            const kpi
            of migratedKPIs
        ) {

            const sdg =
                sdgMap.get(
                    kpi.sdgNumber
                );

            const validId =
                kpi.sdgId?.toString() ===
                sdg._id.toString();

            const validName =
                kpi.sdgName ===
                sdg.name;

            if (
                !validId ||
                !validName
            ) {

                relationshipErrors++;

                console.error(
                    `❌ Relationship error: ${kpi.code}`
                );
            }
        }

        if (
            relationshipErrors > 0
        ) {

            throw new Error(
                `${relationshipErrors} KPI → SDG relationships are invalid.`
            );
        }

        console.log(
            "All KPI → SDG relationships are valid."
        );

        console.log("");

        // --------------------------------------------------
        // FINAL SUCCESS
        // --------------------------------------------------

        console.log(
            "=============================================="
        );

        console.log(
            "        SUCCESS"
        );

        console.log(
            "=============================================="
        );

        console.log(
            `51 SDG KPIs migrated successfully.`
        );

        console.log(
            `Collection: test.${KPI_COLLECTION}`
        );

        console.log(
            `SDGs linked: ${sdgNumbers.length}`
        );

        console.log(
            "Relationships validated: YES"
        );

        console.log("");

    } catch (error) {

        console.error("");
        console.error(
            "❌ KPI MIGRATION FAILED"
        );

        console.error("");

        console.error(error);

        process.exitCode = 1;

    } finally {

        await mongoose.disconnect();

        console.log(
            "\nMongoDB connection closed."
        );
    }
}

// ==================================================
// RUN
// ==================================================

migrateKPIs();