import { convertReactFlowToExcalidraw, applyDagreLayout } from './reactFlowToExcalidraw';

// Your example data
const nodes = [
  {
    "id": "n1",
    "type": "circle",
    "position": { "x": 50, "y": 150 },
    "data": { "label": "Mulai" }
  },
  {
    "id": "n2",
    "type": "rectangle",
    "position": { "x": 300, "y": 150 },
    "data": { "label": "Apa itu Python?" }
  },
  {
    "id": "n3",
    "type": "rectangle",
    "position": { "x": 550, "y": 50 },
    "data": { "label": "Bahasa Pemrograman" }
  },
  {
    "id": "n4",
    "type": "rectangle",
    "position": { "x": 800, "y": 50 },
    "data": { "label": "Tujuan Umum" }
  },
  {
    "id": "n5",
    "type": "rectangle",
    "position": { "x": 550, "y": 150 },
    "data": { "label": "Mudah Dipelajari" }
  },
  {
    "id": "n6",
    "type": "rectangle",
    "position": { "x": 800, "y": 150 },
    "data": { "label": "Sintaks Simpel" }
  },
  {
    "id": "n7",
    "type": "rectangle",
    "position": { "x": 550, "y": 250 },
    "data": { "label": "Banyak Digunakan" }
  },
  {
    "id": "n8",
    "type": "rectangle",
    "position": { "x": 800, "y": 225 },
    "data": { "label": "Web Development" }
  },
  {
    "id": "n9",
    "type": "rectangle",
    "position": { "x": 800, "y": 325 },
    "data": { "label": "Data Science" }
  },
  {
    "id": "n10",
    "type": "rectangle",
    "position": { "x": 1050, "y": 150 },
    "data": { "label": "Manfaat Utama" }
  },
  {
    "id": "n11",
    "type": "circle",
    "position": { "x": 1300, "y": 150 },
    "data": { "label": "Selesai" }
  }
];

const edges = [
  { "id": "e1-2", "source": "n1", "target": "n2" },
  { "id": "e2-3", "source": "n2", "target": "n3" },
  { "id": "e2-5", "source": "n2", "target": "n5" },
  { "id": "e2-7", "source": "n2", "target": "n7" },
  { "id": "e3-4", "source": "n3", "target": "n4" },
  { "id": "e5-6", "source": "n5", "target": "n6" },
  { "id": "e7-8", "source": "n7", "target": "n8" },
  { "id": "e7-9", "source": "n7", "target": "n9" },
  { "id": "e4-10", "source": "n4", "target": "n10" },
  { "id": "e6-10", "source": "n6", "target": "n10" },
  { "id": "e8-10", "source": "n8", "target": "n10" },
  { "id": "e9-10", "source": "n9", "target": "n10" },
  { "id": "e10-11", "source": "n10", "target": "n11" }
];

// USAGE EXAMPLE 1: Use existing positions (no dagre layout)
console.log('=== EXAMPLE 1: Using existing positions ===');
const excalidrawDiagram1 = convertReactFlowToExcalidraw(nodes, edges, {
  useLayout: false  // Keep original positions
});

console.log('Excalidraw diagram with original positions:');
console.log(JSON.stringify(excalidrawDiagram1, null, 2));

// USAGE EXAMPLE 2: Apply dagre auto-layout (horizontal)
console.log('\n=== EXAMPLE 2: Dagre auto-layout (horizontal) ===');
const excalidrawDiagram2 = convertReactFlowToExcalidraw(nodes, edges, {
  useLayout: true,
  direction: 'LR',  // Left to right
  nodesep: 100,
  ranksep: 150
});

console.log('Excalidraw diagram with dagre layout (LR):');
console.log(JSON.stringify(excalidrawDiagram2, null, 2));

// USAGE EXAMPLE 3: Apply dagre auto-layout (vertical)
console.log('\n=== EXAMPLE 3: Dagre auto-layout (vertical) ===');
const excalidrawDiagram3 = convertReactFlowToExcalidraw(nodes, edges, {
  useLayout: true,
  direction: 'TB',  // Top to bottom
  nodesep: 100,
  ranksep: 150
});

console.log('Excalidraw diagram with dagre layout (TB):');
console.log(JSON.stringify(excalidrawDiagram3, null, 2));

// USAGE EXAMPLE 4: Just apply layout without full conversion
console.log('\n=== EXAMPLE 4: Just apply dagre layout ===');
const layouted = applyDagreLayout(nodes, edges, {
  direction: 'LR',
  nodesep: 100,
  ranksep: 150
});

console.log('Nodes with calculated positions:');
console.log(JSON.stringify(layouted.nodes, null, 2));

export { nodes, edges };
