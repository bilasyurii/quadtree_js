class QuadTree {
  // bounds should contain x, y, width, height fields
  constructor(bounds, maxDepth = 4, capacity = 4) {
    /**
     * @type {QuadTree}
     */
    this._topLeft = null;
    /**
     * @type {QuadTree}
     */
    this._topRight = null;
    /**
     * @type {QuadTree}
     */
    this._bottomLeft = null;
    /**
     * @type {QuadTree}
     */
    this._bottomRight = null;

    this._divided = false;
    this._maxDepth = maxDepth;

    if (maxDepth == 1) {
      this._capacity = 0;
    } else {
      this._capacity = capacity;
    }

    this._bounds = bounds;
    this._children = [];
  }

  static aabb(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  get(area, found) {
    const bounds = this._bounds;

    if (!QuadTree.aabb(bounds, area)) {
      return;
    }

    if (this._divided) {
      this._topLeft.get(area, found);
      this._topRight.get(area, found);
      this._bottomLeft.get(area, found);
      this._bottomRight.get(area, found);
    } else {
      const children = this._children;
      const count = children.length;

      for (let i = 0; i < count; ++i) {
        const child = children[i];

        if (QuadTree.aabb(child, area)) {
          found.push(child);
        }
      }
    }
  }

  add(box) {
    if (!QuadTree.aabb(this._bounds, box)) {
      return;
    }

    if (this._divided) {
      this._topLeft.add(box);
      this._topRight.add(box);
      this._bottomLeft.add(box);
      this._bottomRight.add(box);
    } else {
      const children = this._children;
      const size = children.push(box);
      const capacity = this._capacity;

      if (capacity && size > capacity) {
        this._subdivide();

        for (let i = 0; i < size; ++i) {
          const child = children[i];
          this._topLeft.add(child);
          this._topRight.add(child);
          this._bottomLeft.add(child);
          this._bottomRight.add(child);
        }

        this._children = null;
      }
    }
  }

  _subdivide() {
    const newDepth = this._maxDepth - 1;
    const capacity = this._capacity;
    
    const bounds = this._bounds;

    const left = bounds.x;
    const top = bounds.y;
    const halfWidth = bounds.width * 0.5;
    const halfHeight = bounds.height * 0.5;
    const centerX = left + halfWidth;
    const centerY = top + halfHeight;

    this._topLeft = new QuadTree({
      x: left,
      y: top,
      width: halfWidth,
      height: halfHeight,
    }, newDepth, capacity);

    this._topRight = new QuadTree({
      x: centerX,
      y: top,
      width: halfWidth,
      height: halfHeight,
    }, newDepth, capacity);

    this._bottomLeft = new QuadTree({
      x: left,
      y: centerY,
      width: halfWidth,
      height: halfHeight,
    }, newDepth, capacity);

    this._bottomRight = new QuadTree({
      x: centerX,
      y: centerY,
      width: halfWidth,
      height: halfHeight,
    }, newDepth, capacity);

    this._divided = true;
  }
}
