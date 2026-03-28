<style lang="scss">
.nds--table-container {
  --nds-table-shadow-color: rgba(0, 0, 0, 0.15);

  &::before,
  &::after {
    content: "";
    z-index: calc(calc(2 + 1) + 1);
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30px;
    transition: box-shadow 0.3s;
    pointer-events: none;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  &.ping-right::after {
    box-shadow: inset -10px 0 8px -8px var(--nds-table-shadow-color);
  }

  &.ping-left::before {
    box-shadow: inset 10px 0 8px -8px var(--nds-table-shadow-color);
  }

  th.sticky,
  td.sticky {
    --shadow-width: 30px;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: -1px;
      width: var(--shadow-width);
      background-color: transparent !important;
      transform: translateX(100%);
      transition: box-shadow 0.3s;
      pointer-events: none;
    }

    &.left-sticky {
      &::after {
        right: 0;
      }

      &.cell-scroll::after {
        box-shadow: inset 10px 0 8px -8px var(--nds-table-shadow-color);
      }
    }

    &.right-sticky {
      &::after {
        right: calc(100% + var(--shadow-width));
      }

      &.cell-scroll::after {
        box-shadow: inset -10px 0px 8px -8px var(--nds-table-shadow-color);
      }
    }
  }
}
</style>

<template>
  <div class="nds--table-container relative overflow-hidden">
    <slot v-bind="{ handleScroll }" />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";

const SCROLL_CONFIG = {
  SCROLL_THRESHOLD: 1, // Threshold for detecting scroll position
  SCROLL_DEBOUNCE_MS: 16, // ~60fps throttling
  SELECTORS: {
    TABLE: ".nds--table-container",
    LEFT_STICKY: "td.sticky.left-sticky, th.sticky.left-sticky",
    RIGHT_STICKY: "td.sticky.right-sticky, th.sticky.right-sticky",
    ALL_STICKY: "td.sticky, th.sticky",
  },
  CLASSES: {
    PING_LEFT: "ping-left",
    PING_RIGHT: "ping-right",
    CELL_SCROLL: "cell-scroll",
  },
} as const;

// Cache DOM elements to avoid repeated queries
let cachedTableElement: HTMLElement | null = null;
let scrollTimeoutId: NodeJS.Timeout | null = null;

onUnmounted(() => {
  cleanupScrollHandler();
});

function handleScroll(e: Event) {
  const target = e.target as HTMLDivElement;

  // Early validation and type checking
  if (!target || !(target instanceof HTMLElement)) {
    return;
  }

  // Throttle scroll events for better performance
  if (scrollTimeoutId) {
    clearTimeout(scrollTimeoutId);
  }

  scrollTimeoutId = setTimeout(() => {
    performScrollLogic(target);
  }, SCROLL_CONFIG.SCROLL_DEBOUNCE_MS);
}

function performScrollLogic(scrollContainer: HTMLElement) {
  try {
    // Cache table element to avoid repeated DOM queries
    if (!cachedTableElement) {
      cachedTableElement = document.querySelector(
        SCROLL_CONFIG.SELECTORS.TABLE,
      ) as HTMLElement | null;
    }

    if (!cachedTableElement) {
      return;
    }

    const { scrollWidth, scrollLeft, clientWidth } = scrollContainer;
    const scrollThreshold = SCROLL_CONFIG.SCROLL_THRESHOLD;

    // Calculate scroll positions with better precision
    const isAtLeftEdge = scrollLeft > scrollThreshold;
    const isAtRightEdge =
      Math.abs(scrollWidth - clientWidth - scrollLeft) <= scrollThreshold;

    // Handle table-level ping classes
    updateTablePingClasses(cachedTableElement, isAtLeftEdge, isAtRightEdge);

    // Handle sticky cell styling
    updateStickyCellStyles(scrollContainer, isAtLeftEdge, isAtRightEdge);
  } catch (error) {
    console.warn("Error in handleScroll:", error);
  }
}

function updateTablePingClasses(
  tableElement: HTMLElement,
  isAtLeftEdge: boolean,
  isAtRightEdge: boolean,
) {
  // Only update if there are no sticky elements in the container
  const container = tableElement.closest(
    ".relative.overflow-hidden",
  ) as HTMLElement;
  if (!container) return;

  const hasLeftSticky = container.querySelector(
    SCROLL_CONFIG.SELECTORS.LEFT_STICKY,
  );
  const hasRightSticky = container.querySelector(
    SCROLL_CONFIG.SELECTORS.RIGHT_STICKY,
  );

  if (!hasLeftSticky) {
    tableElement.classList.toggle(
      SCROLL_CONFIG.CLASSES.PING_LEFT,
      isAtLeftEdge,
    );
  }

  if (!hasRightSticky) {
    tableElement.classList.toggle(
      SCROLL_CONFIG.CLASSES.PING_RIGHT,
      !isAtRightEdge,
    );
  }
}

function updateStickyCellStyles(
  scrollContainer: HTMLElement,
  isAtLeftEdge: boolean,
  isAtRightEdge: boolean,
) {
  const hasStickyElements =
    scrollContainer.querySelectorAll<HTMLElement>(
      SCROLL_CONFIG.SELECTORS.ALL_STICKY,
    ).length > 0;

  if (!hasStickyElements) return;

  const leftStickyElements = scrollContainer.querySelectorAll<HTMLElement>(
    SCROLL_CONFIG.SELECTORS.LEFT_STICKY,
  );
  const rightStickyElements = scrollContainer.querySelectorAll<HTMLElement>(
    SCROLL_CONFIG.SELECTORS.RIGHT_STICKY,
  );

  // Process left sticky elements
  leftStickyElements.forEach((element) => {
    const backgroundColor = getElementBackgroundColor(element);
    element.classList.toggle(backgroundColor, isAtLeftEdge);
    element.classList.toggle(SCROLL_CONFIG.CLASSES.CELL_SCROLL, isAtLeftEdge);
  });

  // Process right sticky elements
  rightStickyElements.forEach((element) => {
    const backgroundColor = getElementBackgroundColor(element);
    element.classList.toggle(backgroundColor, !isAtRightEdge);
    element.classList.toggle(SCROLL_CONFIG.CLASSES.CELL_SCROLL, !isAtRightEdge);
  });
}

/**
 * Determines the appropriate background color for sticky elements
 * @param element - The DOM element to check
 * @param headerColor - Default color for header elements
 * @returns CSS class name for the background color
 */
function getElementBackgroundColor(
  element: HTMLElement,
  headerColor = "#F1F5F9",
): string {
  const DEFAULT_CELL_COLOR = "#ffffff";
  const isHeaderElement = element.tagName.toLowerCase() === "th";

  return isHeaderElement ? headerColor : DEFAULT_CELL_COLOR;
}

// Cleanup function for component unmount
function cleanupScrollHandler() {
  if (scrollTimeoutId) {
    clearTimeout(scrollTimeoutId);
    scrollTimeoutId = null;
  }
  cachedTableElement = null;
}
</script>
