/**
 * lampa-scroll-fix plugin v1.0.20
 * Allows vertical mouse wheel scroll on movie posters/cards
 * Blocks horizontal scroll jumps between items
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.20] Initialized');

    function isMoviePosterArea(el) {
        // Проверяем, находимся ли мы над обложкой фильма или его контейнером
        let current = el;
        while (current && current !== document.body) {
            const classList = current.classList || {};
            const tagName = current.tagName || '';

            // Ищем карточку/постер/элемент в сетке
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

    // Используем MutationObserver чтобы отследить создание горизонтальных скроллов
    // и переопределить их обработку wheel событий
    const wheelBlocker = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Ищем новые элементы
            Array.from(mutation.addedNodes).forEach(function(node) {
                if (node.nodeType !== 1) return;

                // Проверяем является ли элемент или содержит горизонтальный скролл
                const horizontalScrolls = [];
                if (node.classList && node.classList.contains('scroll--horizontal')) {
                    horizontalScrolls.push(node);
                }
                if (node.querySelectorAll) {
                    horizontalScrolls.push(...node.querySelectorAll('.scroll--horizontal'));
                }

                // Для каждого горизонтального скролла переопределяем обработку wheel
                horizontalScrolls.forEach(function(scroll) {
                    console.log('[scroll_fix] Found horizontal scroll, blocking wheel over posters');

                    // Добавляем свой listener на capture фазе ДО того как Lampa её слушает
                    scroll.addEventListener('wheel', function(evt) {
                        // Только над обложками блокируем
                        if (!isMoviePosterArea(evt.target)) {
                            return;
                        }

                        console.log('[scroll_fix] Blocking wheel over poster in horizontal scroll');
                        evt.preventDefault();
                        evt.stopImmediatePropagation();
                    }, { capture: true, passive: false });
                });
            });
        });
    });

    wheelBlocker.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Блокируем wheel события на существующих скроллах
    document.querySelectorAll('.scroll--horizontal').forEach(function(scroll) {
        scroll.addEventListener('wheel', function(evt) {
            if (!isMoviePosterArea(evt.target)) {
                return;
            }
            console.log('[scroll_fix] Blocking wheel over poster in existing horizontal scroll');
            evt.preventDefault();
            evt.stopImmediatePropagation();
        }, { capture: true, passive: false });
    });

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
