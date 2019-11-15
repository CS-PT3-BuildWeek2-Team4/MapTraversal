const data = require("./roomData.json");

class Graph {
  constructor() {
    this.vertices = {};
  }

  addVertex(vertex) {
    this.vertices[vertex] = new Set();
  }

  addEdge(v1, v2) {
    if (this.vertices[v1] && this.vertices[v2]) {
      this.vertices[v1].add(v2);
    }
  }

  bfs(start, dest) {
    const queue = [];
    const visited = new Set();
    queue.push([start]);
    while (queue.length > 0) {
      const path = queue.pop();
      const vertex = path[path.length - 1];
      if (vertex === dest) {
        return path;
      }
      if (!visited.has(vertex)) {
        visited.add(vertex);
        this.vertices[vertex].forEach(vert => {
          const newPath = [...path];
          newPath.push(vert);
          queue.push(newPath);
        });
      }
    }
    return null;
  }
}

const graph = new Graph();

data.forEach(room => {
  graph.addVertex(room.room_id);
});

data.forEach(room => {
  room.exits.forEach(exit => {
    graph.addEdge(room.room_id, exit.next_room_id);
  });
});

function directions(start, dest) {
  const search = graph.bfs(start, dest);
  return search.map((cur, idx) => {
    const current = data.find(room => room.room_id === cur);
    const direction = current.exits.find(
      exit => exit.next_room_id === search[idx + 1]
    );
    return direction;
  });
}

module.exports = {
  directions
};
