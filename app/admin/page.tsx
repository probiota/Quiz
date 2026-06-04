"use client";

import React, { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ['#1A1A1A', '#4A4A4A', '#717171', '#A0A0A0', '#D0D0D0'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch("/api/admin/stats").then(r => r.json()),
          fetch("/api/admin/leads?limit=10").then(r => r.json())
        ]);
        
        setStats(statsRes);
        setLeads(leadsRes.leads || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleExport = () => {
    window.open("/api/admin/export", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-text-secondary font-body">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="font-body text-text-secondary">Overview of wellness assessment metrics</p>
          </div>
          <button 
            onClick={handleExport}
            className="px-6 py-3 bg-primary text-accent font-body font-semibold rounded-lg hover:opacity-95 transition-opacity"
          >
            Export All Leads (CSV)
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-body text-text-secondary text-sm mb-1">Total Leads</h3>
            <p className="font-heading text-3xl font-semibold text-text-primary">{stats?.total_leads || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-body text-text-secondary text-sm mb-1">Conversion Rate</h3>
            <p className="font-heading text-3xl font-semibold text-text-primary">{stats?.conversion_rate || 0}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-heading text-xl font-semibold mb-6">Recent Leads</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.recent_leads_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#717171' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#717171' }} />
                  <Tooltip 
                    cursor={{ fill: '#F7F5F0' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#1A1A1A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-heading text-xl font-semibold mb-6">Top Concerns</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.top_concerns || []}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {(stats?.top_concerns || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {(stats?.top_concerns || []).map((entry: any, index: number) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="font-body text-xs text-text-secondary">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-heading text-xl font-semibold">Recent Submissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body">
              <thead className="bg-surface text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Primary Concern</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead, i) => (
                  <tr key={i} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-text-primary font-medium">{lead.first_name} {lead.last_name}</td>
                    <td className="px-6 py-4 text-text-secondary">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-surface rounded-full text-xs font-semibold text-text-primary">
                        {lead.primary_concern}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                      No leads found. Wait for a submission.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
