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

    // Блокируем прокрутку контейнера над обложками
    // Это предотвращает переключение между карточками при крутении колесика мыши
    window.addEventListener('wheel', function(evt) {
        if (!isMoviePosterArea(evt.target)) {
            return;
        }

        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Над обложкой фильма: блокируем ВСЕ события скролла
        // Это предотвращает как горизонтальное переключение, так и вертикальную прокрутку контейнера
        if (Math.abs(deltaY) > 0 || Math.abs(deltaX) > 0) {
            console.log('[scroll_fix] Blocking scroll over poster (deltaY=' + Math.round(deltaY) + ', deltaX=' + Math.round(deltaX) + ')');
            evt.preventDefault();

            // Если это было вертикальное движение колесика, имитируем нажатие клавиши для навигации
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Отправляем событие клавиши вверх или вниз для Lampa
                const keyCode = deltaY > 0 ? 40 : 38; // 40=Down, 38=Up
                const keyEvent = new KeyboardEvent('keydown', {
                    keyCode: keyCode,
                    key: keyCode === 40 ? 'ArrowDown' : 'ArrowUp',
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(keyEvent);
            }
        }
    }, { capture: true, passive: false });
})();
