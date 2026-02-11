/**
 * lampa-scroll-fix plugin v1.0.3
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

Lampa.Plugins.add({
    name: 'scroll_fix',
    version: '1.0.3',
    description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

    init() {
        console.log('[scroll_fix v1.0.3] Plugin initialized');

        // Добавляем слушатель для логирования wheel событий
        window.addEventListener('wheel', (evt) => {
            console.log('[scroll_fix] Wheel event:', {
                deltaY: evt.deltaY,
                deltaX: evt.deltaX,
                target: evt.target.className
            });
        }, { capture: true });

        // Попытаемся перехватить keypad события
        this.interceptKeypadEvents();
    },

    /**
     * Перехватываем keypad события
     */
    interceptKeypadEvents() {
        try {
            console.log('[scroll_fix] Attempting to intercept Keypad.listener.send');

            let wheelEventTime = 0;

            // Отслеживаем wheel события
            window.addEventListener('wheel', () => {
                wheelEventTime = Date.now();
            }, { capture: true, passive: true });

            // Сохраняем оригинальный send
            const originalSend = Lampa.Keypad.listener.send;
            console.log('[scroll_fix] Original send type:', typeof originalSend);

            // Переопределяем send метод
            Lampa.Keypad.listener.send = function(name, data) {
                const timeSinceWheel = Date.now() - wheelEventTime;

                // Если это левая или правая команда в течение 100мс после wheel события - блокируем её
                if ((name === 'left' || name === 'right') && timeSinceWheel < 100) {
                    console.log('[scroll_fix] Blocked horizontal nav:', name);
                    return;
                }

                return originalSend.call(this, name, data);
            };

            console.log('[scroll_fix] Keypad.listener.send overridden successfully');
        } catch (e) {
            console.error('[scroll_fix] Error during interception:', e);
        }
    },

    onUnload() {
        console.log('[scroll_fix] Plugin unloaded');
        // Восстанавливаем оригинальный send метод
        if (this.originalSend) {
            Lampa.Keypad.listener.send = this.originalSend;
        }
    }
});
