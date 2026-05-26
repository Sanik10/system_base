import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $host from '../api/axios';

export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Сюда пишем ошибки от бэкенда
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // чтобы страница не перезагружалась
        try {
            const { data } = await $host.post('/auth/login', { login, password });
            
            // Сохраняем токен и роль в память браузера
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            
            // Если Админ - кидаем в админку, если юзер - в личный кабинет
            if (data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            // Если ввели неверные данные, бэкенд пришлет текст ошибки
            setError(err.response?.data?.message || 'Ошибка авторизации');
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Вход в систему</h2>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {error && <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</div>}
                
                <input 
                    type="text" 
                    placeholder="Логин" 
                    className="border p-2 rounded focus:outline-blue-500"
                    value={login} 
                    onChange={e => setLogin(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Пароль" 
                    className="border p-2 rounded focus:outline-blue-500"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                    Войти
                </button>
            </form>

            <div className="text-center mt-4">
                <Link to="/register" className="text-blue-600 text-sm hover:underline">
                    Еще не зарегистрированы? Регистрация
                </Link>
            </div>
        </div>
    );
}
