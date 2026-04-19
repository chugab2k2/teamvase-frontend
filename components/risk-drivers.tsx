export default function RiskDrivers({ drivers }: any) {
  if (!drivers || drivers.length === 0) {
    return (
      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginTop: 20
      }}>
        <h3>Top Risk Drivers</h3>
        <p>No major risks detected</p>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      marginTop: 20
    }}>
      <h3>Top Risk Drivers</h3>

      <ul>
        {drivers.map((d: any, i: number) => (
          <li key={i}>
            {d.activity_name} (Criticality: {d.criticality})
          </li>
        ))}
      </ul>
    </div>
  );
}