function setCursorPosition(target: HTMLElement, start: number, end: number | null = null) {
  const range = document.createRange();
  range.selectNodeContents(target);

  const textNodes: Text[] = [];
  (function findTextNodes(node: ChildNode) {
    if (node.nodeType === 3) {
      textNodes.push(node as Text);
    } else {
      for (let i = 0, len = node.childNodes.length; i < len; ++i) {
        const childNode = node.childNodes[i];
        if (childNode) {
          findTextNodes(childNode);
        }
      }
    }
  })(target);

  let charCount = 0;
  let startNode: Text | null = null;
  let endNode: Text | null = null;
  const n = textNodes.length;
  for (let i = 0; i < n; ++i) {
    const textNode = textNodes[i];
    if (textNode) {
      const nextCharCount = charCount + textNode.length;

      if (!startNode && start >= charCount && (start <= nextCharCount || (start === nextCharCount && i < n - 1))) {
        startNode = textNode;
        range.setStart(textNode, start - charCount);
        if (!end) {
          break;
        }
      }
      if (end && !endNode && end >= charCount && (end <= nextCharCount || (end === nextCharCount && i < n - 1))) {
        endNode = textNode;
        range.setEnd(textNode, end - charCount);
      }
      charCount = nextCharCount;
    }
  }

  if (!end) {
    range.collapse(true);
  }

  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function moveCursorToEnd(target: HTMLElement) {
  const range = document.createRange();
  const selection = window.getSelection();
  if (selection) {
    range.setStart(target, target.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function getCurrentCursorPosition(target: HTMLElement) {
  const sel = window.getSelection();

  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(target);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    return {
      start,
      end: start + range.toString().length,
    };
  }
  return {start: -1, end: -1};
}

export {getCurrentCursorPosition, moveCursorToEnd, setCursorPosition};
