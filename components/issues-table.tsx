export default function IssuesTable({ issues }: any) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Detected Issues</h3>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Title</th>
            <th>Count</th>
          </tr>
        </thead>

        <tbody>
          {issues?.map((i: any, idx: number) => (
            <tr key={idx}>
              <td>{i.severity}</td>
              <td>{i.title}</td>
              <td>{i.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}