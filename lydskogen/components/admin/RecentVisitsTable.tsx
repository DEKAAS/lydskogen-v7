'use client';

import type { AnalyticsStats } from '@/lib/supabase';

export default function RecentVisitsTable({ visits }: { visits: NonNullable<AnalyticsStats['recentVisits']> }) {
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
            <th className="py-3 px-4 font-medium">Enhet</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {visits.map((visit, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
                {visit.city && visit.country ? `${visit.city}, ${visit.country}` : visit.country || '-'}
              </td>
              <td className="py-3 px-4 text-gray-400 truncate max-w-[200px]" title={visit.page_path}>
                {visit.page_path}
              </td>
              <td className="py-3 px-4 text-gray-400 capitalize">{visit.device_type || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
