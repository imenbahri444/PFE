import { mockStats } from "../../../shared/mockData";

export default function FM_Dashboard() {
  return (
    <div>
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        {mockStats.map((stat, index) => (
          <div key={index} className="card">
            <h4>{stat.title}</h4>
            <p className="big-number">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
