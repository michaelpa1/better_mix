'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface MonthlyUsage {
  month: string;
  credits: number;
  sessions: number;
}

interface ServiceUsage {
  service: string;
  credits: number;
  percentage: number;
  color: string;
}

interface UsageAnalyticsProps {
  monthlyData: MonthlyUsage[];
  serviceData: ServiceUsage[];
  totalCreditsUsed: number;
  averageMonthly: number;
}

const UsageAnalytics = ({ monthlyData, serviceData, totalCreditsUsed, averageMonthly }: UsageAnalyticsProps) => {
  const [activeChart, setActiveChart] = useState<'monthly' | 'services'>('monthly');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-primary">
            Credits: {payload[0].value.toLocaleString()}
          </p>
          {payload[0].payload.sessions && (
            <p className="text-muted-foreground text-sm">
              Sessions: {payload[0].payload.sessions}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const ServiceTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.service}</p>
          <p className="text-primary">
            Credits: {data.credits.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-sm">
            {data.percentage}% of total usage
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Usage Analytics</h3>
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveChart('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-smooth ${
                activeChart === 'monthly' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly Trends
            </button>
            <button
              onClick={() => setActiveChart('services')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-smooth ${
                activeChart === 'services' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Service Usage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-mono">
              {totalCreditsUsed.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-mono">
              {averageMonthly.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Monthly Avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-mono">
              {monthlyData.length}
            </div>
            <div className="text-sm text-muted-foreground">Months Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-mono">
              {serviceData.length}
            </div>
            <div className="text-sm text-muted-foreground">Services Used</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeChart === 'monthly' ? (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="ChartBarIcon" size={20} className="text-primary" />
              <h4 className="font-medium text-foreground">Monthly Credit Usage</h4>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="credits" 
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="ChartPieIcon" size={20} className="text-primary" />
              <h4 className="font-medium text-foreground">Service Distribution</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="credits"
                      label={({ percentage }) => `${percentage}%`}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ServiceTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {serviceData.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span className="font-medium text-foreground">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-foreground">
                        {service.credits.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {service.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageAnalytics;