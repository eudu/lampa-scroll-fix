/**
 * lampa-scroll-fix plugin v1.0.1
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

Lampa.Plugins.add({
    name: 'scroll_fix',
    version: '1.0.1',
    description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

    init() {
        console.log('[scroll_fix v1.0.1] Plugin initialized');

        // Перехватываем wheel события ДО того, как их обработает Keypad
        this.originalSend = Lampa.Keypad.listener.send;
        this.interceptKeypadSend();

        // Также добавляем прямой слушатель для логирования
        window.addEventListener('wheel', (evt) => {
            console.log('[scroll_fix] Wheel event:', {
                deltaY: evt.deltaY,
                deltaX: evt.deltaX,
                target: evt.target.className
            });
        }, { capture: true });
    },

    /**
     * Перехватываем вызовы Keypad.listener.send чтобы заблокировать левые/правые команды от скролла
     */
    interceptKeypadSend() {
        const self = this;
        let wheelEventTime = 0;

        // Отслеживаем wheel события
        window.addEventListener('wheel', (e) => {
            wheelEventTime = Date.now();
        }, { capture: true, passive: true });

        // Переопределяем send метод
        Lampa.Keypad.listener.send = function(name) {
            const timeSinceWheel = Date.now() - wheelEventTime;

            // Если это левая или правая команда в течение 100мс после wheel события - блокируем её
            if ((name === 'left' || name === 'right') && timeSinceWheel < 100) {
                console.log('[scroll_fix] Blocked horizontal nav:', name);
                return;
            }

            return self.originalSend.apply(this, arguments);
        };
    },

    onUnload() {
        console.log('[scroll_fix] Plugin unloaded');
        // Восстанавливаем оригинальный send метод
        if (this.originalSend) {
            Lampa.Keypad.listener.send = this.originalSend;
        }
    }
});
