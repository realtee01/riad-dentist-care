import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../Chatbot';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
