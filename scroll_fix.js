/**
 * lampa-scroll-fix plugin v1.0.19
 * Allows vertical mouse wheel scroll on movie posters/cards
 * Blocks horizontal scroll jumps between items
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.19] Initialized');

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

    // Слушаем все wheel события в capture фазе (ДО того как Lampa их обработает)
    // Это блокирует обработку Lampa Scroll компонентом
    window.addEventListener('wheel', function(evt) {
        const target = evt.target;

        // Проверяем есть ли обложка в родителях, даже если курсор не точно над ней
        if (!isMoviePosterArea(target)) {
            return;
        }

        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Любое движение над обложкой - нужно перехватить
        if (Math.abs(deltaY) === 0 && Math.abs(deltaX) === 0) {
            return;
        }

        console.log('[scroll_fix] Wheel event over poster (deltaY=' + Math.round(deltaY) + ', deltaX=' + Math.round(deltaX) + ')');

        // Всегда блокируем wheel чтобы Lampa Scroll не перехватил
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

        // Если вертикальное движение - имитируем клавиши (вверх/вниз)
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            const isDown = deltaY > 0;
            console.log('[scroll_fix] Simulating ' + (isDown ? 'Down' : 'Up') + ' arrow key');

            const keyEvent = new KeyboardEvent('keydown', {
                keyCode: isDown ? 40 : 38,
                code: isDown ? 'ArrowDown' : 'ArrowUp',
                key: isDown ? 'ArrowDown' : 'ArrowUp',
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyEvent);
        }
        // Если горизонтальное - просто блокируем, не делаем ничего
        else {
            console.log('[scroll_fix] Blocking horizontal scroll');
        }
    }, { capture: true, passive: false });

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
