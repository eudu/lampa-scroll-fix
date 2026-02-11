/**
 * lampa-scroll-fix plugin v1.0.8
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

(function() {
    'use strict';

    function init() {
        console.log('[scroll_fix v1.0.8] Initialized');

        let lastWheelTime = 0;
        let isVerticalScroll = false;

        // Слушаем wheel события без preventDefault
        window.addEventListener('wheel', function(evt) {
            const deltaY = Math.abs(evt.deltaY);
            const deltaX = Math.abs(evt.deltaX);

            if (deltaY > deltaX && deltaY > 0) {
                lastWheelTime = Date.now();
                isVerticalScroll = true;
            } else {
                isVerticalScroll = false;
            }
        }, true);

        // Блокируем левые/правые команды после скролла
        if (Lampa && Lampa.Keypad && Lampa.Keypad.listener) {
            const originalSend = Lampa.Keypad.listener.send;

            Lampa.Keypad.listener.send = function(name, data) {
                const timeSinceScroll = Date.now() - lastWheelTime;

                if ((name === 'left' || name === 'right') && isVerticalScroll && timeSinceScroll < 200) {
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
