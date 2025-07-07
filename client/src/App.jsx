import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="p-4 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </>
  );
}