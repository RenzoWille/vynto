import React from "react";
import { Users, Eye, MessageSquare, ArrowUpRight, Target } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { name: "Totaal Bereik", value: "45.2k", change: "+12%", icon: Eye },
    { name: "Nieuwe Volgers", value: "1,284", change: "+18%", icon: Users },
    { name: "Conversie Ratio", value: "3.2%", change: "+2%", icon: Target },
    {
      name: "AI Automations",
      value: "856",
      change: "+43%",
      icon: MessageSquare,
    },
  ];

  const leads = [
    {
      id: 1,
      user: "@bakery_amsterdam",
      intent: "Prijs opvraag",
      status: "Opgevolgd",
      time: "2m geleden",
    },
    {
      id: 2,
      user: "@tech_guru",
      intent: "Samenwerking",
      status: "Wachtend",
      time: "15m geleden",
    },
    {
      id: 3,
      user: "@fitness_janj",
      intent: "Product info",
      status: "Opgevolgd",
      time: "1u geleden",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Instagram Growth Engine
          </h1>
          <p className="text-slate-500">
            Welkom terug, hier is je overzicht voor vandaag.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          + Nieuwe Campagne
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <stat.icon size={20} />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center">
                {stat.change} <ArrowUpRight size={14} className="ml-1" />
              </span>
            </div>
            <h3 className="text-slate-500 text-sm">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Recente AI Leads</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Account
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Intentie
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Tijd
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-indigo-600">
                    {lead.user}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.intent}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "Opgevolgd"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {lead.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Control Panel */}
        <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg">
          <h2 className="font-bold mb-4">AI Brand Voice</h2>
          <p className="text-indigo-200 text-sm mb-6">
            Stel hier in hoe de AI moet reageren op potentiële klanten.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-indigo-300 block mb-1">
                Doelstelling
              </label>
              <select className="w-full bg-indigo-800 border border-indigo-700 rounded-md px-3 py-2 text-sm">
                <option>Leadgeneratie</option>
                <option>Klantenservice</option>
                <option>Directe Verkoop</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-indigo-300 block mb-1">
                Tone of Voice
              </label>
              <textarea
                className="w-full bg-indigo-800 border border-indigo-700 rounded-md px-3 py-2 text-sm h-24"
                placeholder="Bijv: Enthousiast, professioneel, gebruik 'je' en 'jij'..."
              />
            </div>
            <button className="w-full bg-white text-indigo-900 font-bold py-2 rounded-md hover:bg-indigo-50 transition">
              Update AI Instellingen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
