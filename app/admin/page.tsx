"use client";

import React, { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { questions } from "../../lib/questions";

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

const QUESTION_MAP: Record<number, string> = questions.reduce((acc, q) => {
  acc[q.id] = q.text;
  return acc;
}, {} as Record<number, string>);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch("/api/admin/stats").then(r => r.json()),
          fetch("/api/admin/leads?limit=50").then(r => r.json())
        ]);
        
        setStats(statsRes);
        setLeads(leadsRes.leads || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchData();

    // Poll every 10 seconds for real-time updates
    const intervalId = setInterval(fetchData, 10000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleExport = () => {
    window.open("/api/admin/export", "_blank");
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
        if (stats && stats.total_leads) {
          setStats({ ...stats, total_leads: stats.total_leads - 1 });
        }
      } else {
        alert("Failed to delete lead");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Error deleting lead");
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="font-body text-text-secondary">Overview of wellness assessment metrics</p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={handleExport}
              className="px-6 py-3 bg-primary text-accent font-body font-semibold rounded-lg hover:opacity-95 transition-opacity"
            >
              Export All Leads (CSV)
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-white border border-border text-text-primary font-body font-semibold rounded-lg hover:bg-surface transition-colors"
            >
              Logout
            </button>
          </div>
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
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {(stats?.recent_leads_trend || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
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

        {/* Leads Table with Expandable Answers */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-heading text-xl font-semibold">All Submissions</h3>
            <span className="font-body text-sm text-text-secondary">
              Click a row to view quiz answers
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body">
              <thead className="bg-surface text-text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-4 font-medium w-8"></th>
                  <th className="px-4 py-4 font-medium">Name</th>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Phone</th>
                  <th className="px-4 py-4 font-medium">Age</th>
                  <th className="px-4 py-4 font-medium">Gender</th>
                  <th className="px-4 py-4 font-medium">Lifestyle</th>
                  <th className="px-4 py-4 font-medium">Goal</th>
                  <th className="px-4 py-4 font-medium">Primary Concern</th>
                  <th className="px-4 py-4 font-medium">Recommendation</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead, i) => (
                  <React.Fragment key={i}>
                    {/* Main Row */}
                    <tr 
                      className="hover:bg-surface/50 transition-colors cursor-pointer"
                      onClick={() => toggleRow(i)}
                    >
                      <td className="px-4 py-4 text-text-secondary">
                        <motion.span
                          animate={{ rotate: expandedRow === i ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          ▶
                        </motion.span>
                      </td>
                      <td className="px-4 py-4 text-text-primary font-medium whitespace-nowrap">
                        {lead.first_name} {lead.last_name}
                      </td>
                      <td className="px-4 py-4 text-text-secondary text-sm">{lead.email}</td>
                      <td className="px-4 py-4 text-text-secondary text-sm">{lead.phone || "—"}</td>
                      <td className="px-4 py-4 text-text-secondary text-sm">{lead.age_group || "—"}</td>
                      <td className="px-4 py-4 text-text-secondary text-sm">{lead.gender || "—"}</td>
                      <td className="px-4 py-4 text-text-secondary text-sm">{lead.lifestyle_type || "—"}</td>
                      <td className="px-4 py-4 text-text-secondary text-sm">{lead.primary_goal || "—"}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-3 py-1 bg-surface rounded-full text-xs font-semibold text-text-primary">
                          {lead.primary_concern}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-text-primary">
                          {lead.recommended_product || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-text-secondary text-sm whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={(e) => handleDelete(lead.id, e)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Delete Lead"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Answers Row */}
                    <AnimatePresence>
                      {expandedRow === i && (
                        <tr>
                          <td colSpan={12} className="px-0 py-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-surface/60 px-8 py-6 border-t border-border">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Quiz Answers */}
                                  <div>
                                    <h4 className="font-heading text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                                      Quiz Answers
                                    </h4>
                                    {lead.quiz_answers && Array.isArray(lead.quiz_answers) && lead.quiz_answers.length > 0 ? (
                                      <div className="space-y-3">
                                        {lead.quiz_answers.map((answer: any, idx: number) => (
                                          <div key={idx} className="bg-white rounded-lg p-3 border border-border">
                                            <p className="text-xs text-text-secondary mb-1">
                                              Q{answer.questionId}. {QUESTION_MAP[answer.questionId] || `Question ${answer.questionId}`}
                                            </p>
                                            <p className="text-sm text-text-primary font-medium">
                                              → {answer.selectedOption}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-text-secondary italic">
                                        No individual answers recorded for this submission.
                                      </p>
                                    )}
                                  </div>

                                  {/* Scores & Details */}
                                  <div>
                                    <h4 className="font-heading text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                                      Score Breakdown
                                    </h4>
                                    {lead.quiz_scores && typeof lead.quiz_scores === 'object' ? (
                                      <div className="bg-white rounded-lg p-4 border border-border">
                                        <div className="grid grid-cols-2 gap-3">
                                          {Object.entries(lead.quiz_scores).map(([bucket, score]) => (
                                            <div key={bucket} className="flex items-center justify-between">
                                              <span className="text-xs text-text-secondary uppercase tracking-wide">
                                                {bucket}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
                                                  <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, ((score as number) / 9) * 100)}%` }}
                                                  ></div>
                                                </div>
                                                <span className="text-xs font-semibold text-text-primary w-4 text-right">
                                                  {score as number}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-text-secondary italic">No scores recorded.</p>
                                    )}

                                    {/* Additional Details */}
                                    <h4 className="font-heading text-sm font-semibold text-text-primary mt-6 mb-4 uppercase tracking-wider">
                                      Result Details
                                    </h4>
                                    <div className="bg-white rounded-lg p-4 border border-border space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-xs text-text-secondary">Primary Concern</span>
                                        <span className="text-xs font-semibold text-text-primary">{lead.primary_concern || "—"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-text-secondary">Secondary Concern</span>
                                        <span className="text-xs font-semibold text-text-primary">{lead.secondary_concern || "—"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-text-secondary">Recommended Product</span>
                                        <span className="text-xs font-semibold text-text-primary">{lead.recommended_product || "—"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-text-secondary">Email Consent</span>
                                        <span className="text-xs font-semibold text-text-primary">{lead.email_consent ? "✅ Yes" : "❌ No"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-6 py-8 text-center text-text-secondary">
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
