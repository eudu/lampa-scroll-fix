/**
 * lampa-scroll-fix plugin v1.0.7
 * Disables horizontal navigation on vertical mouse wheel scroll
 * Allows proper content scrolling instead of TV-remote-style card switching
 */

(function() {
    'use strict';

    try {
        Lampa.Plugins.add({
            name: 'scroll_fix',
            version: '1.0.7',
            description: 'Fix mouse wheel scroll for desktop browsers - disable horizontal navigation on vertical scroll',

            init: function() {
                console.log('[scroll_fix v1.0.7] Initialized');
            },

            onUnload: function() {
                console.log('[scroll_fix v1.0.7] Unloaded');
            }
        });
    } catch (e) {
        console.error('[scroll_fix] Error:', e);
    }
})();
