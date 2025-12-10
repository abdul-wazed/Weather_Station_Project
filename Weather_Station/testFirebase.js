// testFirebase.js
const admin = require("firebase-admin");
const path = require("path");

console.log("🔍 Testing Firebase Admin SDK connection...");

// Load your service account file
const serviceAccount = require(path.join(__dirname, "serviceAccount.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://weatherstation-wazed-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();

async function testWrite() {
  try {
    console.log("➡ Attempting to write test data...");

    const ref = db.ref("testConnection");
    await ref.push({
      message: "Hello Firebase",
      timestamp: new Date().toISOString()
    });

    console.log("✅ SUCCESS: Firebase write worked!");
  } catch (err) {
    console.error("❌ FAILED:", err);
  }
}

testWrite();
