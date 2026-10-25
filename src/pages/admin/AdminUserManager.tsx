import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { UserRoleRecord, UserRoleType } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';

export const AdminUserManager: React.FC = () => {
  const { user: currentAuthUser } = useAuth();
  const [users, setUsers] = useState<UserRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await AdminService.getRegisteredUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (targetUser: UserRoleRecord, newRole: UserRoleType) => {
    // Prevent self-demotion from admin
    if (targetUser.userId === currentAuthUser?.id && newRole === 'user') {
      setFeedback({
        type: 'error',
        message: 'Security safeguard: You cannot remove your own administrator privileges to prevent accidental lockout.',
      });
      return;
    }

    const success = await AdminService.updateUserRole(targetUser.userId, newRole, targetUser.email);
    if (success) {
      setFeedback({
        type: 'success',
        message: `Updated ${targetUser.email || 'user'} role to ${newRole.toUpperCase()} in Supabase.`,
      });
      setUsers((prev) =>
        prev.map((u) => (u.userId === targetUser.userId ? { ...u, role: newRole } : u))
      );
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({
        type: 'error',
        message: 'Failed to update user role. Ensure you have authorized database privileges.',
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.fullName && u.fullName.toLowerCase().includes(term)) ||
      u.role.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-lime-400" />
            <span>Registered Lifters & Role Authorization</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Database-backed role management with Row Level Security. Passwords and credentials remain private and unexposed.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-lime-400' : ''}`} />
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter by email, name, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">User Email / Account</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Authorization Role</th>
                <th className="px-4 py-3">Registered On</th>
                <th className="px-4 py-3 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredUsers.map((u) => {
                const isSelf = u.userId === currentAuthUser?.id;
                return (
                  <tr key={u.userId} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.role === 'admin' ? 'bg-lime-400' : 'bg-zinc-500'
                          }`}
                        />
                        <span>{u.email || 'Anonymous Lifter'}</span>
                        {isSelf && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-400 font-bold">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-zinc-300">{u.fullName || '—'}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{u.role}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3 text-zinc-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role === 'admin' ? (
                          <button
                            onClick={() => handleRoleChange(u, 'user')}
                            disabled={isSelf}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-[11px] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Demote to User
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u, 'admin')}
                            className="px-2.5 py-1 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 text-[11px] font-semibold"
                          >
                            Promote to Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
