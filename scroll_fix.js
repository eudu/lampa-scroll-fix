/**
 * lampa-scroll-fix plugin v1.0.30
 * Fixes mouse wheel scroll over movie posters
 * Disables horizontal carousel wheel handling - native browser scrolling only
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.30] Initialized - redirecting wheel to main scroll');

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

        // Добавляем listener на CAPTURE фазе
        scrollElement.addEventListener('wheel', function(e) {
            console.log('[scroll_fix] wheel event on scroll--horizontal, redirecting to main scroll');

            // Блокируем горизонтальный скролл
            e.stopImmediatePropagation();
            e.preventDefault();

            // Ищем главный scroll элемент (выше по иерархии)
            let mainScroll = findMainScroll(scrollElement);

            if (mainScroll) {
                console.log('[scroll_fix] found main scroll, dispatching wheel event');
                // Создаём новое wheel событие с теми же параметрами
                let wheelEvent = new WheelEvent('wheel', {
                    deltaY: e.deltaY,
                    deltaX: e.deltaX,
                    deltaZ: e.deltaZ,
                    deltaMode: e.deltaMode,
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                // Отправляем событие на main scroll
                mainScroll.dispatchEvent(wheelEvent);
            }
        }, true); // true = capture phase

        // Отключаем onWheel callback
        scrollElement.Scroll.onWheel = null;

        console.log('[scroll_fix] Wheel blocker attached successfully');
    }

    function findMainScroll(element) {
        // Ищем элемент с классом scroll который НЕ horizontal
        let current = element.parentElement;
        while (current) {
            if (current.classList?.contains('scroll') && !current.classList?.contains('scroll--horizontal')) {
                console.log('[scroll_fix] found main scroll element');
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
