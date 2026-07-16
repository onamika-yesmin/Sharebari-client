"use client";

import { Boxes, CalendarClock, Check, ChevronDown, CircleDollarSign, Compass, CreditCard, Crown, Gauge, LogIn, PackageCheck, PackageSearch, Pencil, Plus, ShieldCheck, UserRound, UsersRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LoadingState } from "@/components/LoadingState";
import { showError, showSuccess } from "@/lib/alerts";
import { ApiError, apiPatch, createCheckoutSession, getAdminUsers, getCurrentUser, getDashboardStats, getMyRentalRequests, getOwnerRentalRequests, updateRentalRequestStatus, type AdminUser, type AdminUsersSummary, type CurrentUser, type DashboardStats, type RentalRequest, type RentalRequestStatus, type UserRole } from "@/lib/api";
import { formatMoney } from "@/lib/data";

type DashboardTab = "admin" | "owner" | "renter" | "profile";

const dashboardTabs: DashboardTab[] = ["admin", "owner", "renter", "profile"];

const requestStatusDetails: Record<RentalRequestStatus, string> = {
  pending: "Waiting for owner approval. You do not need to keep the checkout page open.",
  accepted: "Owner accepted. You can pay now from here or from checkout.",
  rejected: "Owner rejected this request. You can send a new request with updated details.",
  cancelled: "This request was cancelled.",
  paid: "Payment completed.",
};

function getRequestedDashboardTab() {
  if (typeof window === "undefined") return null;
  const tab = new URLSearchParams(window.location.search).get("tab");
  return dashboardTabs.includes(tab as DashboardTab) ? tab as DashboardTab : null;
}

function hasAuthMarker() {
  return typeof window !== "undefined" && window.localStorage.getItem("sharebari_authenticated") === "true";
}

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminSummary, setAdminSummary] = useState<AdminUsersSummary | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("owner");
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [ownerRequests, setOwnerRequests] = useState<RentalRequest[]>([]);
  const [payingRequestId, setPayingRequestId] = useState("");
  const [updatingRequestId, setUpdatingRequestId] = useState("");
  const [message, setMessage] = useState("Loading dashboard...");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!hasAuthMarker()) {
      Promise.resolve().then(() => {
        setIsUnauthorized(true);
        setMessage("Please log in to view your dashboard.");
      });
      return;
    }

    Promise.all([
      getDashboardStats(),
      getCurrentUser(),
      getMyRentalRequests(),
      getOwnerRentalRequests().catch(() => [] as RentalRequest[]),
    ])
      .then(([dashboardStats, currentUser, myRequests, incomingRequests]) => {
        setStats(dashboardStats);
        setUser(currentUser);
        setRentalRequests(myRequests);
        setOwnerRequests(incomingRequests);
        setMessage("");

        const requestedTab = getRequestedDashboardTab();
        if (requestedTab && (requestedTab !== "admin" || currentUser.role === "admin")) {
          setActiveTab(requestedTab);
        } else if (currentUser.role === "admin") {
          setActiveTab("admin");
        }

        if (currentUser.role === "admin") {
          getAdminUsers()
            .then((payload) => {
              setAdminUsers(payload.data);
              setAdminSummary(payload.summary);
              setAdminMessage("");
            })
            .catch((error) => {
              setAdminMessage(error instanceof Error ? error.message : "Could not load users");
            });
        }
      })
      .catch((error) => {
        setIsUnauthorized(error instanceof ApiError && error.status === 401);
        if (error instanceof ApiError && error.status === 401) {
          window.localStorage.removeItem("sharebari_authenticated");
        }
        setMessage(error instanceof Error ? error.message : "Could not load dashboard");
      });
  }, []);

  async function updateUserRole(userId: string, role: UserRole) {
    setUpdatingUserId(userId);
    setAdminMessage("");

    try {
      const payload = await apiPatch<{ data: CurrentUser }>(`/api/admin/users/${userId}/role`, { role });
      setAdminUsers((users) => users.map((candidate) => candidate._id === userId ? { ...candidate, role: payload.data.role } : candidate));
      setAdminSummary((summary) => {
        if (!summary) return summary;
        const updatedUsers = adminUsers.map((candidate) => candidate._id === userId ? { ...candidate, role } : candidate);
        return {
          ...summary,
          adminUsers: updatedUsers.filter((candidate) => candidate.role === "admin").length,
          regularUsers: updatedUsers.filter((candidate) => candidate.role !== "admin").length,
        };
      });
      await showSuccess("User updated", "The account role has been changed.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not update user";
      setAdminMessage(errorMessage);
      await showError("Could not update user", errorMessage);
    } finally {
      setUpdatingUserId("");
    }
  }

  async function updateOwnerRequest(requestId: string, status: "accepted" | "rejected") {
    setUpdatingRequestId(requestId);

    try {
      await updateRentalRequestStatus(requestId, { status });
      const [incomingRequests, dashboardStats] = await Promise.all([
        getOwnerRentalRequests(),
        getDashboardStats(),
      ]);
      setOwnerRequests(incomingRequests);
      setStats(dashboardStats);
      await showSuccess(status === "accepted" ? "Request accepted" : "Request rejected", status === "accepted" ? "The renter will see the accepted status and can pay now." : "The renter will see the rejected status.");
    } catch (error) {
      await showError("Could not update request", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setUpdatingRequestId("");
    }
  }

  async function payAcceptedRequest(requestId: string) {
    setPayingRequestId(requestId);
    try {
      const payload = await createCheckoutSession({ requestId });
      if (!payload.checkoutUrl) throw new Error("Stripe checkout URL was not returned");
      await showSuccess("Checkout ready", "You will be redirected to Stripe Checkout.");
      window.location.assign(payload.checkoutUrl);
    } catch (error) {
      await showError("Could not open checkout", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setPayingRequestId("");
    }
  }

  if (!stats) {
    if (!isUnauthorized) {
      return <LoadingState label={message || "Loading dashboard..."} />;
    }

    return (
      <div className="panel empty-state">
        <p>{isUnauthorized ? "Please log in to view your dashboard." : message}</p>
        {isUnauthorized ? (
          <Link className="button" href="/login">
            <LogIn size={17} aria-hidden="true" />
            Login
          </Link>
        ) : null}
      </div>
    );
  }

  const categoryData = stats.byCategory?.map((item) => ({ name: item._id, count: item.count })) || [];
  const availabilityData = stats.byAvailability?.map((item) => ({ name: item._id, count: item.count })) || [];
  const roleLabel = stats.totalListedItems > 0 ? "Owner workspace" : "Renter workspace";
  const healthScore = stats.totalListedItems === 0 ? 0 : Math.round((stats.availableItems / stats.totalListedItems) * 100);
  const isAdmin = user?.role === "admin";

  return (
    <>
      <section className="dashboard-hero panel">
        <div>
          <p className="eyebrow">{isAdmin ? "Admin workspace" : "Role based workspace"}</p>
          <h2>{isAdmin ? "Admin control room" : roleLabel}</h2>
          <p>
            {isAdmin
              ? "Manage users, review platform activity, and keep marketplace accounts organized from one place."
              : stats.totalListedItems > 0
              ? "Manage your listed inventory, availability, pricing, and renter activity from one place."
              : "Browse rentals, start listing your first item, and build your owner dashboard as soon as you publish."}
          </p>
        </div>
        <div className="dashboard-profile">
          <span className="avatar avatar-large" aria-hidden="true">
            {user?.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : <UserRound size={24} />}
          </span>
          <div>
            <strong>{user?.name || "ShareBari user"}</strong>
            <span>{user?.email || "Authenticated account"}</span>
            <small>{user?.role || "user"} account</small>
          </div>
        </div>
      </section>

      <section className="dashboard-tabs" aria-label="Dashboard roles">
        {isAdmin ? (
          <button className={activeTab === "admin" ? "active" : ""} type="button" onClick={() => setActiveTab("admin")}>
            <Crown size={16} aria-hidden="true" /> Admin
          </button>
        ) : null}
        <button className={activeTab === "owner" ? "active" : ""} type="button" onClick={() => setActiveTab("owner")}>
          <Boxes size={16} aria-hidden="true" /> Owner
        </button>
        <button className={activeTab === "renter" ? "active" : ""} type="button" onClick={() => setActiveTab("renter")}>
          <CalendarClock size={16} aria-hidden="true" /> Renter
        </button>
        <button className={activeTab === "profile" ? "active" : ""} type="button" onClick={() => setActiveTab("profile")}>
          <ShieldCheck size={16} aria-hidden="true" /> Profile
        </button>
      </section>

      {activeTab === "admin" && isAdmin && adminSummary ? (
        <section className="dashboard-stats">
          <div className="panel stat-card"><UsersRound size={20} aria-hidden="true" /><span>Total users</span><strong>{adminSummary.totalUsers}</strong></div>
          <div className="panel stat-card"><Crown size={20} aria-hidden="true" /><span>Admin users</span><strong>{adminSummary.adminUsers}</strong><small>{adminSummary.regularUsers} regular</small></div>
          <div className="panel stat-card"><PackageCheck size={20} aria-hidden="true" /><span>Total listings</span><strong>{adminSummary.totalItems}</strong></div>
          <div className="panel stat-card"><CircleDollarSign size={20} aria-hidden="true" /><span>Payment records</span><strong>{adminSummary.totalPayments}</strong></div>
        </section>
      ) : (
        <section className="dashboard-stats">
          <div className="panel stat-card"><PackageCheck size={20} aria-hidden="true" /><span>Total listed items</span><strong>{stats.totalListedItems}</strong></div>
          <div className="panel stat-card"><Gauge size={20} aria-hidden="true" /><span>Available items</span><strong>{stats.availableItems}</strong><small>{healthScore}% ready</small></div>
          <div className="panel stat-card"><Boxes size={20} aria-hidden="true" /><span>Rented items</span><strong>{stats.rentedItems}</strong></div>
          <div className="panel stat-card"><CircleDollarSign size={20} aria-hidden="true" /><span>Average daily price</span><strong>{formatMoney(stats.averageDailyPrice)}</strong></div>
        </section>
      )}

      {activeTab === "admin" && isAdmin ? (
        <section className="panel admin-users-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">User management</p>
              <h3>Marketplace accounts</h3>
            </div>
            <span className="badge">{adminUsers.length} users</span>
          </div>
          {adminMessage ? <p className="notice">{adminMessage}</p> : null}
          <div className="admin-user-table" role="table" aria-label="Admin user management">
            <div className="admin-user-row admin-user-head" role="row">
              <span role="columnheader">User</span>
              <span role="columnheader">Location</span>
              <span role="columnheader">Listings</span>
              <span role="columnheader">Role</span>
            </div>
            {adminUsers.map((account) => (
              <div className="admin-user-row" role="row" key={account._id}>
                <span role="cell">
                  <strong>{account.name}</strong>
                  <small>{account.email}</small>
                </span>
                <span role="cell">{account.location || "Not set"}</span>
                <span role="cell">{account.listedItems}</span>
                <span role="cell">
                  <span className="admin-role-select-wrap">
                    <select
                      className="admin-role-select"
                      value={account.role || "user"}
                      disabled={updatingUserId === account._id}
                      onChange={(event) => updateUserRole(account._id, event.target.value as UserRole)}
                      aria-label={`Change role for ${account.name}`}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <ChevronDown size={16} aria-hidden="true" />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "owner" ? (
        <section className="dashboard-grid">
          <div className="panel chart-panel">
            <div className="panel-title-row">
              <h3>Items by category</h3>
              <span className="badge">{categoryData.length || 0} groups</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2d1400" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="panel chart-panel">
            <div className="panel-title-row">
              <h3>Availability distribution</h3>
              <span className="badge badge-warm">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8f7968" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      <section className="dashboard-grid dashboard-grid-tight">
        {activeTab === "owner" ? <div className="panel workspace-panel rental-requests-panel">
          <div className="panel-title-row">
            <div>
              <h3>Incoming rental requests</h3>
              <p>Accept or reject renter requests without leaving the dashboard.</p>
            </div>
            <span className="badge">{ownerRequests.length} requests</span>
          </div>
          {ownerRequests.length === 0 ? <p>No incoming requests yet.</p> : (
            <div className="request-list">
              {ownerRequests.map((request) => (
                <div className="request-row" key={request._id}>
                  <div>
                    <strong>{request.item?.title || "Rental item"}</strong>
                    <p>{request.renter?.name || "Renter"} - {request.rentalDays} day(s) - {formatMoney(request.totalAmount)}</p>
                    <small>{request.renterMessage || requestStatusDetails[request.status]}</small>
                  </div>
                  <span className={`badge status-badge status-${request.status}`}>{request.status}</span>
                  {request.status === "pending" ? (
                    <div className="manage-actions">
                      <button className="icon-button" type="button" disabled={updatingRequestId === request._id} onClick={() => updateOwnerRequest(request._id, "accepted")} aria-label="Accept request" title="Accept request">
                        <Check size={18} aria-hidden="true" />
                      </button>
                      <button className="icon-button danger" type="button" disabled={updatingRequestId === request._id} onClick={() => updateOwnerRequest(request._id, "rejected")} aria-label="Reject request" title="Reject request">
                        <X size={18} aria-hidden="true" />
                      </button>
                    </div>
                  ) : <small className="request-state-note">{requestStatusDetails[request.status]}</small>}
                </div>
              ))}
            </div>
          )}
        </div> : null}
        {activeTab === "owner" ? <div className="panel workspace-panel">
          <h3>Owner actions</h3>
          <p>Keep item data fresh so renters can trust price, condition, and pickup expectations.</p>
          <div className="action-row">
            <Link className="button" href="/items/add">
              <Plus size={17} aria-hidden="true" />
              Add item
            </Link>
            <Link className="button-ghost" href="/items/manage">
              <PackageSearch size={17} aria-hidden="true" />
              Manage listings
            </Link>
          </div>
        </div> : null}
        {activeTab === "renter" ? <div className="panel workspace-panel rental-requests-panel">
          <div className="panel-title-row">
            <div>
              <h3>My rental requests</h3>
              <p>Owner approval appears here. Accepted requests can continue to payment.</p>
            </div>
            <span className="badge">{rentalRequests.length} requests</span>
          </div>
          {rentalRequests.length === 0 ? <p>No requests yet.</p> : (
            <div className="request-list">
              {rentalRequests.map((request) => (
                <div className="request-row" key={request._id}>
                  <div>
                    <strong>{request.item?.title || "Rental item"}</strong>
                    <p>{request.rentalDays} day(s) · {formatMoney(request.totalAmount)}</p>
                    <small>Owner: {request.owner?.name || "ShareBari owner"}</small>
                    <small>{request.ownerNote || requestStatusDetails[request.status]}</small>
                  </div>
                  <span className={`badge status-badge status-${request.status}`}>{request.status}</span>
                  {request.status === "accepted" ? (
                    <button className="button" type="button" disabled={payingRequestId === request._id} onClick={() => payAcceptedRequest(request._id)}>
                      <CreditCard size={17} aria-hidden="true" />
                      {payingRequestId === request._id ? "Opening..." : "Pay"}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          <div className="action-row">
            <Link className="button-secondary" href="/explore">
              <Compass size={17} aria-hidden="true" />
              Explore rentals
            </Link>
            <Link className="button-ghost" href="/profile">
              <Pencil size={17} aria-hidden="true" />
              Update profile
            </Link>
          </div>
        </div> : null}
        {activeTab === "profile" ? <div className="panel workspace-panel">
          <h3>Profile settings</h3>
          <p>Update your name, contact details, location, and profile image.</p>
          <div className="action-row">
            <Link className="button" href="/profile">
              <Pencil size={17} aria-hidden="true" />
              Edit profile
            </Link>
            <Link className="button-ghost" href="/items/manage">
              <PackageSearch size={17} aria-hidden="true" />
              My listings
            </Link>
          </div>
        </div> : null}
        {activeTab === "admin" && isAdmin ? <div className="panel workspace-panel">
          <h3>Admin actions</h3>
          <p>Use the role dropdowns above to promote admins or return accounts to regular user access.</p>
          <div className="action-row">
            <Link className="button" href="/items/manage">
              <PackageSearch size={17} aria-hidden="true" />
              Review my listings
            </Link>
            <Link className="button-ghost" href="/explore">
              <Compass size={17} aria-hidden="true" />
              Browse marketplace
            </Link>
          </div>
        </div> : null}
      </section>
    </>
  );
}
