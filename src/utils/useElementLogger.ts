import { useEffect } from 'react';

export function useElementLogger() {
  useEffect(() => {
    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      console.log('HOVERED: ', target);
    }

    function handleFocus(e: FocusEvent) {
      const target = e.target as HTMLElement;
      console.log('FOCUSED: ', target);
    }

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as HTMLElement;
      console.log(
        'ACTIVE - MOUSE DOWN: ',
        target,
        target.style,
        target.ELEMENT_NODE
      );
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('focus', handleFocus);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
}

export function logAllChildElements(parent: HTMLElement) {
  // log current parent element
  console.log('Parent Element: ', parent);

  // get all child elements of the current parent
  const children = parent.children;

  // iterate  through each child element;
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;

    // recursively log or perform actions on each child element
    logAllChildElements(child);
  }
}

// example
const parentElement = document.getElementById('your-parent-element-id');

if (parentElement) {
  logAllChildElements(parentElement);
}
