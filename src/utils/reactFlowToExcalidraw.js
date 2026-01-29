import dagre from 'dagre';

/**
 * Apply Dagre layout to React Flow nodes and edges
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {Object} options - Layout options
 * @returns {Object} - { nodes, edges } with calculated positions
 */
export function applyDagreLayout(nodes, edges, options = {}) {
  const {
    direction = 'LR',  // 'TB' = top-to-bottom, 'LR' = left-to-right
    nodeWidth = 180,
    nodeHeight = 80,
    circleSize = 100,
    nodesep = 80,      // Horizontal spacing between nodes
    ranksep = 100,     // Vertical spacing between ranks
  } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure graph
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep,
    ranksep,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre
  nodes.forEach((node) => {
    const isCircle = node.type === 'circle';
    dagreGraph.setNode(node.id, {
      width: isCircle ? circleSize : nodeWidth,
      height: isCircle ? circleSize : nodeHeight,
    });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Update nodes with calculated positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isCircle = node.type === 'circle';
    const width = isCircle ? circleSize : nodeWidth;
    const height = isCircle ? circleSize : nodeHeight;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,  // Dagre uses center, we need top-left
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Convert React Flow nodes/edges to Excalidraw skeleton format
 * @param {Array} nodes - React Flow nodes with positions
 * @param {Array} edges - React Flow edges
 * @returns {Array} - Excalidraw skeleton elements
 */
export function convertReactFlowToExcalidrawSkeleton(nodes, edges) {
  const elements = [];
  const colorPalette = [
    'rgba(153, 204, 255, 0.4)',  // Blue
    'rgba(255, 255, 102, 0.4)',  // Yellow
    'rgba(255, 204, 153, 0.4)',  // Orange
    'rgba(204, 255, 153, 0.4)',  // Green
    'rgba(255, 153, 204, 0.4)',  // Pink
    'rgba(204, 153, 255, 0.4)',  // Purple
  ];

  // Convert nodes to Excalidraw elements
  nodes.forEach((node) => {
    const isCircle = node.type === 'circle';
    const width = isCircle ? 100 : 180;
    const height = isCircle ? 100 : 80;

    const element = {
      id: node.id,
      type: isCircle ? 'ellipse' : 'rectangle',
      x: node.position.x,
      y: node.position.y,
      width,
      height,
      backgroundColor: colorPalette,
      strokeColor: '#000000',
      label: {
        text: node.data.label || '',
      },
    };

    elements.push(element);
  });

  // Convert edges to Excalidraw arrows
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      console.warn(`Edge ${edge.id} references missing node`);
      return;
    }

    const sourceIsCircle = sourceNode.type === 'circle';
    const sourceWidth = sourceIsCircle ? 100 : 180;
    const sourceHeight = sourceIsCircle ? 100 : 80;

    const arrow = {
      id: edge.id,
      type: 'arrow',
      x: sourceNode.position.x + sourceWidth / 2,   // Center X of source
      y: sourceNode.position.y + sourceHeight / 2,  // Center Y of source
      start: {
        id: edge.source,
      },
      end: {
        id: edge.target,
      },
    };

    // Add label if exists
    if (edge.label) {
      arrow.label = { text: edge.label };
    }

    elements.push(arrow);
  });

  return elements;
}

/**
 * Full conversion: React Flow → Dagre Layout → Excalidraw
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {Object} options - Layout options
 * @returns {Object} - Complete Excalidraw diagram
 */
export function convertReactFlowToExcalidraw(nodes, edges, options = {}) {
  // Step 1: Apply dagre layout (if useLayout is true)
  const { useLayout = true, ...layoutOptions } = options;

  let layoutedNodes = nodes;
  if (useLayout) {
    const layouted = applyDagreLayout(nodes, edges, layoutOptions);
    layoutedNodes = layouted.nodes;
  }

  // Step 2: Convert to Excalidraw skeleton
  const skeletonElements = convertReactFlowToExcalidrawSkeleton(layoutedNodes, edges);

  // Step 4: Return complete Excalidraw structure
  return skeletonElements
}
