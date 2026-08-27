import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { Customer } from "../../types/customer";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { SearchInput } from "../../components/ui/SearchInput";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { UserCheck, Eye } from "lucide-react";

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers(search);
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const columns: Column<Customer>[] = [
    {
      header: "Customer",
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {u.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{u.name}</p>
            <p className="text-[11px] text-slate-400 font-mono">{u.mobile}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Email Address",
      accessor: (u) => (
        <span className="text-xs text-slate-600">{u.email}</span>
      ),
    },
    {
      header: "City Zone",
      accessor: (u) => (
        <span className="text-xs font-semibold text-slate-800">{u.city}</span>
      ),
    },
    {
      header: "Total Bookings",
      accessor: (u) => (
        <span className="text-xs font-semibold text-slate-800">
          {u.totalBookings} orders
        </span>
      ),
    },
    {
      header: "Total Spend",
      accessor: (u) => (
        <span className="font-bold text-slate-900 font-heading">
          ₹{u.totalSpend.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Account Status",
      accessor: (u) => <StatusBadge status={u.status} />,
    },
    {
      header: "Action",
      accessor: (u) => (
        <button
          type="button"
          onClick={() => navigate(`/users/${u.id}`)}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Customer Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse registered marketplace consumers, lifetime spending and order
            histories
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by customer name, email, mobile or city..."
          className="w-full max-w-md"
        />
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        onRowClick={(u) => navigate(`/users/${u.id}`)}
      />
    </div>
  );
};
