import { useState } from "react";
import { mockRecommendations } from "../../../shared/mockData";

export default function FM_Recommendations() {
  const [recs, setRecs] = useState(mockRecommendations);

  const handleDecision = (id, decision) => {
    setRecs(recs.map(r => r.id === id ? { ...r, status: decision } : r));
  };

  return (
    <div>
      <h2>AI Recommendations</h2>
      {recs.map(rec => (
        <div key={rec.id} className="card">
          <h4>{rec.room}</h4>
          <p>{rec.message}</p>
          <p>Status: {rec.status}</p>

          {rec.status === "Pending" && (
            <>
              <button onClick={() => handleDecision(rec.id, "Accepted")}>
                Accept
              </button>
              <button onClick={() => handleDecision(rec.id, "Rejected")}>
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
