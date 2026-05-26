import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $host from '../api/axios';
import Slider from '../components/Slider';

export default function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [reviewText, setReviewText] = useState({}); // Храним текст отзыва для каждой заявки по её id
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await $host.get('/booking/mine');
            setBookings(data);
        } catch (e) {
            console.error('Ошибка загрузки заявок');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const submitReview = async (bookingId) => {
        try {
            if (!reviewText[bookingId]) return;
            await $host.post('/review', { bookingId, text: reviewText[bookingId] });
            alert("Отзыв успешно отправлен!");
            setReviewText({ ...reviewText, [bookingId]: '' });
        } catch (e) {
            alert(e.response?.data?.message || "Ошибка отправки отзыва");
        }
    };

    // Функция для цвета статуса
    const getStatusColor = (status) => {
        if (status === 'Банкет назначен') return 'text-orange-600 bg-orange-100';
        if (status === 'Банкет завершен') return 'text-green-600 bg-green-100';
        return 'text-gray-600 bg-gray-200'; // Для 'Новая'
    };

    return (
        <div className="p-4 flex flex-col h-full overflow-y-auto pb-20">
            {/* Шапка ЛК */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Личный кабинет</h2>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Выйти</button>
            </div>

            {/* Слайдер */}
            <Slider />

            {/* Блок с заявками */}
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">Мои заявки</h3>
                <Link to="/create-booking" className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                    + Новая
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">У вас пока нет заявок</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold">{booking.room_type}</span>
                                <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">Дата: {booking.event_date}</div>
                            <div className="text-sm text-gray-600 mb-3">Оплата: {booking.payment_method}</div>
                            
                            {/* Форма отзыва (только если статус НЕ 'Новая') */}
                            {booking.status !== 'Новая' && (
                                <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-gray-500 mb-1">Оставить отзыв:</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Напишите впечатления..."
                                            className="flex-1 border rounded px-2 py-1 text-sm focus:outline-blue-500"
                                            value={reviewText[booking.id] || ''}
                                            onChange={(e) => setReviewText({...reviewText, [booking.id]: e.target.value})}
                                        />
                                        <button 
                                            onClick={() => submitReview(booking.id)}
                                            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Отправить
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
