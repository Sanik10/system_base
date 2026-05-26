import { useState, useEffect } from 'react';

// Заглушки для 4 одинаковых по размеру изображений
const images = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&h=200&q=80",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&h=200&q=80",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&h=200&q=80",
    "https://images.unsplash.com/photo-1466978913421-bac2e592285a?auto=format&fit=crop&w=400&h=200&q=80"
];

export default function Slider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Автопереключение каждые 3 секунды (требование задания)
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval); // Очищаем интервал при удалении компонента
    }, []);

    return (
        <div className="relative w-full h-[200px] overflow-hidden rounded-lg shadow-md mb-6 group">
            <img 
                src={images[currentIndex]} 
                alt="Banquet" 
                className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
            
            {/* Кнопка Назад */}
            <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                &#10094;
            </button>
            
            {/* Кнопка Вперед */}
            <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                &#10095;
            </button>
        </div>
    );
}
