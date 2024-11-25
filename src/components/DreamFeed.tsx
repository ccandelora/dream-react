import React from 'react';
import { useDreamStore } from '../store/dreamStore';
import { useSearchStore } from '../store/searchStore';
import { useAuthStore } from '../store/authStore';
import DreamCard from './DreamCard';
import SearchBar from './SearchBar';

export default function DreamFeed() {
  const { user } = useAuthStore();
  const { dreams, getVisibleDreams, likeDream } = useDreamStore();
  const { filterDreams } = useSearchStore();

  // Get visible dreams based on current user
  const visibleDreams = getVisibleDreams(user?.id);
  const filteredDreams = filterDreams(visibleDreams);

  return (
    <div className="space-y-6">
      <SearchBar />
      
      {filteredDreams.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
          <p className="text-purple-200">
            {dreams.length === 0
              ? "No dreams shared yet. Be the first to share your dream!"
              : "No dreams match your search criteria."}
          </p>
        </div>
      ) : (
        filteredDreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onLike={() => likeDream(dream.id)}
          />
        ))
      )}
    </div>
  );
}