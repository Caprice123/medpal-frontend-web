import React, { useEffect, useRef } from 'react';
import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

// Minimal test component to verify JointJS works
const JointJSTest = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('=== JointJS Test Starting ===');
    console.log('joint object:', joint);
    console.log('joint.dia:', joint.dia);
    console.log('joint.shapes:', joint.shapes);

    try {
      // Create namespace
      const namespace = joint.shapes;

      // Create graph
      const graph = new joint.dia.Graph({}, { cellNamespace: namespace });
      console.log('Graph created:', graph);

      // Create paper with fixed dimensions
      const paper = new joint.dia.Paper({
        el: canvasRef.current,
        model: graph,
        width: 800,
        height: 600,
        gridSize: 10,
        drawGrid: true,
        background: {
          color: '#ffffff'
        },
        cellViewNamespace: namespace
      });
      console.log('Paper created:', paper);

      // Create a simple rectangle
      const rect = new joint.shapes.standard.Rectangle();
      rect.position(100, 50);
      rect.resize(150, 60);
      rect.attr({
        body: {
          fill: '#ecfeff',
          stroke: '#06b6d4',
          strokeWidth: 2
        },
        label: {
          text: 'Test Box',
          fill: '#000000'
        }
      });
      console.log('Rectangle created:', rect);

      // Add to graph
      rect.addTo(graph);
      console.log('Rectangle added to graph');
      console.log('Graph cells:', graph.getCells());

      // Try alternative method
      const rect2 = new joint.shapes.standard.Rectangle({
        position: { x: 100, y: 150 },
        size: { width: 150, height: 60 },
        attrs: {
          body: {
            fill: '#fef3c7',
            stroke: '#fbbf24',
            strokeWidth: 2
          },
          label: {
            text: 'Test Box 2',
            fill: '#000000'
          }
        }
      });
      graph.addCell(rect2);
      console.log('Rectangle 2 added');
      console.log('Total cells:', graph.getCells().length);

    } catch (error) {
      console.error('Error in JointJS test:', error);
      console.error('Error stack:', error.stack);
    }

  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>JointJS Test</h1>
      <p>Check browser console for logs</p>
      <div
        ref={canvasRef}
        style={{
          width: '800px',
          height: '600px',
          border: '2px solid #ccc',
          background: '#f0f0f0'
        }}
      />
    </div>
  );
};

export default JointJSTest;
