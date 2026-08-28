import React, { useEffect, useState } from "react";
import {
  dashboardService,
  type ActionRequiredItem,
} from "../../services/dashboardService";
import {
  reportService,
  type AnalyticsTrendPoint,
  type SharePiePoint,
} from "../../services/reportService";
import { MetricCard } from "../../components/ui/MetricCard";
import { partnerService } from "../../services/partnerService";
import type { Partner } from "../../types/partner";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Users,
  CheckCircle2,
  Zap,
  MapPin,
  Star,
  Award,
  Radio,
  Send,
  ShieldCheck,
  Briefcase,
  Home,
  Wrench,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const DashboardPage: React.FC = () => {
  const [actionItems, setActionItems] = useState<ActionRequiredItem[]>([]);
  const [trends, setTrends] = useState<AnalyticsTrendPoint[]>([]);
  const [paymentShare, setPaymentShare] = useState<SharePiePoint[]>([]);
  const [topPartners, setTopPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overrideMsg, setOverrideMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await dashboardService.getDashboardData();
        const trendData = await reportService.getDailyTrends();
        const payShare = await reportService.getPaymentMethodShare();
        const activePartners = await partnerService.getPartners({
          status: "ACTIVE",
        });

        // User-friendly terminology for action items
        setActionItems([
          {
            id: "ACT-1",
            type: "VERIFICATION",
            title: "Partner ID & Background Checks",
            count: 20,
            severity: "CRITICAL",
            description: "New technician profiles waiting for admin verification",
            actionLabel: "Verify IDs",
            actionRoute: "/verification?status=PENDING",
          },
          {
            id: "ACT-2",
            type: "ASSIGNMENT_FAILURE",
            title: "Unassigned Customer Bookings",
            count: 9,
            severity: "CRITICAL",
            description: "Bookings waiting for technician allocation",
            actionLabel: "Assign Now",
            actionRoute: "/assignments?status=FAILED",
          },
          {
            id: "ACT-3",
            type: "SLA_BREACH",
            title: "Overdue Support Tickets",
            count: 7,
            severity: "CRITICAL",
            description: "Customer inquiries past their promised reply time",
            actionLabel: "Resolve Tickets",
            actionRoute: "/support?sla=BREACHED",
          },
          {
            id: "ACT-4",
            type: "OPEN_DISPUTE",
            title: "Customer Quality Inquiries",
            count: 6,
            severity: "HIGH",
            description: "Service issues reported by customers",
            actionLabel: "Investigate",
            actionRoute: "/disputes?status=OPEN",
          },
          {
            id: "ACT-5",
            type: "PAYMENT_FAILURE",
            title: "Failed Customer Payments",
            count: 7,
            severity: "HIGH",
            description: "Transactions requiring follow-up reconciliation",
            actionLabel: "Review",
            actionRoute: "/payments?status=FAILED",
          },
          {
            id: "ACT-6",
            type: "REFUND_REQUEST",
            title: "Customer Refund Requests",
            count: 3,
            severity: "HIGH",
            description: "Approved order cancellations pending payout",
            actionLabel: "Process Refunds",
            actionRoute: "/refunds?status=REQUESTED",
          },
        ]);

        setTrends(trendData);
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

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#64748b"];

  const cityZones = [
    {
      name: "Hyderabad — Hitec City & Gachibowli",
      partners: 28,
      avgArrival: "18 mins",
      onTimeRate: "97.4%",
    },
    {
      name: "Hyderabad — Secunderabad & Banjara",
      partners: 19,
      avgArrival: "24 mins",
      onTimeRate: "93.8%",
    },
    {
      name: "Bangalore — Whitefield Tech Park",
      partners: 22,
      avgArrival: "21 mins",
      onTimeRate: "95.1%",
    },
    {
      name: "Bangalore — Koramangala & Indiranagar",
      partners: 15,
      avgArrival: "32 mins",
      onTimeRate: "88.2%",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Live Operations Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Operations Command Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time multi-marketplace monitoring across Home Services, Work Marketplace, and PG Accommodations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Auto-sync active (30s)
            </span>
          </div>
        </div>
      </div>

      {overrideMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{overrideMsg}</span>
        </div>
      )}

      {/* 2. Top Metric Cards — Multi-Marketplace Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Service Bookings"
          value="48 Orders"
          subtitle="92% Completed on time"
          icon={<Wrench className="w-4 h-4 text-blue-600" />}
          trend={{ value: 12.4, isPositive: true }}
        />
        <MetricCard
          title="Active On-Field Techs"
          value="84 Active"
          subtitle="In Hyderabad & Bangalore"
          icon={<Users className="w-4 h-4 text-emerald-600" />}
          trend={{ value: 8.1, isPositive: true }}
        />
        <MetricCard
          title="Commercial Jobs Filled"
          value="18 / 24 Filled"
          subtitle="75% Workforce Fill Rate"
          icon={<Briefcase className="w-4 h-4 text-indigo-600" />}
        />
        <MetricCard
          title="PG Bed Vacancies"
          value="55 / 72 Occupied"
          subtitle="17 Beds Available for Move-In"
          icon={<Home className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* 3. Items Requiring Immediate Attention */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Tasks Requiring Immediate Admin Attention
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Pending tasks requiring operational intervention to prevent customer delays
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                </div>
                <span className="text-base font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs">
                  {item.count}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex justify-end">
                <Link
                  to={item.actionRoute}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Analytics & Operational Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Completed Bookings Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Daily Completed Bookings & Revenue (Past 7 Days)
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Volume of customer requests completed vs daily gross billing
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  name="Orders Completed"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Payment Method Distribution (1 col) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer Payment Methods
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Distribution of UPI, Cards & Cash on Delivery
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {paymentShare.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. City Zone Health & Fast Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>City Operations & Technician Coverage</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-500">
            Active Service Hubs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cityZones.map((zone, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{zone.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {zone.partners} Active Technicians
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Avg Arrival</span>
                  <span className="font-bold text-slate-900">{zone.avgArrival}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">On-Time Rate</span>
                  <span className="font-bold text-emerald-600">{zone.onTimeRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Top Technicians & Fast Automated Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Technicians (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Top Rated Service Partners
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Highest customer satisfaction and on-time completion rates
                </p>
              </div>
            </div>
            <Link
              to="/partners"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Partners →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topPartners.map((p) => (
              <div
                key={p.id}
                className="p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{p.city}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className="flex items-center gap-0.5 font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{p.rating || 4.9}</span>
                      </span>
                      <span className="text-slate-400 font-medium">
                        • {p.completedJobs} jobs done
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/partners/${p.id}`}
                  className="px-2.5 py-1 bg-white border border-slate-200/80 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-bold shadow-2xs shrink-0 transition-colors"
                >
                  Profile
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 1-Click Operations Triggers (1 col) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1-Click Operations Triggers
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Fast automated dispatch and system sync actions
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() =>
                triggerSpecialAction(
                  "Auto-assignment complete: 5 pending customer orders matched to nearest active technicians.",
                )
              }
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Auto-Assign Pending Orders to Nearest Techs</span>
              </div>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                RUN
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerSpecialAction(
                  "High-demand bonus alert broadcasted to 14 standby technicians.",
                )
              }
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Send High-Demand Bonus Alert</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                SEND
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerSpecialAction(
                  "Payment verification complete: 3 pending online payment sessions refreshed.",
                )
              }
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Refresh & Recheck Pending Payments</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                SYNC
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
