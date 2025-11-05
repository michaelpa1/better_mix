'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOptions {
  serviceType: string;
  dateRange: string;
  searchQuery: string;
}

interface HistoryFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  totalJobs: number;
  filteredJobs: number;
}

const HistoryFilters = ({ onFiltersChange, totalJobs, filteredJobs }: HistoryFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    serviceType: 'all',
    dateRange: 'all',
    searchQuery: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const serviceTypes = [
    { value: 'all', label: 'All Services' },
    { value: 'mastering', label: 'Mastering Preview' },
    { value: 'enhance', label: 'Mix Enhance Preview' },
    { value: 'analysis', label: 'Mix Analysis' }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      serviceType: 'all',
      dateRange: 'all',
      searchQuery: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.serviceType !== 'all' || filters.dateRange !== 'all' || filters.searchQuery !== '';

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="FunnelIcon" size={20} className="text-muted-foreground" />
          <span className="font-medium text-foreground">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-smooth"
        >
          <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={20} />
        </button>
      </div>

      {/* Filter Controls */}
      <div className={`p-4 space-y-4 ${!isExpanded ? 'hidden md:block' : ''}`}>
        {/* Search Bar */}
        <div className="relative">
          <Icon 
            name="MagnifyingGlassIcon" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search by filename..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="XMarkIcon" size={16} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Type Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Service Type
            </label>
            <select
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary & Clear Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {filteredJobs.toLocaleString()} of {totalJobs.toLocaleString()} jobs
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
            >
              <Icon name="XMarkIcon" size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryFilters;