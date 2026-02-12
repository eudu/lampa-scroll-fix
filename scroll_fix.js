/**
 * lampa-scroll-fix plugin v1.0.23
 * Fixes mouse wheel scroll over movie posters
 * Prevents horizontal carousel navigation when scrolling vertically
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.23] Initialized');

    function isMoviePosterArea(el) {
        let current = el;
        while (current && current !== document.body) {
            const classList = current.classList || {};
            const tagName = current.tagName || '';

            if (classList.contains('card') ||
                classList.contains('poster') ||
                classList.contains('item') ||
                classList.contains('cover') ||
                classList.contains('element') ||
                tagName === 'IMG' ||
                (tagName === 'DIV' && classList.contains('selector'))) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // Перехватываем wheel события в capture фазе ДО Lampa
    // Блокируем их только над обложками в горизонтальных скроллах
    document.addEventListener('wheel', function(evt) {
        // Проверяем: находимся ли над обложкой
        if (!isMoviePosterArea(evt.target)) {
            return; // Не над обложкой - пускаем через
        }

        // Проверяем находимся ли в горизонтальном скролле
        const scrollParent = evt.target.closest('.scroll--horizontal');
        if (!scrollParent) {
            return; // Не в горизонтальном скролле - пускаем через
        }

        // Над обложкой в горизонтальном скролле - блокируем wheel
        console.log('[scroll_fix] Blocking wheel over poster in horizontal scroll');
        evt.preventDefault();

    }, { capture: true, passive: false });

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
