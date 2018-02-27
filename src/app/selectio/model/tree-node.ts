import {Stack} from './stack';

export class TreeNode<T> implements Iterable<TreeNode<T>> {
  private data: T;
  private parent: TreeNode<T>;
  private children: TreeNode<T>[] = [];
  private hidden: boolean = false;

  public static fromFlatArray<T>(arr: T[], idProp: string, parentIdProp: string): TreeNode<T> {
    const mappedArr = {};
    let arrElem: T;
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem[idProp]] = new TreeNode<T>(arrElem);
    }
    let mappedElem: TreeNode<T>;
    const root: TreeNode<T> = new TreeNode<T>(<T>{});
    for (const prop in mappedArr) {
      if (mappedArr.hasOwnProperty(prop)) {
        mappedElem = mappedArr[prop];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.data[parentIdProp]) {
          const node = mappedArr[mappedElem.data[parentIdProp]];
          node.addChildNode(mappedElem);
          // If the element is at the root level, add it to first level elements array.
        } else {
          root.addChildNode(mappedElem);
        }
      }
    }
    return root;
  }

  constructor(data: T) {
    this.data = data;
  }

  isHidden(): boolean {
    return this.hidden;
  }

  setHidden(value: boolean) {
    this.hidden = value;
  }

  public getData() {
    return this.data;
  }

  public getParent() {
    return this.parent;
  }

  public getChildren() {
    return this.children;
  }

  public addChild(child: T): TreeNode<T> {
    const childNode = new TreeNode<T>(child);
    childNode.parent = this;
    this.children.push(childNode);
    return childNode;
  }

  public addChildNode(childNode: TreeNode<T>): void {
    childNode.parent = this;
    this.children.push(childNode);
  }

  public isRoot(): boolean {
    return this.parent === null;
  }

  public getLevel(): number {
    let level = 0;
    this.traverseToRoot(() => {
      level++;
    });
    return level;
  }

  public traverseToRoot(fn: Function): void {
    let node: TreeNode<T> = this;
    while (!node.isRoot()) {
      fn(node);
      node = node.parent;
    }
  }

  public traverseChildren(fn: Function): void {
    this.children.forEach((node: TreeNode<T>) => {
      fn(node);
      node.traverseChildren(fn);
    });
  }

  public isAllHidden(): boolean {
    let isAllHidden = true;
    this.traverseChildren((node) => {
      if (!node.isHidden()) {
        isAllHidden = false;
      }
    });
    return isAllHidden;
  }

  [Symbol.iterator](): Iterator<TreeNode<T>> {
    const nodeStack = new Stack<TreeNode<T>>();
    // use nodeStack.push(this.root) to start from root;
    for (let i = this.children.length - 1; i >= 0; i--) {
      nodeStack.push(this.children[i]);
    }
    return {
      next: () => {
        const node = nodeStack.pop();
        const nodeExist = (node !== undefined);
        if (nodeExist) {
          for (let i = node.children.length - 1; i >= 0; i--) {
            const childNode = node.children[i];
            if (childNode != null) {
              nodeStack.push(childNode);
            }
          }
        }
        return {
          value: node, done: nodeStack.isEmpty() && !nodeExist
        };
      }
    };
  }
}
