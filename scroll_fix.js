/**
 * lampa-scroll-fix plugin v1.0.14
 * Disables horizontal navigation on vertical mouse wheel scroll over movie posters
 * Allows proper content scrolling in text areas
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.14] Initialized');

    function isMoviePosterArea(el) {
        // Проверяем, находимся ли мы над обложкой фильма или картинкой
        let current = el;
        while (current && current !== document.body) {
            // Ищем картинки, изображения, обложки
            if (current.tagName === 'IMG' ||
                current.tagName === 'A' ||
                current.classList && (
                    current.classList.contains('card') ||
                    current.classList.contains('poster') ||
                    current.classList.contains('item') ||
                    current.classList.contains('cover')
                )) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // Блокируем скролл только над обложками фильмов
    window.addEventListener('wheel', function(evt) {
        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Только вертикальный скролл (Y > X)
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 0) {
            // Если курсор над обложкой/картинкой - блокируем скролл
            if (isMoviePosterArea(evt.target)) {
                console.log('[scroll_fix] Blocking scroll over poster');
                evt.preventDefault();
            }
            // Иначе скролл работает как обычно (скроллит контент или страницу)
        }
    }, { capture: true, passive: false });
})();
