export class Stack<T> {

  private _topNode: Node<T>;
  private _count: number = 0;

  public count(): number {
    return this._count;
  }

  public isEmpty(): boolean {
    return this._topNode === undefined;
  }

  public push(value: T): void {
    // create a new Node and add it to the top
    this._topNode = new Node<T>(value, this._topNode);
    this._count++;
  }

  public pop(): T {
    // remove the top node from the stack.
    // the node at the top now is the one before it
    const poppedNode = this._topNode;
    this._topNode = poppedNode.previous;
    this._count--;
    return poppedNode.data;
  }

  public peek(): T {
    return this._topNode.data;
  }

}

class Node<T> {
  previous: Node<T>;
  data: T;

  constructor(data: T, previous: Node<T>) {
    this.previous = previous;
    this.data = data;
  }
}
