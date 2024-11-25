import React from 'react';
import { Filter, Search, Calendar, SortDesc } from 'lucide-react';

interface DreamFiltersProps {
  onFilterChange: (filters: {
    search: string;
    tag: string;
    sortBy: 'date' | 'clarity' | 'likes';
    dateRange: string;
  }) => void;
}

export default function DreamFilters({ onFilterChange }: DreamFiltersProps) {
  const [search, setSearch] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'date' | 'clarity' | 'likes'>('date');
  const [dateRange, setDateRange] = React.useState('all');

  const handleChange = (updates: Partial<Parameters<typeof onFilterChange>[0]>) => {
    onFilterChange({
      search,
      tag: selectedTag,
      sortBy,
      dateRange,
      ...updates
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-purple-300" />
        <h3 className="text-lg font-semibold text-white">Filter Dreams</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-purple-200 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleChange({ search: e.target.value });
              }}
              placeholder="Search dreams..."
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-purple-200 mb-2">Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value);
              handleChange({ tag: e.target.value });
            }}
            className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          >
            <option value="">All Tags</option>
            <option value="Lucid">Lucid</option>
            <option value="Nightmare">Nightmare</option>
            <option value="Flying">Flying</option>
            <option value="Chase">Chase</option>
            <option value="Water">Water</option>
          </select>
        </div>

        <div>
          <label className="block text-purple-200 mb-2">Sort By</label>
          <div className="relative">
            <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                handleChange({ sortBy: e.target.value as typeof sortBy });
              }}
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <option value="date">Latest</option>
              <option value="clarity">Clarity</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-purple-200 mb-2">Time Period</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                handleChange({ dateRange: e.target.value });
              }}
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}