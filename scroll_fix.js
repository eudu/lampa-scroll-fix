/**
 * lampa-scroll-fix plugin v1.0.22
 * Fixes mouse wheel scroll over movie posters
 * Prevents horizontal carousel navigation when scrolling vertically
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.22] Initialized');

    function isMoviePosterArea(el) {
        let current = el;
        while (current && current !== document.body) {
            const classList = current.classList || {};
            const tagName = current.tagName || '';

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

    // Перехватываем создание Scroll элементов и модифицируем их wheel обработчики
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
                if (node.nodeType !== 1) return;

                // Ищем горизонтальные скроллы
                const scrolls = [];
                if (node.classList && node.classList.contains('scroll--horizontal')) {
                    scrolls.push(node);
                }
                if (node.querySelectorAll) {
                    scrolls.push(...node.querySelectorAll('.scroll--horizontal'));
                }

                scrolls.forEach(disableWheelOnPosters);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Обработка существующих скроллов
    document.querySelectorAll('.scroll--horizontal').forEach(disableWheelOnPosters);

    function disableWheelOnPosters(scrollElement) {
        console.log('[scroll_fix] Patching horizontal scroll wheel handler');

        // Оборачиваем mousewheel и wheel события с нашей логикой
        const wheelHandler = function(evt) {
            // Если это вертикальный скролл над обложкой - игнорируем событие
            if (isMoviePosterArea(evt.target)) {
                console.log('[scroll_fix] Blocking wheel over poster in horizontal scroll');
                evt.preventDefault();
                evt.stopImmediatePropagation();
                return;
            }
            // В других местах - пускаем через (Lampa обработает)
        };

        // Добавляем на capture фазе ДО того как Lampa слушает (тогда stopImmediatePropagation сработает)
        scrollElement.addEventListener('wheel', wheelHandler, { capture: true, passive: false });
        scrollElement.addEventListener('mousewheel', wheelHandler, { capture: true, passive: false });
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
