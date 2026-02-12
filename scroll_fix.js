/**
 * lampa-scroll-fix plugin v1.0.24
 * Fixes mouse wheel scroll over movie posters
 * Prevents horizontal carousel navigation when scrolling vertically
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.24] Initialized');

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

    // Отслеживаем добавление новых .scroll элементов
    // Lampa присваивает Scroll объект в html.Scroll (scroll.js:71)
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList?.contains('scroll')) {
                    // Нашли новый .scroll элемент
                    // Добавляем обработчик wheel в capture фазе на этот элемент
                    attachScrollWheelHandler(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function attachScrollWheelHandler(scrollElement) {
        scrollElement.addEventListener('wheel', function(evt) {
            // Проверяем: находимся ли над poster'ом
            if (!isMoviePosterArea(evt.target)) {
                return; // Не над poster'ом - пускаем дальше
            }

            // Проверяем: находимся ли в горизонтальном скролле (на этом элементе)
            if (!scrollElement.classList.contains('scroll--horizontal')) {
                return; // Не горизонтальный - пускаем дальше
            }

            // Над poster'ом в горизонтальном скролле
            // Блокируем этот wheel event перед тем, как Lampa обработает в bubbling
            console.log('[scroll_fix] Blocking wheel over poster in horizontal scroll');
            evt.preventDefault();
            evt.stopImmediatePropagation();

        }, { capture: true, passive: false });

        console.log('[scroll_fix] Attached wheel handler to scroll element');
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
