'use client';

import type { AnalyticsStats } from '@/lib/supabase';

export default function RecentVisitsTable({ visits }: { visits: NonNullable<AnalyticsStats['recentVisits']> }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="border border-green-500 bg-black p-6 text-center">
        <p className="text-green-600 font-mono">INGEN NYLIGE BESØK LOGGFØRT</p>
      </div>
    );
  }

  return (
    <div className="border border-green-500 bg-black p-6 overflow-x-auto">
      <h3 className="text-lg font-mono font-bold text-green-500 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500"></span>
        SISTE BESØKENDE LOGG (SISTE 50)
      </h3>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-green-500/30 text-xs font-mono text-green-600 uppercase">
            <th className="py-2 px-4">TIDSPUNKT</th>
            <th className="py-2 px-4">IP ADRESSE</th>
            <th className="py-2 px-4">STED</th>
            <th className="py-2 px-4">SIDE</th>
            <th className="py-2 px-4">ENHET</th>
          </tr>
        </thead>
        <tbody className="font-mono text-sm">
          {visits.map((visit, i) => (
            <tr key={i} className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors">
              <td className="py-2 px-4 text-green-400">
                {new Date(visit.created_at).toLocaleString('no-NO')}
              </td>
              <td className="py-2 px-4 text-green-500">{visit.ip_address}</td>
              <td className="py-2 px-4 text-green-400">
                {visit.city && visit.country ? `${visit.city}, ${visit.country}` : visit.country || '-'}
              </td>
              <td className="py-2 px-4 text-green-300 truncate max-w-[200px]" title={visit.page_path}>
                {visit.page_path}
              </td>
              <td className="py-2 px-4 text-green-400 capitalize">{visit.device_type || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

