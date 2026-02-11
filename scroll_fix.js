/**
 * lampa-scroll-fix plugin v1.0.10
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.10] Script loading');

    function init() {
        console.log('[scroll_fix v1.0.10] Initialized');

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

            Lampa.Keypad.listener.send = function(name, data) {
                const timeSinceScroll = Date.now() - lastWheelTime;

                console.log('[scroll_fix] Keypad event:', name, 'after scroll:', timeSinceScroll + 'ms');

                if ((name === 'left' || name === 'right') && isVerticalScroll && timeSinceScroll < 200) {
                    console.log('[scroll_fix] BLOCKED:', name);
                    return;
                }

                return originalSend.call(this, name, data);
            };
        }
    }

    // Пытаемся инициализировать сразу
    if (window.Lampa && window.Lampa.Keypad) {
        init();
    } else {
        // Ждем загрузки Lampa
        setTimeout(function checkLampa() {
            if (window.Lampa && window.Lampa.Keypad) {
                init();
            } else {
                setTimeout(checkLampa, 100);
            }
        }, 100);
    }
})();
