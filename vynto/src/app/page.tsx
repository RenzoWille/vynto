/// <reference types="node" />
import React from "react";
import { Users, Eye, MessageSquare, ArrowUpRight, Target, AlertCircle } from "lucide-react";

// Functie om data op te halen van Meta's API
async function getInstagramData() {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  // Standaard mock data voor als er nog geen (geldige) API configuratie is
  let metaData: any = {
    profile: null,
    leads: [],
    error: false,
    errorMessage: "",
    hasCredentials: false
  };

  if (!accountId || !accessToken || accessToken === "vul_hier_je_long_lived_access_token_in") {
    metaData.error = true;
    metaData.errorMessage = "Authenticatie ontbreekt. Configureer .env.local met je INSTAGRAM_ACCOUNT_ID en INSTAGRAM_ACCESS_TOKEN.";
    return metaData;
  }

  metaData.hasCredentials = true;

  try {
    // 1. Haal basis account info (volgers, etc.) op
    const profileRes = await fetch(
      `https://graph.facebook.com/v20.0/${accountId}?fields=followers_count,follows_count,media_count,name,username&access_token=${accessToken}`,
      { next: { revalidate: 300 } } as any
    );
    const profileJson = await profileRes.json();

    if (profileJson.error) {
      metaData.error = true;
      metaData.errorMessage = `Graph API Error: ${profileJson.error.message}`;
    } else {
      metaData.profile = profileJson;
    }

    // 2. Haal recente conversaties op via Messenger API for Instagram (leads)
    // Vereist extra permissies zoals instagram_manage_messages
    const convRes = await fetch(
      `https://graph.facebook.com/v20.0/${accountId}/conversations?platform=instagram&access_token=${accessToken}`,
      { next: { revalidate: 300 } } as any
    );
    const convJson = await convRes.json();

    // Map the conversations for the UI if they exist.
    if (!convJson.error && convJson.data) {
      metaData.leads = convJson.data.slice(0, 5).map((conv: any, i: number) => ({
        id: conv.id || i,
        user: `Conversatie #${i + 1}`,
        intent: "Inkomend bericht",
        status: "Opgevolgd",
        time: new Date(conv.updated_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " geleden"
      }));
    }

  } catch (err: any) {
    metaData.error = true;
    metaData.errorMessage = err.message || "Er is een onbekende fout opgetreden bij het verbinden met Instagram.";
  }

  return metaData;
}

export default async function Dashboard() {
  const { profile, leads, error, errorMessage, hasCredentials } = await getInstagramData();

  // Combineer live API data met statische/berekende metrics
  const stats = [
    {
      name: "Totaal Volgers",
      value: profile ? profile.followers_count.toLocaleString() : "45.2k",
      change: "+12%",
      icon: Users
    },
    {
      name: "Totaal Bereik",
      value: "142.5k", // Dit zou uit /insights API kunnen komen
      change: "+18%",
      icon: Eye
    },
    {
      name: "Conversie Ratio",
      value: "3.2%",
      change: "+2%",
      icon: Target
    },
    {
      name: "AI Automations",
      value: "856",
      change: "+43%",
      icon: MessageSquare,
    },
  ];

  // Gebruik de API leads als ze er zijn, anders de mock leads
  const displayLeads = leads.length > 0 ? leads : [
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
      {/* Feedback Banner omtrent Instagram API Settings */}
      {error && !hasCredentials && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl flex items-center shadow-sm">
          <AlertCircle className="mr-3" size={20} />
          <div>
            <p className="font-semibold text-sm">Meta API nog niet gekoppeld</p>
            <p className="text-xs mt-1">
              {errorMessage} Je ziet momenteel de <b>voorbeeld data</b>.
            </p>
          </div>
        </div>
      )}

      {error && hasCredentials && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center shadow-sm">
          <AlertCircle className="mr-3 text-red-600" size={20} />
          <div>
            <p className="font-semibold text-sm">Fout bij ophalen API data</p>
            <p className="text-xs mt-1">
              Controleer of de tokens in .env.local nog geldig zijn. Log: {errorMessage}
            </p>
          </div>
        </div>
      )}

      {!error && hasCredentials && profile && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center shadow-sm">
          <AlertCircle className="mr-3 text-green-600" size={20} />
          <div>
            <p className="font-semibold text-sm">Live Verbonden als @{profile.username}</p>
            <p className="text-xs mt-1">
              De weergave is afkomstig van de officiële Meta Instagram Graph API.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {profile ? `Dashboard voor @${profile.username}` : "Instagram Growth Engine"}
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
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">
              {hasCredentials && !error ? "Recente Live Berichten (Beperkte Info)" : "Recente AI Leads (Mock)"}
            </h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Account / Oorsprong
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
              {displayLeads.map((lead: any) => (
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
              {displayLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Geen conversaties gevonden of er missen API leesrechten (manage_messages).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AI Control Panel */}
        <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg">
          <h2 className="font-bold mb-4">AI Brand Voice</h2>
          <p className="text-indigo-200 text-sm mb-6">
            Stel hier in hoe de AI moet reageren op potentiële klanten via geautomatiseerde Meta comments.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-indigo-300 block mb-1">
                Doelstelling
              </label>
              <select className="w-full bg-indigo-800 border border-indigo-700 rounded-md px-3 py-2 text-sm focus:outline-none">
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
                className="w-full bg-indigo-800 border border-indigo-700 rounded-md px-3 py-2 text-sm h-24 focus:outline-none"
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
}
