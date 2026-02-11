/**
 * lampa-scroll-fix plugin v1.0.11
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

(function() {
    'use strict';

    function init() {
        console.log('[scroll_fix v1.0.11] Initialized');

        let lastWheelTime = 0;
        let isVerticalScroll = false;

        // Слушаем wheel события
        window.addEventListener('wheel', function(evt) {
            const deltaY = Math.abs(evt.deltaY);
            const deltaX = Math.abs(evt.deltaX);

            if (deltaY > deltaX && deltaY > 0) {
                console.log('[scroll_fix] Vertical scroll:', deltaY);
                lastWheelTime = Date.now();
                isVerticalScroll = true;
            } else {
                isVerticalScroll = false;
            }
        }, true);

        // Логируем ВСЕ keypad события чтобы понять какие приходят при скролле
        if (Lampa && Lampa.Keypad && Lampa.Keypad.listener) {
            const originalSend = Lampa.Keypad.listener.send;
            let eventCount = 0;

            Lampa.Keypad.listener.send = function(name, data) {
                const timeSinceScroll = Date.now() - lastWheelTime;
                eventCount++;

                // Логируем только каждое 10-е событие, чтобы не спамить консоль
                if (eventCount % 10 === 0) {
                    console.log('[scroll_fix] Keypad event:', name, 'after scroll:', timeSinceScroll + 'ms', 'isVertical:', isVerticalScroll);
                }

                if ((name === 'left' || name === 'right') && isVerticalScroll && timeSinceScroll < 200) {
                    console.log('[scroll_fix] BLOCKED:', name, 'after scroll:', timeSinceScroll + 'ms');
                    return;
                }

                return originalSend.call(this, name, data);
            };
        }
    }

    // Инициализируем когда приложение готово
    if (window.Lampa && window.Lampa.Listener) {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                init();
            }
        });
    } else {
        // Если уже загружено
        document.addEventListener('DOMContentLoaded', init);
    }
})();
