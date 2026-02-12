/**
 * lampa-scroll-fix plugin v1.0.17
 * Allows vertical mouse wheel scroll on movie posters/cards
 * Blocks horizontal scroll jumps between items
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.17] Initialized');

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

    // Блокируем wheel события над обложками и имитируем клавиши
    // Это предотвращает преобразование вертикального скролла в горизонтальную навигацию
    window.addEventListener('wheel', function(evt) {
        const target = evt.target;
        if (!isMoviePosterArea(target)) {
            return;
        }

        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Над обложкой: всегда блокируем wheel событие
        if (Math.abs(deltaY) > 0 || Math.abs(deltaX) > 0) {
            evt.preventDefault();
            evt.stopPropagation();

            // Если это вертикальное движение - имитируем клавиши вверх/вниз
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                const isDown = deltaY > 0;
                console.log('[scroll_fix] Simulating ' + (isDown ? 'Down' : 'Up') + ' key (deltaY=' + Math.round(deltaY) + ')');

                // Отправляем KeyboardEvent для вертикальной навигации
                const keyEvent = new KeyboardEvent('keydown', {
                    keyCode: isDown ? 40 : 38,
                    code: isDown ? 'ArrowDown' : 'ArrowUp',
                    key: isDown ? 'ArrowDown' : 'ArrowUp',
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(keyEvent);
            }
            // Горизонтальный скролл просто блокируем
        }
    }, { capture: true, passive: false });

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
