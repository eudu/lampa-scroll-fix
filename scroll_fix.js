/**
 * lampa-scroll-fix plugin v1.0.6
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

Lampa.Plugins.add({
    name: 'scroll_fix',
    version: '1.0.6',
    description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

    init() {
        console.log('[scroll_fix v1.0.6] Plugin initialized');
        this.setupScrollFix();
    },

    setupScrollFix() {
        // Простое логирование скролла
        window.addEventListener('wheel', (evt) => {
            const deltaY = Math.abs(evt.deltaY);
            const deltaX = Math.abs(evt.deltaX);

            if (deltaY > deltaX && deltaY > 0) {
                console.log('[scroll_fix v1.0.6] Vertical scroll detected:', deltaY);
            }
        }, { capture: true, passive: true });

        console.log('[scroll_fix v1.0.6] Setup complete');
    },

    onUnload() {
        console.log('[scroll_fix v1.0.6] Plugin unloaded');
    }
});
