'use client';

interface Visit {
  created_at: string;
  ip_address: string;
  city?: string;
  country?: string;
  page_path: string;
  device_type?: string;
  is_bot?: boolean;
}

export default function RecentVisitsTable({ visits }: { visits: Visit[] }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        Ingen nylige besøk loggført
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
            <th className="py-3 px-4 font-medium">Tidspunkt</th>
            <th className="py-3 px-4 font-medium">IP</th>
            <th className="py-3 px-4 font-medium">Sted</th>
            <th className="py-3 px-4 font-medium">Side</th>
            <th className="py-3 px-4 font-medium">Type</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {visits.map((visit, i) => (
            <tr 
              key={i} 
              className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                visit.is_bot ? 'opacity-50' : ''
              }`}
            >
              <td className="py-3 px-4 text-gray-300">
                {new Date(visit.created_at).toLocaleString('no-NO', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="py-3 px-4 text-gray-400 font-mono text-xs">{visit.ip_address}</td>
              <td className="py-3 px-4 text-gray-300">
                {visit.city && visit.country ? `${decodeURIComponent(visit.city)}, ${visit.country}` : visit.country || '-'}
              </td>
              <td className="py-3 px-4 text-gray-400 truncate max-w-[200px]" title={visit.page_path}>
                {visit.page_path}
              </td>
              <td className="py-3 px-4">
                {visit.is_bot ? (
                  <span className="text-orange-400 text-xs bg-orange-500/10 px-2 py-0.5 rounded">Bot</span>
                ) : (
                  <span className="text-gray-400 capitalize">{visit.device_type || '-'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
