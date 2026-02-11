/**
 * lampa-scroll-fix plugin v1.0.13
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.13] Initialized');

    function findScrollableParent(el) {
        let current = el;
        while (current && current !== document.body && current !== document.documentElement) {
            const style = window.getComputedStyle(current);
            const hasVerticalScroll = current.scrollHeight > current.clientHeight;
            const canScroll = style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflow === 'auto' || style.overflow === 'scroll';

            if (hasVerticalScroll && canScroll) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    // Блокируем только вертикальный скролл, но даем возможность скролить контент
    window.addEventListener('wheel', function(evt) {
        const deltaY = evt.deltaY;
        const deltaX = evt.deltaX;

        // Только вертикальный скролл (Y > X)
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 0) {
            const scrollable = findScrollableParent(evt.target);

            if (scrollable) {
                // Есть scrollable контейнер - скролим его
                scrollable.scrollTop += deltaY;
                evt.preventDefault();
            } else {
                // Нет scrollable контейнера - блокируем скролл (это будет навигация)
                evt.preventDefault();
            }
        }
    }, { capture: true, passive: false });
})();
