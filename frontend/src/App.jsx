import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBooking from './pages/CreateBooking';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      {/* Внешний фон. На телефоне он будет скрыт под приложением, а на ПК будет красивым фоном */}
      <div className="flex justify-center min-h-screen bg-slate-200 sm:py-6 sm:px-4">
        
        <div className="w-full max-w-[390px] min-h-[100dvh] sm:min-h-[844px] bg-slate-50 relative flex flex-col sm:rounded-[30px] sm:shadow-2xl overflow-hidden">
          
          {/* Наша стеклянная шапка (оставляем, она дает стиль iOS) */}
          <header className="pt-4 pb-3 px-4 text-center font-bold text-lg sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-slate-200/60 text-slate-800 flex items-center justify-center gap-2">
            <span className="text-xl">🥂</span> Банкетам.Нет
          </header>

          <main className="flex-1 flex flex-col overflow-y-auto hide-scrollbar relative">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-booking" element={<CreateBooking />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
