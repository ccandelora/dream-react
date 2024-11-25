import React from 'react';
import { BarChart3, Moon, Brain, Clock, TrendingUp, Sparkles, Heart, MessageCircle, Calendar, Star, Zap } from 'lucide-react';
import { useDreamStore } from '../store/dreamStore';

export default function DreamStats() {
  const dreams = useDreamStore((state) => state.dreams);

  const stats = {
    totalDreams: dreams.length,
    avgClarity: dreams.reduce((acc, dream) => acc + (dream.clarity || 0), 0) / dreams.length || 0,
    totalLikes: dreams.reduce((acc, dream) => acc + dream.likes, 0),
    totalComments: dreams.reduce((acc, dream) => acc + dream.comments, 0),
    commonThemes: dreams.reduce((acc, dream) => {
      dream.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    moods: dreams.reduce((acc, dream) => {
      const mood = dream.analysis?.mood || 'Unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    symbols: dreams.reduce((acc, dream) => {
      dream.analysis?.symbols.forEach(symbol => {
        acc[symbol] = (acc[symbol] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    dreamsByMonth: dreams.reduce((acc, dream) => {
      const month = new Date(dream.createdAt).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    dreamsByHour: dreams.reduce((acc, dream) => {
      const hour = new Date(dream.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    privacyDistribution: dreams.reduce((acc, dream) => {
      acc[dream.privacy] = (acc[dream.privacy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    clarityDistribution: dreams.reduce((acc, dream) => {
      const clarity = Math.floor((dream.clarity || 0) / 2) * 2;
      acc[clarity] = (acc[clarity] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    engagementRate: dreams.reduce((acc, dream) => acc + dream.likes + dream.comments, 0) / dreams.length || 0,
    lucidityRate: (dreams.filter(dream => dream.tags.includes('Lucid')).length / dreams.length) * 100 || 0,
  };

  const topThemes = Object.entries(stats.commonThemes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topSymbols = Object.entries(stats.symbols)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topMoods = Object.entries(stats.moods)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Moon className="w-5 h-5" />}
          title="Total Dreams"
          value={stats.totalDreams.toString()}
        />
        <StatCard
          icon={<Brain className="w-5 h-5" />}
          title="Avg. Clarity"
          value={`${stats.avgClarity.toFixed(1)}/10`}
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          title="Lucidity Rate"
          value={`${stats.lucidityRate.toFixed(1)}%`}
        />
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          title="Engagement"
          value={stats.engagementRate.toFixed(1)}
        />
      </div>

      {/* Dream Frequency Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Dream Frequency
        </h3>
        <div className="h-48">
          <div className="h-40 flex items-end gap-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const count = stats.dreamsByMonth[i] || 0;
              const maxCount = Math.max(...Object.values(stats.dreamsByMonth));
              const height = maxCount ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-purple-300 text-xs">{count}</div>
                  <div
                    className="w-full bg-purple-500/20 rounded-t-lg hover:bg-purple-500/30 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-purple-300 text-xs">
                    {new Date(0, i).toLocaleString('default', { month: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dream Time Distribution */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Dream Time Distribution
        </h3>
        <div className="h-48">
          <div className="h-40 flex items-end gap-1">
            {Array.from({ length: 24 }).map((_, hour) => {
              const count = stats.dreamsByHour[hour] || 0;
              const maxCount = Math.max(...Object.values(stats.dreamsByHour));
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

      {/* Dream Clarity Distribution */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Dream Clarity Distribution
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const clarityRange = i * 2;
            const count = stats.clarityDistribution[clarityRange] || 0;
            const percentage = (count / stats.totalDreams) * 100;
            
            return (
              <div key={i} className="text-center">
                <div className="mb-2">
                  <div className="text-purple-300 text-sm">{clarityRange}-{clarityRange + 2}</div>
                  <div className="text-white font-medium">{count}</div>
                </div>
                <div className="h-24 bg-white/5 rounded-lg relative">
                  <div
                    className="absolute bottom-0 w-full bg-purple-500/20 rounded-lg transition-all duration-500"
                    style={{ height: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme and Symbol Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Dream Themes
          </h3>
          <div className="space-y-3">
            {topThemes.map(([theme, count], index) => (
              <div
                key={theme}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 text-sm">#{index + 1}</span>
                    <span className="text-white font-medium">{theme}</span>
                  </div>
                  <span className="text-purple-300">{count} dreams</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500/20 rounded-full"
                    style={{ width: `${(count / stats.totalDreams) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Common Symbols
          </h3>
          <div className="space-y-3">
            {topSymbols.map(([symbol, count], index) => (
              <div
                key={symbol}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 text-sm">#{index + 1}</span>
                    <span className="text-white font-medium">{symbol}</span>
                  </div>
                  <span className="text-purple-300">{count} occurrences</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500/20 rounded-full"
                    style={{ width: `${(count / stats.totalDreams) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dream Moods */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Emotional Landscape</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {topMoods.map(([mood, count]) => (
            <div
              key={mood}
              className="bg-white/5 rounded-lg p-4 text-center"
            >
              <div className="text-white font-medium mb-2">{mood}</div>
              <div className="text-3xl font-bold text-purple-300 mb-1">
                {((count / stats.totalDreams) * 100).toFixed(0)}%
              </div>
              <div className="text-purple-200 text-sm">{count} dreams</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-purple-300">{icon}</div>
        <div className="text-purple-200">{title}</div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}