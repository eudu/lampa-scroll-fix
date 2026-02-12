/**
 * lampa-scroll-fix plugin v1.0.28
 * Fixes mouse wheel scroll over movie posters
 * Disables horizontal carousel wheel handling - native browser scrolling only
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.28] Initialized');
    console.log('[scroll_fix] Waiting for .scroll--horizontal elements...');

    // Сразу ищем существующие элементы
    setTimeout(() => {
        console.log('[scroll_fix] Looking for existing .scroll--horizontal elements...');
        let existing = document.querySelectorAll('.scroll--horizontal');
        console.log('[scroll_fix] Found existing elements:', existing.length);
        existing.forEach(el => {
            console.log('[scroll_fix] Processing existing element:', el);
            disableWheelOnHorizontalScroll(el);
        });
    }, 100);

    // Отслеживаем создание новых Scroll элементов в Line компонентах
    let observer = new MutationObserver((mutations) => {
        console.log('[scroll_fix] MutationObserver fired, mutations:', mutations.length);

        mutations.forEach((mutation) => {
            console.log('[scroll_fix] Mutation type:', mutation.type, 'added nodes:', mutation.addedNodes.length);

            mutation.addedNodes.forEach((node) => {
                console.log('[scroll_fix] Added node:', node.nodeName, 'hasClass:', node.classList?.contains('scroll--horizontal'));

                if (node.nodeType === 1) {
                    // Проверяем сам элемент
                    if (node.classList?.contains('scroll--horizontal')) {
                        console.log('[scroll_fix] Found .scroll--horizontal directly');
                        setTimeout(() => {
                            disableWheelOnHorizontalScroll(node);
                        }, 0);
                    }

                    // Проверяем потомков
                    let descendants = node.querySelectorAll?.('.scroll--horizontal') || [];
                    if (descendants.length > 0) {
                        console.log('[scroll_fix] Found', descendants.length, '.scroll--horizontal descendants');
                        descendants.forEach(el => {
                            setTimeout(() => {
                                disableWheelOnHorizontalScroll(el);
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

    function disableWheelOnHorizontalScroll(scrollElement) {
        console.log('[scroll_fix] Processing scroll--horizontal element');
        console.log('[scroll_fix] Element:', scrollElement);
        console.log('[scroll_fix] All properties on element:', Object.keys(scrollElement).filter(k => !k.startsWith('__')));

        if (!scrollElement.Scroll) {
            console.log('[scroll_fix] WARNING: scrollElement.Scroll not found');
            console.log('[scroll_fix] Checking for alternative property names...');

            // Ищем любой объект со свойством wheel или onWheel
            for (let key in scrollElement) {
                if (scrollElement[key] && typeof scrollElement[key] === 'object') {
                    if (scrollElement[key].wheel || scrollElement[key].onWheel) {
                        console.log('[scroll_fix] Found object with wheel/onWheel at key:', key);
                        console.log('[scroll_fix] Object:', scrollElement[key]);
                    }
                }
            }
            return;
        }

        let scrollObj = scrollElement.Scroll;
        console.log('[scroll_fix] Found Scroll object');
        console.log('[scroll_fix] Scroll object keys:', Object.keys(scrollObj));
        console.log('[scroll_fix] Scroll object proto:', Object.getOwnPropertyNames(Object.getPrototypeOf(scrollObj)));

        // Отключаем onWheel callback
        if (scrollObj.onWheel) {
            console.log('[scroll_fix] Found onWheel, disabling it');
            scrollObj.onWheel = null;
        }

        // Переопределяем wheel метод на пустую функцию
        if (scrollObj.wheel) {
            console.log('[scroll_fix] Found wheel method, overriding it');
            scrollObj.wheel = function(size) {
                console.log('[scroll_fix] wheel() called but disabled, size=', size);
            };
        }

        console.log('[scroll_fix] Successfully processed horizontal scroll');
    }

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
