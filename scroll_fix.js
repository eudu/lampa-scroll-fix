/**
 * lampa-scroll-fix plugin v1.0.15
 * Allows vertical mouse wheel scroll on movie posters/cards
 * Blocks horizontal scroll jumps between items
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.15] Initialized');

    function isMoviePosterArea(el) {
        // Проверяем, находимся ли мы над обложкой фильма или его контейнером
        let current = el;
        while (current && current !== document.body) {
            const classList = current.classList || {};
            const tagName = current.tagName || '';

            // Ищем карточку/постер/элемент в сетке
            if (classList.contains('card') ||
                classList.contains('poster') ||
                classList.contains('item') ||
                classList.contains('cover') ||
                classList.contains('element') ||
                tagName === 'IMG' ||
                (tagName === 'DIV' && classList.contains('selector'))) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // Блокируем горизонтальный скролл над обложками
    // Вертикальный скролл пропускаем - пускай Lampa сам обрабатывает
    window.addEventListener('wheel', function(evt) {
        if (!isMoviePosterArea(evt.target)) {
            return;
        }

        const deltaY = Math.abs(evt.deltaY);
        const deltaX = Math.abs(evt.deltaX);

        // Если это явно горизонтальный скролл (deltaX больше deltaY)
        // Блокируем его чтобы не переключаться между карточками
        if (deltaX > deltaY && deltaX > 0) {
            console.log('[scroll_fix] Blocking horizontal scroll over poster (deltaX=' + Math.round(deltaX) + ')');
            evt.preventDefault();
        }
        // Вертикальный скролл (deltaY > deltaX) - пускаем через, Lampa обработает как навигацию
    }, { capture: true, passive: false });

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
