/**
 * lampa-scroll-fix plugin v1.0.25
 * Fixes mouse wheel scroll over movie posters
 * Prevents horizontal carousel navigation when scrolling vertically
 */

(function() {
    'use strict';

    console.log('[scroll_fix v1.0.25] Initialized');

    // Слушаем wheel события на document в capture фазе
    // Блокируем wheel когда Lampa пытается активировать горизонтальный скролл
    document.addEventListener('wheel', function(evt) {
        // Ищем ближайший .scroll элемент
        let scrollElement = evt.target.closest('.scroll');

        if (!scrollElement) {
            return; // Не внутри скролла - пускаем дальше
        }

        // Проверяем: это горизонтальный скролл?
        if (!scrollElement.classList.contains('scroll--horizontal')) {
            return; // Вертикальный скролл - пускаем дальше
        }

        // Мы внутри .scroll--horizontal
        // Применяем логику Lampa's onTheRightSide для горизонтального скролла
        // Горизонтальный скролл активируется когда cursor > width / 2

        let scrollContent = scrollElement.querySelector('.scroll__content');
        if (!scrollContent) {
            return;
        }

        let contentOffset = scrollContent.getBoundingClientRect().left;
        let contentWidth = window.innerWidth - contentOffset;
        let cursorPosition = evt.clientX - contentOffset;

        // Для горизонтального скролла: onTheRightSide возвращает true если position > width/2
        let wouldActivateHorizontal = cursorPosition > contentWidth / 2;

        if (wouldActivateHorizontal) {
            // Курсор на правой половине - Lampa пытается обработать как горизонтальную навигацию
            console.log('[scroll_fix] Blocking wheel - would activate horizontal scroll');
            evt.preventDefault();
        }

    }, { capture: true, passive: false });

    // Register plugin with Lampa to pass validation
    Lampa.Reguest = Lampa.Reguest || function() {};
})();
