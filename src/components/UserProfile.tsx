import React from 'react';
import { Settings, Moon, Star, BarChart3, Edit, Camera, Lock, Globe, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDreamStore } from '../store/dreamStore';
import ProfileStats from './ProfileStats';
import ThemeCustomizer from './ThemeCustomizer';
import DreamCard from './DreamCard';

export default function UserProfile() {
  const { user } = useAuthStore();
  const getVisibleDreams = useDreamStore((state) => state.getVisibleDreams);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'private' | 'stats'>('all');

  if (!user) return null;

  // Get only the current user's dreams
  const userDreams = getVisibleDreams(user.id).filter(dream => dream.userId === user.id);
  const privateDreams = userDreams.filter(dream => dream.privacy === 'private');
  const publicDreams = userDreams.filter(dream => dream.privacy === 'public');
  const anonymousDreams = userDreams.filter(dream => dream.privacy === 'anonymous');

  const userStats = {
    totalDreams: userDreams.length,
    privateDreams: privateDreams.length,
    publicDreams: publicDreams.length,
    anonymousDreams: anonymousDreams.length,
    lucidDreams: userDreams.filter(dream => dream.tags.includes('Lucid')).length,
    avgClarity: userDreams.reduce((acc, dream) => acc + (dream.clarity || 0), 0) / userDreams.length || 0,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-purple-300">{user.email}</p>
              {user.bio && <p className="text-purple-200 mt-2">{user.bio}</p>}
              <p className="text-purple-300 text-sm mt-1">
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-purple-300 hover:text-white transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="p-2 text-purple-300 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Moon />} label="Total Dreams" value={userStats.totalDreams} />
          <StatCard icon={<Lock />} label="Private" value={userStats.privateDreams} />
          <StatCard icon={<Globe />} label="Public" value={userStats.publicDreams} />
          <StatCard icon={<User />} label="Anonymous" value={userStats.anonymousDreams} />
        </div>

        {showThemeCustomizer && <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          All Dreams
        </button>
        <button
          onClick={() => setActiveTab('private')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'private'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          <Lock className="w-4 h-4" />
          Private Dreams
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          Dream Statistics
        </button>
      </div>

      {activeTab === 'stats' ? (
        <ProfileStats userId={user.id} />
      ) : (
        <div className="space-y-6">
          {activeTab === 'private' ? (
            privateDreams.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
                <Lock className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Private Dreams Yet</h3>
                <p className="text-purple-200">
                  Dreams marked as private will appear here, visible only to you.
                </p>
              </div>
            ) : (
              privateDreams.map(dream => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onLike={() => {}}
                />
              ))
            )
          ) : (
            userDreams.map(dream => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onLike={() => {}}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2 text-purple-300">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}