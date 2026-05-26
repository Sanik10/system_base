import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // ДОБАВИЛИ ИМПОРТ

// Заглушки для оставшихся страниц (Оформить заявку и Админ)
const CreateBooking = () => <div className="p-4 text-center">Оформить заявку</div>;
const AdminPanel = () => <div className="p-4 text-center">Панель Администратора</div>;

function App() {
  return (
    <BrowserRouter>
      {/* Главный контейнер (имитация экрана мобильного телефона) */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[390px] h-[844px] bg-white shadow-2xl relative overflow-y-auto flex flex-col">
          
          <header className="bg-blue-600 text-white p-4 text-center font-bold text-xl sticky top-0 z-10 shadow-md">
            Банкетам.Нет
          </header>

          <main className="flex-1 flex flex-col bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-booking" element={<CreateBooking />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
