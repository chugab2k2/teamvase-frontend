export default function MetricCard({ title, value }: any) {
  return (
    <div>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}