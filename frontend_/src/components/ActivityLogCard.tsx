type Props = {
  log: {
    id: number;
    action: string;
    related_object_id?: number;
    timestamp: string;
    details?: string;
  };
};

export default function ActivityLogCard({ log }: Props) {
  const formattedDate = new Date(log.timestamp).toLocaleString();

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white hover:scale-[1.02] transition transform">
      <h3 className="text-lg font-semibold mb-2 capitalize">{log.action.replace(/_/g, " ")}</h3>
      <p className="text-sm text-gray-300 mb-1">
        Related ID: {log.related_object_id ?? "—"}
      </p>
      <p className="text-sm text-gray-400 mb-2">Timestamp: {formattedDate}</p>
      {log.details && (
        <p className="text-sm text-gray-200 whitespace-pre-wrap">{log.details}</p>
      )}
    </div>
  );
}