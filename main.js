document.addEventListener('DOMContentLoaded', () => {
  const w = 500;
  const h = 400;

  const canvas = document.getElementById('mainCanvas');

  canvas.setAttribute('width', w + 'px');
  canvas.setAttribute('height', h + 'px');

  const ctx = canvas.getContext('2d');

  const tree = new QuadTree({
    x: 0,
    y: 0,
    width: w,
    height: h,
  }, 5, 2);

  function randomRanged(min, max) {
    return Math.random() * (max - min) + min;
  }

  const minSize = 20;
  const maxSize = 50;

  ctx.globalAlpha = 0.25;

  for (let i = 0; i < 20; ++i) {
    const box = {
      x: randomRanged(0, w - maxSize),
      y: randomRanged(0, h - maxSize),
      width: randomRanged(minSize, maxSize),
      height: randomRanged(minSize, maxSize),
    };

    tree.add(box);

    ctx.fillRect(box.x, box.y, box.width, box.height);
  }

  function drawTree(tree) {
    if (tree._divided) {
      drawTree(tree._topLeft);
      drawTree(tree._topRight);
      drawTree(tree._bottomLeft);
      drawTree(tree._bottomRight);
    } else {
      const bounds = tree._bounds;

      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  ctx.globalAlpha = 1;
  ctx.lineWidth = 1;

  drawTree(tree);
}, false);
