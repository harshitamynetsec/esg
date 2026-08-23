import "dotenv/config";
import mongoose from "mongoose";

const DATABASE_NAME = "test";
const MONGO_URI = 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0'; 


async function checkRelations() {
    try {
        await mongoose.connect(MONGO_URI);

        const db = mongoose.connection.useDb(DATABASE_NAME);

        console.log("\n========== SDGs 1 & 8 ==========\n");

        const sdgs = await db.collection("sdgs")
            .find(
                { number: { $in: [1, 8] } },
                {
                    projection: {
                        _id: 1,
                        number: 1,
                        name: 1
                    }
                }
            )
            .sort({ number: 1 })
            .toArray();

        console.dir(sdgs, { depth: null });

        console.log("\n========== MIGRATED KPIs ==========\n");

        const kpis = await db.collection("kpis")
            .find(
                { code: { $regex: "^SDG" } },
                {
                    projection: {
                        _id: 1,
                        code: 1,
                        name: 1,
                        sdgId: 1,
                        sdgNumber: 1,
                        sdgName: 1
                    }
                }
            )
            .sort({ code: 1 })
            .toArray();

        console.dir(kpis, { depth: null });

        console.log("\n========== RELATION CHECK ==========\n");

        for (const kpi of kpis) {

            const sdg = sdgs.find(
                s => s.number === kpi.sdgNumber
            );

            if (!sdg) {
                console.log(
                    `❌ ${kpi.code}: SDG ${kpi.sdgNumber} NOT FOUND`
                );
                continue;
            }

            const idMatches =
                kpi.sdgId?.toString() ===
                sdg._id.toString();

            const nameMatches =
                kpi.sdgName === sdg.name;

            if (idMatches && nameMatches) {
                console.log(
                    `✅ ${kpi.code} → SDG ${sdg.number} (${sdg.name})`
                );
            } else {
                console.log(
                    `❌ ${kpi.code} → RELATION MISMATCH`
                );

                console.log({
                    kpiSdgId: kpi.sdgId,
                    actualSdgId: sdg._id,
                    kpiSdgName: kpi.sdgName,
                    actualSdgName: sdg.name,
                    kpiSdgNumber: kpi.sdgNumber,
                    actualSdgNumber: sdg.number
                });
            }
        }

    } catch (error) {

        console.error(
            "\n❌ CHECK FAILED\n"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        await mongoose.disconnect();

        console.log(
            "\nMongoDB connection closed."
        );
    }
}

checkRelations();