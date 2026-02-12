/**
 * lampa-scroll-fix plugin v1.0.27
 * Fixes mouse wheel scroll over movie posters
 * Disables horizontal carousel wheel handling - native browser scrolling only
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.27] Initialized');

    // Отслеживаем создание новых Scroll элементов в Line компонентах
    // Line присваивает onWheel callback в create() методе (line/base.js:36)
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList?.contains('scroll--horizontal')) {
                    // Нашли новый горизонтальный скролл (скорее всего из Line компонента)
                    // Проверяем через setTimeout, чтобы Lampa успел присвоить Scroll объект
                    setTimeout(() => {
                        disableWheelOnHorizontalScroll(node);
                    }, 0);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function disableWheelOnHorizontalScroll(scrollElement) {
        // Ищем присвоенный Lampa Scroll объект
        if (!scrollElement.Scroll) {
            return; // Scroll объект ещё не присвоен
        }

        let scrollObj = scrollElement.Scroll;

        // Полностью отключаем wheel обработку на горизонтальном scrolle
        // Устанавливаем onWheel в null/undefined
        // Это заставит Scroll.wheel() вызвать вместо onWheel сам scroll.wheel(size)
        // Но мы переопределим и сам wheel метод, чтобы он ничего не делал

        // Отключаем onWheel callback
        scrollObj.onWheel = null;

        // Переопределяем wheel метод на пустую функцию
        scrollObj.wheel = function(size) {
            // Не делаем ничего - полностью отключаем wheel обработку
            console.log('[scroll_fix] Wheel disabled on horizontal scroll, size=', size);
        };

        console.log('[scroll_fix] Disabled wheel on horizontal scroll');
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
