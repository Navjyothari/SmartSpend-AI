const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Simulated user profile
const userProfile = {
    usualLocation: "Mumbai",
    avgTransaction: 5000,
    lastTransactions: [2000, 3000, 4000, 2500]
};

app.post("/check-transaction", (req, res) => {
    const { amount, location } = req.body;

    let riskScore = 0;
    let reasons = [];

    // Rule 1: Large amount
    if (amount > userProfile.avgTransaction * 4) {
        riskScore += 50;
        reasons.push("Unusually high transaction amount");
    }

    // Rule 2: Location anomaly
    if (location !== userProfile.usualLocation) {
        riskScore += 30;
        reasons.push("Transaction from different location");
    }

    // Rule 3: Sudden spike
    const avgRecent =
        userProfile.lastTransactions.reduce((a, b) => a + b, 0) /
        userProfile.lastTransactions.length;

    if (amount > avgRecent * 3) {
        riskScore += 20;
        reasons.push("Spending spike detected");
    }

    const isFraud = riskScore >= 50;

    res.json({
        isFraud,
        riskScore,
        message: isFraud ? "🚨 Fraud Detected" : "✅ Safe Transaction",
        reasons
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));