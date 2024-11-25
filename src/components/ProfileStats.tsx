import React from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { useDreamStore } from '../store/dreamStore';

export default function ProfileStats({ userId }: { userId: string }) {
  const dreams = useDreamStore((state) => 
    state.dreams.filter(dream => dream.userId === userId)
  );

  const dreamsByMonth = dreams.reduce((acc, dream) => {
    const month = new Date(dream.createdAt).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const dreamsByHour = dreams.reduce((acc, dream) => {
    const hour = new Date(dream.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Dream Frequency
        </h3>
        <div className="h-48">
          <div className="h-40 flex items-end gap-2">
            {monthNames.map((month, i) => {
              const count = dreamsByMonth[i] || 0;
              const maxCount = Math.max(...Object.values(dreamsByMonth));
              const height = maxCount ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-purple-300 text-xs">{count}</div>
                  <div
                    className="w-full bg-purple-500/20 rounded-t-lg hover:bg-purple-500/30 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-purple-300 text-xs">{month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Dream Time Distribution
        </h3>
        <div className="h-48">
          <div className="h-40 flex items-end gap-1">
            {Array.from({ length: 24 }).map((_, hour) => {
              const count = dreamsByHour[hour] || 0;
              const maxCount = Math.max(...Object.values(dreamsByHour));
              const height = maxCount ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-purple-300 text-xs">{count || ''}</div>
                  <div
                    className="w-full bg-purple-500/20 rounded-t-lg hover:bg-purple-500/30 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-purple-300 text-xs">
                    {hour.toString().padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Dream Progress
        </h3>
        <div className="space-y-4">
          {['Clarity', 'Lucidity', 'Detail'].map((metric) => (
            <div key={metric}>
              <div className="flex justify-between text-purple-200 mb-2">
                <span>{metric}</span>
                <span>78%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}