import React, { useEffect, useState } from "react";
import {
  dashboardService,
  type ActionRequiredItem,
  type PendingOperationsItem,
} from "../../services/dashboardService";
import {
  reportService,
  type AnalyticsTrendPoint,
  type CityFulfillmentPoint,
  type SharePiePoint,
} from "../../services/reportService";
import { ActionCard } from "../../components/ui/ActionCard";
import { MetricCard } from "../../components/ui/MetricCard";
import { partnerService } from "../../services/partnerService";
import type { Partner } from "../../types/partner";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  Zap,
  MapPin,
  Star,
  Award,
  Radio,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const DashboardPage: React.FC = () => {
  const [actionItems, setActionItems] = useState<ActionRequiredItem[]>([]);
  const [pendingOps, setPendingOps] = useState<PendingOperationsItem[]>([]);
  const [trends, setTrends] = useState<AnalyticsTrendPoint[]>([]);
  const [cityData, setCityData] = useState<CityFulfillmentPoint[]>([]);
  const [paymentShare, setPaymentShare] = useState<SharePiePoint[]>([]);
  const [topPartners, setTopPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overrideMsg, setOverrideMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await dashboardService.getDashboardData();
        const trendData = await reportService.getDailyTrends();
        const cityFulfill = await reportService.getCityZoneFulfillment();
        const payShare = await reportService.getPaymentMethodShare();
        const activePartners = await partnerService.getPartners({
          status: "ACTIVE",
        });

        setActionItems([
          {
            id: "ACT-1",
            type: "VERIFICATION",
            title: "Partner Verification",
            count: 20,
            severity: "CRITICAL",
            description: "",
            actionLabel: "Review",
            actionRoute: "/verification?status=PENDING",
          },
          {
            id: "ACT-2",
            type: "ASSIGNMENT_FAILURE",
            title: "Assignment Failures",
            count: 9,
            severity: "CRITICAL",
            description: "",
            actionLabel: "Assign",
            actionRoute: "/assignments?status=FAILED",
          },
          {
            id: "ACT-3",
            type: "PAYMENT_FAILURE",
            title: "Payment Failures",
            count: 7,
            severity: "CRITICAL",
            description: "",
            actionLabel: "Review",
            actionRoute: "/payments?status=FAILED",
          },
          {
            id: "ACT-4",
            type: "OPEN_DISPUTE",
            title: "Open Disputes",
            count: 6,
            severity: "HIGH",
            description: "",
            actionLabel: "Review",
            actionRoute: "/disputes?status=OPEN",
          },
          {
            id: "ACT-5",
            type: "SLA_BREACH",
            title: "Support SLA Breaches",
            count: 7,
            severity: "CRITICAL",
            description: "",
            actionLabel: "View",
            actionRoute: "/support?sla=BREACHED",
          },
          {
            id: "ACT-6",
            type: "REFUND_REQUEST",
            title: "Refund Requests",
            count: 3,
            severity: "HIGH",
            description: "",
            actionLabel: "Review",
            actionRoute: "/refunds?status=REQUESTED",
          },
        ]);

        setPendingOps([
          {
            id: "POP-1",
            title: "Partner Approvals",
            count: 6,
            route: "/verification?status=PENDING",
            category: "Partners",
          },
          {
            id: "POP-2",
            title: "KYC Verification",
            count: 18,
            route: "/verification?type=KYC",
            category: "Verification",
          },
          {
            id: "POP-3",
            title: "Document Reviews",
            count: 8,
            route: "/verification?type=DOCS",
            category: "Verification",
          },
          {
            id: "POP-4",
            title: "Refund Requests",
            count: 3,
            route: "/refunds?status=REQUESTED",
            category: "Finance",
          },
          {
            id: "POP-5",
            title: "Pending Bookings",
            count: 8,
            route: "/bookings?status=AWAITING_ASSIGNMENT",
            category: "Operations",
          },
        ]);

        setTrends(trendData);
        setCityData(cityFulfill);
        setPaymentShare(payShare);
        setTopPartners(activePartners.slice(0, 4));
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const triggerSpecialAction = (msg: string) => {
    setOverrideMsg(msg);
    setTimeout(() => setOverrideMsg(""), 4000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-slate-200 rounded-xl"></div>
          <div className="h-32 bg-slate-200 rounded-xl"></div>
          <div className="h-32 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const totalActionItems = actionItems.reduce((acc, it) => acc + it.count, 0);

  const cityZones = [
    {
      name: "Bengaluru HQ (Central Zone)",
      status: "OPTIMAL",
      partners: 18,
      avgSla: "11 mins",
      rate: "98.4%",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Pune West (Aundh / Baner)",
      status: "HIGH DEMAND",
      partners: 12,
      avgSla: "18 mins",
      rate: "94.2%",
      bg: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      name: "Mumbai South & Bandra",
      status: "OPTIMAL",
      partners: 14,
      avgSla: "14 mins",
      rate: "97.1%",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Gurugram Cyber City",
      status: "SURGE ACTIVE",
      partners: 6,
      avgSla: "22 mins",
      rate: "91.8%",
      bg: "bg-[#0f172a] text-white border-slate-900",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. GREETING */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Good evening, Aarav.
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {totalActionItems} operational items need your attention right now.
        </p>
      </div>

      {overrideMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2 animate-in fade-in">
          <Zap className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>{overrideMsg}</span>
        </div>
      )}

      {/* 2. ACTION REQUIRED */}
      <section className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-red-600 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ACTION REQUIRED</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Resolve these first
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionItems.map((item) => (
            <ActionCard
              key={item.id}
              title={item.title}
              count={item.count}
              severity={item.severity}
              description={item.description}
              actionLabel={item.actionLabel}
              actionRoute={item.actionRoute}
              affectedAmount={item.affectedAmount}
            />
          ))}
        </div>
      </section>

      {/* 3. PENDING OPERATIONS */}
      <section className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-600 uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>PENDING OPERATIONS</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">Queue depth</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {pendingOps.map((pop) => (
            <Link
              key={pop.id}
              to={pop.route}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all group flex flex-col justify-between"
            >
              <span className="text-2xl font-black text-slate-900 font-heading">
                {pop.count}
              </span>
              <p className="text-xs text-slate-500 font-medium group-hover:text-blue-600 transition-colors mt-2">
                {pop.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BUSINESS OVERVIEW */}
      <section className="space-y-3">
        <div>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            BUSINESS OVERVIEW
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Marketplace at a glance
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            title="TOTAL BOOKINGS"
            value="60"
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          <MetricCard
            title="REVENUE"
            value="₹5,358"
            icon={<DollarSign className="w-3.5 h-3.5" />}
          />
          <MetricCard
            title="TOTAL USERS"
            value="48"
            icon={<Users className="w-3.5 h-3.5" />}
          />
          <MetricCard
            title="ACTIVE PARTNERS"
            value="10"
            icon={<UserCheck className="w-3.5 h-3.5" />}
          />
          <MetricCard
            title="COMPLETED"
            value="6"
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          />
          <MetricCard
            title="CANCELLED"
            value="7"
            icon={<XCircle className="w-3.5 h-3.5 text-slate-400" />}
          />
        </div>
      </section>

      {/* 5. ENHANCED ANALYTICS CHARTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              MARKETPLACE ANALYTICS & INSIGHTS
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Performance & Demand Trends
            </h2>
          </div>
          <Link
            to="/reports"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View All Reports →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Daily Booking & Completion Trajectory
                </h3>
                <p className="text-[11px] text-slate-500">
                  7-day order volume vs fulfillment
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>{" "}
                  Bookings
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>{" "}
                  Completed
                </span>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trends}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="dashBookings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="dashCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#dashBookings)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#dashCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Daily Platform Gross Revenue (₹)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gross transaction value processed
                </p>
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono">
                Total: ₹9.48 Lakh
              </span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trends}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  City Zone Operational Density
                </h3>
                <p className="text-[11px] text-slate-500">
                  Bookings vs Active Partners per metro zone
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>{" "}
                  Bookings
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>{" "}
                  Completed
                </span>
              </div>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Payment Channel Distribution
              </h3>
              <p className="text-[11px] text-slate-500 mb-2">
                Customer gateway preferences
              </p>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SPECIAL REPLACEMENT: LIVE METRO DISPATCH PULSE & TOP PARTNERS LEADERBOARD */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Metro Zone Health Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>LIVE DISPATCH PULSE</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Metro Operations Health Console
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Sync: Realtime WebSocket
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {cityZones.map((zone, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {zone.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {zone.partners} Active Technicians
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${zone.bg}`}
                  >
                    {zone.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      Avg Response
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {zone.avgSla}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      SLA Rate
                    </span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {zone.rate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Verified Partners & Quick Dispatch Overrides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Partners Leaderboard (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Top Verified Service Technicians
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ranked by completion rate & customer satisfaction
                  </p>
                </div>
              </div>
              <Link
                to="/partners"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All Partners →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topPartners.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center text-sm font-black shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{p.city}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className="flex items-center gap-0.5 font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{p.rating || 4.9}</span>
                        </span>
                        <span className="text-slate-400">
                          • {p.completedJobs} jobs
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/partners/${p.id}`}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold shadow-2xs shrink-0"
                  >
                    Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Fast Command Console (1 col) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Operator Dispatch Overrides
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                1-click automated operational triggers
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  triggerSpecialAction(
                    "Auto-reassignment heuristic executed. 5 pending bookings reassigned to nearest active partners.",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>Execute Auto-Dispatch Heuristic</span>
                </div>
                <span className="text-[10px] text-slate-400">RUN</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerSpecialAction(
                    "Gurugram Surge Incentive Broadcast sent to 14 standby partners.",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>Broadcast High-Demand Surge Bonus</span>
                </div>
                <span className="text-[10px] text-slate-400">SEND</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerSpecialAction(
                    "Gateway timeout reconciliation complete. 3 failed payment sessions refreshed.",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Flush Payment Gateway Pool</span>
                </div>
                <span className="text-[10px] text-slate-400">SYNC</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
