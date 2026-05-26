import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $host from '../api/axios';

export default function Register() {
    const [formData, setFormData] = useState({
        login: '', password: '', full_name: '', phone: '', email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await $host.post('/auth/register', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            navigate('/dashboard'); // После успешной регистрации сразу в ЛК
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Регистрация</h2>
            
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
                {error && <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</div>}
                
                <div>
                    <input name="login" type="text" placeholder="Логин (от 6 симв., латиница и цифры)" 
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        value={formData.login} onChange={handleChange} required />
                </div>
                <div>
                    <input name="password" type="password" placeholder="Пароль (от 8 симв.)" 
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <input name="full_name" type="text" placeholder="ФИО" 
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        value={formData.full_name} onChange={handleChange} required />
                </div>
                <div>
                    <input name="phone" type="tel" placeholder="Телефон" 
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <input name="email" type="email" placeholder="E-mail" 
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        value={formData.email} onChange={handleChange} required />
                </div>
                
                <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700 transition-colors">
                    Зарегистрироваться
                </button>
            </form>

            <div className="text-center mt-4">
                <Link to="/login" className="text-blue-600 text-sm hover:underline">
                    Уже есть аккаунт? Войти
                </Link>
            </div>
        </div>
    );
}
