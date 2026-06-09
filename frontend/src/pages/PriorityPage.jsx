import PageShell from "../components/PageShell";
import PriorityQueue from "../components/PriorityQueue";

export default function PriorityPage() {
  return (
    <PageShell
      title="Maintenance Priority Queue"
      subtitle="Rank machines by urgency, risk level, and recommended maintenance action."
    >
      <PriorityQueue />
    </PageShell>
  );
}