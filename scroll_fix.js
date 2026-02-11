/**
 * lampa-scroll-fix plugin v1.0.12
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.12] Blocking vertical scroll');

    // Блокируем вертикальный скролл на самом низком уровне
    // Это предотвращает преобразование скролла в навигацию
    window.addEventListener('wheel', function(evt) {
        const deltaY = Math.abs(evt.deltaY);
        const deltaX = Math.abs(evt.deltaX);

        // Если это вертикальный скролл (Y > X) - блокируем его
        if (deltaY > deltaX && deltaY > 0) {
            console.log('[scroll_fix] Blocking vertical scroll:', deltaY);
            evt.preventDefault();
        }
    }, { capture: true, passive: false });

    console.log('[scroll_fix v1.0.12] Initialized');
})();
