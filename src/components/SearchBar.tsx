import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';

export default function SearchBar() {
  const { filters, setFilters, resetFilters } = useSearchStore();
  const [showFilters, setShowFilters] = React.useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ query: e.target.value });
  };

  const handleTagToggle = (tag: string) => {
    setFilters({
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag],
    });
  };

  const commonTags = ['Lucid', 'Nightmare', 'Flying', 'Chase', 'Water', 'Family'];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
          <input
            type="text"
            value={filters.query}
            onChange={handleQueryChange}
            placeholder="Search dreams..."
            className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          />
          {filters.query && (
            <button
              onClick={() => setFilters({ query: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg ${
            showFilters ? 'bg-purple-500 text-white' : 'text-purple-300 hover:text-white'
          } transition-colors`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-purple-200 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full ${
                    filters.tags.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  } transition-colors`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-purple-200 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ dateRange: e.target.value as any })}
                className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-200 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                <option value="date">Date</option>
                <option value="likes">Likes</option>
                <option value="clarity">Clarity</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-200 mb-2">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ sortOrder: e.target.value as any })}
                className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}