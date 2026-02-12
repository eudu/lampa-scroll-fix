/**
 * lampa-scroll-fix plugin v1.0.26
 * Fixes mouse wheel scroll over movie posters
 * Prevents horizontal carousel navigation when scrolling vertically
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.26] Initialized');

    // Отслеживаем создание новых Scroll элементов в Line компонентах
    // Line присваивает onWheel callback в create() методе (line/base.js:36)
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList?.contains('scroll--horizontal')) {
                    // Нашли новый горизонтальный скролл (скорее всего из Line компонента)
                    // Проверяем через setTimeout, чтобы Lampa успел присвоить Scroll объект
                    setTimeout(() => {
                        blockLineScrollWheel(node);
                    }, 0);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function blockLineScrollWheel(scrollElement) {
        // Ищем присвоенный Lampa Scroll объект
        if (!scrollElement.Scroll) {
            return; // Scroll объект ещё не присвоен
        }

        let scrollObj = scrollElement.Scroll;

        // Заменяем onWheel на функцию, которая ничего не делает
        // Это блокирует вызов Line.wheel() при wheel событиях
        scrollObj.onWheel = function(step) {
            // Не делаем ничего - просто блокируем вызов Line.wheel()
            console.log('[scroll_fix] Blocked onWheel, step=', step);
        };

        console.log('[scroll_fix] Installed wheel blocker on horizontal scroll');
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
