import { useEffect, useState } from 'react';
import backend from '../../api/backend';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await backend.get('/users');
            setUsers(res.data.users || []);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleBan = async (id) => {
        try {
            const res = await backend.patch(`/users/${id}/ban`);
            setUsers(users.map(u => u._id === id ? res.data.user : u));
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this user? This action cannot be undone.')) return;
        try {
            await backend.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    return (
        <div className="bg-primary/5 rounded-xl border border-primary/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Manage Users ({users.length})</h2>
            </div>
            {loading && <div className="skeleton h-20 w-full rounded-lg"></div>}
            {!loading && users.length === 0 && (
                <div className="text-center py-12 text-slate-500">No users registered yet.</div>
            )}
            <div className="space-y-3">
                {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-sm">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold flex items-center gap-2">
                                    {user.name}
                                    {user.isBanned && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Banned</span>}
                                </p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBan(user._id)}
                                className={`p-2 rounded-lg transition-all ${user.isBanned ? 'text-green-500 hover:bg-green-500/10' : 'text-amber-500 hover:bg-amber-500/10'}`}
                                title={user.isBanned ? 'Unban User' : 'Ban User'}
                            >
                                <span className="material-symbols-outlined text-xl">{user.isBanned ? 'check_circle' : 'block'}</span>
                            </button>
                            <button
                                onClick={() => handleDelete(user._id)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                                title="Delete User"
                            >
                                <span className="material-symbols-outlined text-xl">person_remove</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
