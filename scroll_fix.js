/**
 * lampa-scroll-fix plugin v1.0.29
 * Fixes mouse wheel scroll over movie posters
 * Disables horizontal carousel wheel handling - native browser scrolling only
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.29] Initialized - blocking wheel propagation on cards');

    // Сразу ищем существующие элементы
    setTimeout(() => {
        let existing = document.querySelectorAll('.scroll--horizontal');
        console.log('[scroll_fix] Found existing elements:', existing.length);
        existing.forEach(el => {
            attachWheelBlocker(el);
        });
    }, 100);

    // Отслеживаем создание новых Scroll элементов в Line компонентах
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    // Проверяем сам элемент
                    if (node.classList?.contains('scroll--horizontal')) {
                        setTimeout(() => {
                            attachWheelBlocker(node);
                        }, 0);
                    }

                    // Проверяем потомков
                    let descendants = node.querySelectorAll?.('.scroll--horizontal') || [];
                    if (descendants.length > 0) {
                        descendants.forEach(el => {
                            setTimeout(() => {
                                attachWheelBlocker(el);
                            }, 0);
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function attachWheelBlocker(scrollElement) {
        if (!scrollElement.Scroll) {
            return;
        }

        console.log('[scroll_fix] Attaching wheel blocker to horizontal scroll');

        // Добавляем listener на CAPTURE фазе - он сработает ДО Lampa's handlers
        // stopPropagation() предотвратит дальнейшее распространение события
        scrollElement.addEventListener('wheel', function(e) {
            console.log('[scroll_fix] wheel event on scroll--horizontal, blocking propagation');
            // stopPropagation() предотвращает распространение события на родителей
            // Это значит Main scroll не получит это событие
            e.stopPropagation();
            // preventDefault() говорит браузеру не делать default действие (не скроллить страницу)
            // Но мы ХОТИМ чтобы браузер скроллил, поэтому НЕ вызываем preventDefault()
            console.log('[scroll_fix] propagation blocked');
        }, true); // true = capture phase, срабатывает раньше bubbling

        // Также переопределяем onWheel чтобы оно не обрабатывало события
        scrollElement.Scroll.onWheel = null;

        console.log('[scroll_fix] Wheel blocker attached successfully');
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
