import {Source} from './source';
import {Item} from './item';
import {SourceItem} from './source-item';
import {Stack} from './stack';

export class TreeSource implements SourceItem, Source {
  private parent: TreeSource;
  private children: TreeSource[] = [];
  data: Item;
  disabled: boolean;
  selected: boolean;

  public static fromFlatArray(arr: Item[], idProp: string, parentIdProp: string): TreeSource {
    const mappedArr = {};
    let arrElem: Item;
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem[idProp]] = new TreeSource(arrElem);
    }
    let mappedElem: TreeSource;
    const root: TreeSource = new TreeSource({});
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

  constructor(data: Item) {
    this.data = data;
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

  public addChild(child: Item): TreeSource {
    const childNode = new TreeSource(child);
    childNode.parent = this;
    this.children.push(childNode);
    return childNode;
  }

  public addChildNode(childNode: TreeSource): void {
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
    let node: TreeSource = this;
    while (!node.isRoot()) {
      fn(node);
      node = node.parent;
    }
  }

  public traverseChildren(fn: Function): void {
    this.children.forEach((node: TreeSource) => {
      fn(node);
      node.traverseChildren(fn);
    });
  }

  [Symbol.iterator](): Iterator<TreeSource> {
    const nodeStack = new Stack<TreeSource>();
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

  size(): number {
    throw new Error('not implemented');
  }

  appendDataItem(item: Item) {
    throw new Error('not implemented');
  }

  appendDataItems(items: Item[]) {
    throw new Error('not implemented');
  }

  getDataItems(): Item[] {
    throw new Error('not implemented');
  }

  getEnabledSourceItems(): SourceItem[] {
    throw new Error('not implemented');
  }

  updateSelection(selection: Item[]): void {
    throw new Error('not implemented');
  }

  isHighlited(sourceItem: SourceItem): boolean {
    throw new Error('not implemented');
  }

  setHighlited(sourceItem: SourceItem): void {
    throw new Error('not implemented');
  }

  getHighlited(): SourceItem {
    throw new Error('not implemented');
  }

  setOnItemInit(param: (sourceItem) => void): void {
    throw new Error('not implemented');
  }
}
