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
        console.log('[scroll_fix] Found scroll--horizontal element, checking for Scroll object...');

        if (!scrollElement.Scroll) {
            console.log('[scroll_fix] WARNING: scrollElement.Scroll not found, trying alternative methods...');
            console.log('[scroll_fix] Element properties:', Object.keys(scrollElement).slice(0, 20));
            return; // Scroll объект ещё не присвоен
        }

        let scrollObj = scrollElement.Scroll;
        console.log('[scroll_fix] Found Scroll object, methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(scrollObj)).slice(0, 10));

        // Полностью отключаем wheel обработку на горизонтальном scrolle
        // Устанавливаем onWheel в null/undefined
        // Это заставит Scroll.wheel() вызвать вместо onWheel сам scroll.wheel(size)
        // Но мы переопределим и сам wheel метод, чтобы он ничего не делал

        // Отключаем onWheel callback
        scrollObj.onWheel = null;

        // Переопределяем wheel метод на пустую функцию
        scrollObj.wheel = function(size) {
            // Не делаем ничего - полностью отключаем wheel обработку
            console.log('[scroll_fix] wheel() called but disabled, size=', size);
        };

        console.log('[scroll_fix] Successfully disabled wheel on horizontal scroll');
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
