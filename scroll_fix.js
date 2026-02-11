/**
 * lampa-scroll-fix plugin v1.0.4
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

Lampa.Plugins.add({
    name: 'scroll_fix',
    version: '1.0.4',
    description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

    init() {
        console.log('[scroll_fix v1.0.4] Plugin initialized');
        this.setupScrollFix();
    },

    setupScrollFix() {
        // Простой и надежный подход: блокируем вертикальный скролл на уровне браузера
        window.addEventListener('wheel', (evt) => {
            const deltaY = Math.abs(evt.deltaY);
            const deltaX = Math.abs(evt.deltaX);

            // Если это вертикальный скролл (Y больше X) - блокируем его
            if (deltaY > deltaX && deltaY > 0) {
                console.log('[scroll_fix v1.0.4] Blocking vertical scroll');
                evt.preventDefault();
            }
        }, { capture: true, passive: false });
    },

    onUnload() {
        console.log('[scroll_fix v1.0.4] Plugin unloaded');
    }
});
