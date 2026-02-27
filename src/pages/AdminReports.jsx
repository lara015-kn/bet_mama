import { useEffect, useState } from "react";

export default function AdminReports() {

  const [profit, setProfit] = useState(0);
  const [summary, setSummary] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL
  useEffect(() => {

    fetch(`${BASE_URL}/api/admin/reports/profit-report`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setProfit(data.totalProfit));

    fetch(`${BASE_URL}/api/admin/reports/daily-summary`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setSummary(data));

  }, []);

  return (
    <div className="admin-card">

      <h3>📊 Platform Profit</h3>

      <p style={{ fontSize: "22px", fontWeight: "bold", color: "green" }}>
        ₹ {profit}
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h3>📅 Today's Summary</h3>

      {summary && (
        <div style={{ lineHeight: "28px" }}>
          <p>🎯 Total Bets: ₹ {summary.totalBetsAmount || 0}</p>
          <p>💰 Total Withdrawals: ₹ {summary.totalWithdraw || 0}</p>
          <p>🏦 Total Deposits: ₹ {summary.totalDepositAmount || 0}</p>
        </div>
      )}

    </div>
  );
}
