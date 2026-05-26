import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $host from '../api/axios';

export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await $host.post('/auth/login', { login, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка авторизации');
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h2 className="text-2xl font-extrabold text-center mb-2 text-slate-800">Добро пожаловать</h2>
                <p className="text-center text-sm text-slate-500 mb-6">Войдите, чтобы продолжить</p>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">{error}</div>}
                    
                    <input 
                        type="text" placeholder="Логин" required
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={login} onChange={e => setLogin(e.target.value)}
                    />
                    <input 
                        type="password" placeholder="Пароль" required
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                    
                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all mt-2">
                        Войти
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/register" className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
                        Создать новый аккаунт
                    </Link>
                </div>
            </div>
        </div>
    );
}
