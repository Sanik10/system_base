import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $host from '../api/axios';

export default function CreateBooking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        room_type: 'Зал',
        event_date: '',
        payment_method: 'Наличные'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Отправляем данные на бэкенд
            await $host.post('/booking', formData);
            // Возвращаем пользователя в личный кабинет после успеха
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при создании заявки');
        }
    };

    return (
        <div className="p-4 flex flex-col h-full bg-white">
            <div className="flex items-center mb-6 border-b pb-3">
                <button onClick={() => navigate('/dashboard')} className="text-xl mr-3 font-bold text-gray-600 hover:text-black">
                    &larr;
                </button>
                <h2 className="text-xl font-bold">Оформление заявки</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</div>}
                
                {/* Выпадающий список помещений */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Выберите помещение:</label>
                    <select 
                        name="room_type" 
                        value={formData.room_type} 
                        onChange={handleChange}
                        className="border p-2 rounded bg-gray-50 focus:outline-blue-500"
                    >
                        <option value="Зал">Зал</option>
                        <option value="Ресторан">Ресторан</option>
                        <option value="Летняя веранда">Летняя веранда</option>
                        <option value="Закрытая веранда">Закрытая веранда</option>
                    </select>
                </div>

                {/* Выбор даты */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Дата банкета:</label>
                    <input 
                        type="date" 
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded bg-gray-50 focus:outline-blue-500"
                    />
                    <span className="text-xs text-gray-400">В формате ДД.ММ.ГГГГ</span>
                </div>

                {/* Выпадающий список оплаты */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Способ оплаты:</label>
                    <select 
                        name="payment_method" 
                        value={formData.payment_method} 
                        onChange={handleChange}
                        className="border p-2 rounded bg-gray-50 focus:outline-blue-500"
                    >
                        <option value="Наличные">Наличные</option>
                        <option value="Банковская карта">Банковская карта</option>
                        <option value="Перевод">Перевод на счет</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg mt-4 font-semibold hover:bg-blue-700 transition-colors">
                    Отправить на согласование
                </button>
            </form>
        </div>
    );
}
