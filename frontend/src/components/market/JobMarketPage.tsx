import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { MarketOverview, MarketChartData } from '../../types';

interface JobMarketPageProps {
  overview: MarketOverview;
  chartData: MarketChartData;
}

export const JobMarketPage: React.FC<JobMarketPageProps> = ({ overview, chartData }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Job Market Intelligence
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Empirical hiring benchmarks based on 17,400 analyzed job postings (15,800 Analytics + 1,600 Data Science).
        </p>
      </div>

      {/* Top 4 Essential KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 block">Total Postings Analyzed</span>
          <span className="text-xl font-bold text-gray-900 mt-0.5 block">{overview.totalJobsAnalyzed.toLocaleString()}</span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">2024-2025 Dataset</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 block">Average Salary</span>
          <span className="text-xl font-bold text-gray-900 mt-0.5 block">{overview.averageSalary}</span>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Median base package</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 block">Highest Demand Role</span>
          <span className="text-xl font-bold text-gray-900 mt-0.5 block">Data Analyst</span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">5,420 open postings</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 block">Top In-Demand Skill</span>
          <span className="text-xl font-bold text-indigo-600 mt-0.5 block">Python</span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">74.2% of postings</span>
        </div>
      </div>

      {/* Charts Grid: Clean, readable white cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Job Demand by Role */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Job Demand by Role</h2>
          <p className="text-xs text-gray-500 mb-4">Total analyzed job postings in 2024-25</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.demandByRole} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="role" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="jobCount" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Postings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <strong>What the data told me:</strong> {chartData.insights.roleDemand}
          </div>
        </div>

        {/* Chart 2: Median Salary by Role */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Median Salary by Role ($k)</h2>
          <p className="text-xs text-gray-500 mb-4">Observed annual compensation benchmarks</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.salaryByRole} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="role" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="median" fill="#10b981" radius={[4, 4, 0, 0]} name="Median ($k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <strong>What the data told me:</strong> {chartData.insights.salary}
          </div>
        </div>

        {/* Chart 3: Salary vs Experience */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Salary Growth vs Experience ($k)</h2>
          <p className="text-xs text-gray-500 mb-4">Trajectory across career tenure</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.salaryVsExperience} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="yearsExp" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="salaryK" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: '#4f46e5' }} name="Salary ($k)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <strong>What the data told me:</strong> {chartData.insights.experience}
          </div>
        </div>

        {/* Chart 4: Experience Requirements Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Experience Requirements Distribution</h2>
          <p className="text-xs text-gray-500 mb-4">Percentage of open roles by required tenure</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.experienceRequirements} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="bracket" stroke="#64748b" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="percentage" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Share (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <strong>What the data told me:</strong> Over 65% of all postings target candidates with 1 to 5 years of experience.
          </div>
        </div>
      </div>
    </div>
  );
};
