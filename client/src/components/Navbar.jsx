import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">📝 Blog</Link>
      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/create">+ New Post</Link>
            <span className="text-sm">Hello, {user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}