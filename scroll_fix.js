/**
 * lampa-scroll-fix plugin v1.0.5
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

Lampa.Plugins.add({
    name: 'scroll_fix',
    version: '1.0.5',
    description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

    init() {
        console.log('[scroll_fix v1.0.5] Plugin initialized');
        this.setupScrollFix();
    },

    setupScrollFix() {
        // Отслеживаем момент скролла
        let lastWheelTime = 0;
        let isVerticalScroll = false;

        // Слушаем wheel события БЕЗ preventDefault (чтобы не ломать Lampa)
        window.addEventListener('wheel', (evt) => {
            const deltaY = Math.abs(evt.deltaY);
            const deltaX = Math.abs(evt.deltaX);

            // Если это вертикальный скролл - отмечаем это
            if (deltaY > deltaX && deltaY > 0) {
                lastWheelTime = Date.now();
                isVerticalScroll = true;
            } else {
                isVerticalScroll = false;
            }
        }, { capture: true, passive: true });

        // Теперь перехватываем keypad события и блокируем левые/правые после скролла
        if (Lampa && Lampa.Keypad && Lampa.Keypad.listener) {
            const originalSend = Lampa.Keypad.listener.send;

            Lampa.Keypad.listener.send = function(name, data) {
                const timeSinceScroll = Date.now() - lastWheelTime;

                // Если это левая/правая команда в течение 200мс после вертикального скролла - игнорируем
                if ((name === 'left' || name === 'right') && isVerticalScroll && timeSinceScroll < 200) {
                    console.log('[scroll_fix v1.0.5] Ignored', name, 'after vertical scroll');
                    return;
                }

                return originalSend.call(this, name, data);
            };
        }
    },

    onUnload() {
        console.log('[scroll_fix v1.0.5] Plugin unloaded');
    }
});
