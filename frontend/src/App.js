import { useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkTransaction = async () => {
    if (!amount || !location) {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/check-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          location,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Server error. Is backend running?");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="title-container">
        <h1 className="main-title">
          <span className="title-icon">💳</span> SmartSpend AI
        </h1>
        <p className="subtitle">AI-Powered Transaction Intelligence</p>
      </div>

      <div className="card">
        <h2>Transaction Checker</h2>

        <div className="input-group">
          <label className="label">Amount ($)</label>
          <input
            className="input"
            type="number"
            placeholder="e.g., 250.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="label">Location</label>
          <input
            className="input"
            type="text"
            placeholder="e.g., New York, NY"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button className="button" onClick={checkTransaction} disabled={loading}>
          {loading ? (
            <>
              <div className="loader"></div> Analyzing...
            </>
          ) : (
            "Analyze Transaction"
          )}
        </button>
      </div>

      {result && (
        <div
          className={`result-card ${
            result.isFraud ? "result-fraud" : "result-safe"
          }`}
        >
          <div className="result-header">
            <span className="result-icon">
              {result.isFraud ? "🚨" : "✅"}
            </span>
            <h2 className="result-title">{result.message}</h2>
          </div>
          
          <p className="result-score">
            Risk Score: <span>{result.riskScore}</span> / 100
          </p>

          {result.reasons.length > 0 && (
            <div className="reasons-container">
              <h4 className="reasons-title">Analysis Reasons</h4>
              {result.reasons.map((r, i) => (
                <div className="reason-item" key={i}>
                  <span className="reason-icon">⚠️</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;