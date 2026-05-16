import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-500 text-sm">User data from login/register response (no profile API on server)</p>
      </header>

      <article className="glass-card rounded-2xl p-8 space-y-6">
        <p className="flex items-center gap-4">
          <span className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
          <span>
            <span className="block text-xl font-bold">{user?.name}</span>
            <span className="text-slate-500 text-sm">Member</span>
          </span>
        </p>

        <ul className="space-y-4">
          <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-dark-bg">
            <User className="h-5 w-5 text-slate-400" />
            <span>
              <span className="block text-xs text-slate-500">Name</span>
              <span className="font-medium">{user?.name}</span>
            </span>
          </li>
          <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-dark-bg">
            <Mail className="h-5 w-5 text-slate-400" />
            <span>
              <span className="block text-xs text-slate-500">Email</span>
              <span className="font-medium">{user?.email}</span>
            </span>
          </li>
          <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-dark-bg">
            <Shield className="h-5 w-5 text-slate-400" />
            <span>
              <span className="block text-xs text-slate-500">User ID</span>
              <span className="font-mono text-sm">{user?._id}</span>
            </span>
          </li>
          {user?.systemUser && (
            <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-dark-bg">
              <Shield className="h-5 w-5 text-primary-500" />
              <span>
                <span className="block text-xs text-slate-500">Access</span>
                <span className="font-medium">Admin / System User</span>
              </span>
            </li>
          )}
        </ul>
      </article>
    </section>
  );
};

export default Profile;
