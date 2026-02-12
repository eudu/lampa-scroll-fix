/**
 * lampa-scroll-fix plugin v1.0.21
 * Allows vertical mouse wheel scroll on movie posters/cards
 * Blocks horizontal scroll jumps between items
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.21] Initialized');

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

    // Перехватываем wheel события над горизонтальными скроллами
    // и заменяем их на вертикальную прокрутку или навигацию
    const wheelBlocker = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
                if (node.nodeType !== 1) return;

                const horizontalScrolls = [];
                if (node.classList && node.classList.contains('scroll--horizontal')) {
                    horizontalScrolls.push(node);
                }
                if (node.querySelectorAll) {
                    horizontalScrolls.push(...node.querySelectorAll('.scroll--horizontal'));
                }

                horizontalScrolls.forEach(function(scroll) {
                    console.log('[scroll_fix] Found horizontal scroll, patching wheel handler');

                    scroll.addEventListener('wheel', handleScrollWheel, { capture: true, passive: false });
                });
            });
        });
    });

    wheelBlocker.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Обрабатываем wheel на существующих скроллах
    document.querySelectorAll('.scroll--horizontal').forEach(function(scroll) {
        scroll.addEventListener('wheel', handleScrollWheel, { capture: true, passive: false });
    });

    // Главная функция обработки wheel событий
    function handleScrollWheel(evt) {
        // Только над обложками
        if (!isMoviePosterArea(evt.target)) {
            return;
        }

        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Вертикальный скролл над обложкой
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 0) {
            console.log('[scroll_fix] Vertical wheel over poster, skipping Lampa handler');

            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            // Отправляем событие keydown для Lampa (вверх или вниз)
            const keyCode = deltaY > 0 ? 40 : 38; // Down : Up
            const keyEvent = new KeyboardEvent('keydown', {
                keyCode: keyCode,
                code: keyCode === 40 ? 'ArrowDown' : 'ArrowUp',
                key: keyCode === 40 ? 'ArrowDown' : 'ArrowUp',
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyEvent);
        }
        // Горизонтальный скролл просто блокируем
        else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 0) {
            console.log('[scroll_fix] Horizontal wheel over poster, blocking');
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        }
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
