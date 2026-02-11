/**
 * lampa-scroll-fix plugin
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

Lampa.Plugins.add({
    name: 'scroll_fix',
    version: '1.0.0',
    description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

    init() {
        this.handleWheelEvent = this.handleWheelEvent.bind(this);
        this.setupWheelListener();
    },

    /**
     * Setup direct wheel event listener to block horizontal navigation on vertical scroll
     */
    setupWheelListener() {
        window.addEventListener(
            'wheel',
            this.handleWheelEvent,
            { capture: true, passive: false }
        );
    },

    /**
     * Handle wheel events - prevent horizontal nav on vertical scroll, allow content scrolling
     */
    handleWheelEvent(e) {
        const target = e.target;
        const scrollable = this.findScrollableParent(target);

        // If there's scrollable content, scroll it
        if (scrollable && scrollable !== document.documentElement && scrollable !== document.body) {
            e.preventDefault();
            const step = e.deltaY > 0 ? 50 : -50;
            scrollable.scrollTop += step;
            return;
        }

        // Otherwise, block vertical wheel from triggering left/right navigation
        // Only allow wheel events that would naturally trigger horizontal navigation
        // (i.e., horizontal scrolling wheels or trackpad gestures)
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // This is vertical scrolling, prevent it from becoming navigation
            e.preventDefault();
        }
    },

    /**
     * Find the nearest scrollable parent element
     */
    findScrollableParent(el) {
        let current = el;

        while (current && current !== document.body && current !== document.documentElement) {
            const style = window.getComputedStyle(current);
            const overflowY = style.overflowY;
            const hasScroll = current.scrollHeight > current.clientHeight;

            // Check if element has overflow auto/scroll and actual scrollable content
            if ((overflowY === 'auto' || overflowY === 'scroll') && hasScroll) {
                return current;
            }

            current = current.parentElement;
        }

        return null;
    },

    onUnload() {
        window.removeEventListener('wheel', this.handleWheelEvent, { capture: true });
    }
});
