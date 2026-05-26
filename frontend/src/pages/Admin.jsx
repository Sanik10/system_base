import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $host from '../api/axios';

export default function Admin() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    
    // Состояния для фильтров и сортировки
    const [filterStatus, setFilterStatus] = useState('Все');
    const [sortOrder, setSortOrder] = useState('newest'); // newest / oldest
    
    // Состояния для пагинации (постраничной навигации)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // по 4 заявки на страницу

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await $host.get('/booking/all');
            setBookings(data);
        } catch (e) {
            alert('Ошибка загрузки заявок');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await $host.put(`/booking/${id}/status`, { status: newStatus });
            // Всплывающее окно (alert)
            alert(`Статус заявки №${id} изменен на "${newStatus}"`);
            fetchBookings(); // Перезагружаем список
        } catch (e) {
            alert('Ошибка изменения статуса');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const getStatusColor = (status) => {
        if (status === 'Банкет назначен') return 'text-orange-600 bg-orange-100';
        if (status === 'Банкет завершен') return 'text-green-600 bg-green-100';
        return 'text-gray-600 bg-gray-200';
    };

    // --- ЛОГИКА ФИЛЬТРАЦИИ И СОРТИРОВКИ ---
    let filteredBookings = bookings;
    
    if (filterStatus !== 'Все') {
        filteredBookings = bookings.filter(b => b.status === filterStatus);
    }

    filteredBookings.sort((a, b) => {
        if (sortOrder === 'newest') return b.id - a.id; // новые сверху
        return a.id - b.id; // старые сверху
    });

    // --- ЛОГИКА ПАГИНАЦИИ ---
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="p-4 flex flex-col h-full bg-gray-50">
            {/* Шапка */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold text-blue-700">Панель Админа</h2>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Выйти</button>
            </div>

            {/* Инструменты управления (Требование Модуль 2) */}
            <div className="bg-white p-3 rounded shadow-sm mb-4 text-sm flex flex-col gap-2 border">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Фильтр по статусу:</span>
                    <select 
                        className="border p-1 rounded bg-gray-50"
                        value={filterStatus} 
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="Все">Все</option>
                        <option value="Новая">Новая</option>
                        <option value="Банкет назначен">Банкет назначен</option>
                        <option value="Банкет завершен">Банкет завершен</option>
                    </select>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Сортировка по дате создания:</span>
                    <select 
                        className="border p-1 rounded bg-gray-50"
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                    </select>
                </div>
            </div>

            {/* Список заявок */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {currentItems.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">Заявок не найдено</div>
                ) : (
                    currentItems.map(booking => (
                        <div key={booking.id} className="bg-white p-3 rounded shadow border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm">Заявка №{booking.id}</span>
                                <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Клиент:</span> {booking.user?.full_name} ({booking.user?.phone})
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Помещение:</span> {booking.room_type}
                            </div>
                            <div className="text-xs text-gray-600 mb-3">
                                <span className="font-semibold">Дата банкета:</span> {booking.event_date}
                            </div>

							{booking.reviews && booking.reviews.length > 0 && (
								<div className="mt-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-xs text-indigo-900 italic">
									<span className="font-bold not-italic">Отзыв клиента:</span> "{booking.reviews[0].text}"
								</div>
							)}
                            
                            {/* Инструменты изменения статуса */}
                            <div className="flex gap-2 border-t pt-2 mt-2">
                                {booking.status === 'Новая' && (
                                    <button onClick={() => updateStatus(booking.id, 'Банкет назначен')} className="flex-1 bg-orange-500 text-white text-xs py-1.5 rounded hover:bg-orange-600">
                                        Назначить банкет
                                    </button>
                                )}
                                {booking.status === 'Банкет назначен' && (
                                    <button onClick={() => updateStatus(booking.id, 'Банкет завершен')} className="flex-1 bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700">
                                        Завершить банкет
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Постраничная навигация (Пагинация) */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
                    >
                        Назад
                    </button>
                    <span className="text-sm font-semibold text-gray-600">
                        Стр. {currentPage} из {totalPages}
                    </span>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
}
