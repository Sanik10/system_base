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

    // Функция для цвета статуса (Современные бейджи)
    const getStatusStyle = (status) => {
        if (status === 'Банкет назначен') return 'bg-orange-100 text-orange-700 border-orange-200';
        if (status === 'Банкет завершен') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        return 'bg-slate-100 text-slate-600 border-slate-200'; 
    };

    return (
        <div className="p-5 flex flex-col h-full pb-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Кабинет</h2>
                    <p className="text-xs text-slate-500">Управление заявками</p>
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-transform">
                    Выйти
                </button>
            </div>

            <Slider />

            <div className="flex justify-between items-end mb-4 mt-2">
                <h3 className="font-bold text-lg text-slate-800">Мои бронирования</h3>
                <Link to="/create-booking" className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md shadow-indigo-200 active:scale-95 transition-transform">
                    + Новая
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center text-slate-400 mt-10 bg-slate-100 py-10 rounded-2xl border border-slate-200/60 text-sm">
                    У вас пока нет заявок
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_4px_15px_rgb(0,0,0,0.08)] transition-shadow">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-slate-800">{booking.room_type}</span>
                                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-bold ${getStatusStyle(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-1 mb-4">
                                <div className="text-sm flex justify-between border-b border-slate-50 pb-1">
                                    <span className="text-slate-500">Дата:</span>
                                    <span className="font-medium text-slate-700">{booking.event_date}</span>
                                </div>
                                <div className="text-sm flex justify-between">
                                    <span className="text-slate-500">Оплата:</span>
                                    <span className="font-medium text-slate-700">{booking.payment_method}</span>
                                </div>
                            </div>
                            
						{booking.reviews && booking.reviews.length > 0 ? (
						<div className="mt-3 bg-indigo-50 text-indigo-800 p-3 rounded-xl text-sm border border-indigo-100 italic">
							<span className="font-semibold not-italic">Ваш отзыв: </span> 
							"{booking.reviews[0].text}"
						</div>
						) : (
							booking.status !== 'Новая' && (
								<div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
									<p className="text-xs font-medium text-slate-500 mb-2">Оставить отзыв:</p>
									<div className="flex gap-2">
										<input 
											type="text" placeholder="Всё супер!..."
											className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
											value={reviewText[booking.id] || ''}
											onChange={(e) => setReviewText({...reviewText, [booking.id]: e.target.value})}
										/>
										<button 
											onClick={() => {
												submitReview(booking.id);
												setTimeout(fetchBookings, 300); // Обновляем список заявок после отправки
											}}
											className="bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
										>
											Отправить
										</button>
									</div>
								</div>
							)
						)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
