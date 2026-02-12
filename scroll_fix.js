/**
 * lampa-scroll-fix plugin v1.0.18
 * Allows vertical mouse wheel scroll on movie posters/cards
 * Blocks horizontal scroll jumps between items
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.18] Initialized');

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

    // Переопределяем обработку wheel событий в горизонтальных скроллах
    // Когда колесико крутится над обложкой, не нужно переключать карточки
    document.addEventListener('wheel', function(evt) {
        const target = evt.target;
        if (!isMoviePosterArea(target)) {
            return;
        }

        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Прерываем распространение wheel события чтобы не достало Lampa
        evt.stopImmediatePropagation();
        evt.preventDefault();

        console.log('[scroll_fix] Intercepted wheel (deltaY=' + Math.round(deltaY) + ', deltaX=' + Math.round(deltaX) + ')');

        // Если движение явно горизонтальное - игнорируем
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 0) {
            console.log('[scroll_fix] Blocking horizontal scroll');
            return;
        }

        // Если вертикальное движение - имитируем нажатие клавиши
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 0) {
            const isDown = deltaY > 0;
            console.log('[scroll_fix] Simulating ' + (isDown ? 'Down' : 'Up') + ' key');

            const keyEvent = new KeyboardEvent('keydown', {
                keyCode: isDown ? 40 : 38,
                code: isDown ? 'ArrowDown' : 'ArrowUp',
                key: isDown ? 'ArrowDown' : 'ArrowUp',
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyEvent);
        }
    }, true);

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
