import { Thought } from 'store/rxdb/schemas/thought';
import { Note } from 'store/rxdb/schemas/note';
import { Tag } from 'store/rxdb/schemas/tag';
import { Participant } from 'store/rxdb/schemas/participant';

export interface Notes {
  [noteId: string]: Note;
}

export interface Tags {
  [tagId: string]: Tag;
}

interface Node {
  [char: string]: Node | string[];
}

function getNext(node: Node, char: string): Node {
  if (Array.isArray(node[char])) return null;
  return node[char] as Node;
}

export class Searchable {
  private root: Node = {};
  private visited: { [id: string]: boolean } = {};

  public buildTree = (thoughts: Thought[], notes?: Notes, tags?: Tags, participants?: Participant[]): void => {
    if (thoughts) {
      thoughts.forEach(({ id, date, description, status, time, title, type }) => {
        if (!this.visited[id]) {
          this.visited[id] = true;
          this.processValues(id, [date, description, status, time, title, type]);
        }
      });
    }

    if (notes) {
      Object.entries(notes).forEach(([id, { thoughtId, text }]) => {
        if (!this.visited[id]) {
          this.visited[id] = true;
          this.processValues(thoughtId, [text]);
        }
      });
    }

    if (tags) {
      Object.entries(tags).forEach(([id, { thoughtId, text }]) => {
        if (!this.visited[id]) {
          this.visited[id] = true;
          this.processValues(thoughtId, [text]);
        }
      });
    }

    if (participants) {
      participants.forEach(({ id, thoughtId, name, email }) => {
        if (!this.visited[id]) {
          this.visited[id] = true;
          this.processValues(thoughtId, [name, email]);
        }
      });
    }
  };

  public invalidate = (id: string): void => {
    this.visited[id] = null;
  };

  public findMatches = (input: string): string[] => {
    const matchGroups: string[][] = [];
    let node = this.root;
    const lowerCased = input.toLowerCase();

    for (let i = 0; node && i < lowerCased.length; i++) {
      node = getNext(node, lowerCased[i]);
    }
    if (!node) {
      return [];
    }

    const queue: any[] = [node];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode.matches) matchGroups.push(currentNode.matches);
      Object.entries(currentNode).forEach(([key, nextNode]) => {
        if (key !== 'matches') {
          queue.push(nextNode);
        }
      });
    }

    return [...matchGroups.reduce((next, matches) => {
      matches.forEach(match => next.add(match));
      return next;
    }, new Set<string>())];
  };

  private processValues = (thoughtId: string, values: (string|number)[]): void => {
    values.forEach(value => {
      const suffixes = this.generateSuffixes(String(value).toLowerCase());
      suffixes.forEach(suffix => {
        this.buildNode(thoughtId, suffix);
      });
    });
  };

  private buildNode = (thoughtId: string, value: string): void => {
    let node = this.root;
    for (let i = 0; i < value.length - 1; i++) {
      node[value[i]] = node[value[i]] || {};
      node = getNext(node, value[i]);
    }
    node[value[value.length - 1]] = node[value[value.length - 1]] || {};
    node = getNext(node, value[value.length - 1]);
    node.matches = node.matches || [];
    (node.matches as string[]).push(thoughtId);
  };

  private generateSuffixes = (value: string): string[] => {
    const suffixes: string[] = [];
    for (let i = 0; i < value.length; i++) {
      suffixes.push(value.slice(i));
    }
    return suffixes;
  };
}
