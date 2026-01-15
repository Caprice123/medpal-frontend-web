import React, { useEffect, useRef } from 'react';
import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';
import './JointJSBuilderMockup.css';

const JointJSSimple = () => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const paperRef = useRef(null);

  useEffect(() => {
    console.log('=== JointJS Simple Init ===');
    console.log('Container ref:', containerRef.current);

    if (!containerRef.current) {
      console.error('Container not found!');
      return;
    }

    // Clear container
    containerRef.current.innerHTML = '';

    try {
      // Create namespace
      const namespace = joint.shapes;

      // Create graph
      const graph = new joint.dia.Graph({}, { cellNamespace: namespace });
      graphRef.current = graph;
      console.log('Graph created');

      // Create paper with fixed dimensions
      const paper = new joint.dia.Paper({
        el: containerRef.current,
        model: graph,
        width: 1200,
        height: 800,
        gridSize: 20,
        drawGrid: {
          name: 'mesh',
          args: {
            color: '#e0e0e0',
            thickness: 1
          }
        },
        background: {
          color: '#ffffff'
        },
        cellViewNamespace: namespace,
        interactive: { linkMove: false }
      });
      paperRef.current = paper;
      console.log('Paper created successfully');

      // Add example shapes immediately
      const rect1 = new joint.shapes.standard.Rectangle({
        position: { x: 100, y: 100 },
        size: { width: 150, height: 60 },
        attrs: {
          body: {
            fill: '#ecfeff',
            stroke: '#06b6d4',
            strokeWidth: 3
          },
          label: {
            text: 'Start',
            fill: '#000000',
            fontSize: 16,
            fontWeight: 'bold'
          }
        }
      });

      const rect2 = new joint.shapes.standard.Rectangle({
        position: { x: 100, y: 200 },
        size: { width: 150, height: 60 },
        attrs: {
          body: {
            fill: '#fef3c7',
            stroke: '#fbbf24',
            strokeWidth: 3
          },
          label: {
            text: 'Process',
            fill: '#000000',
            fontSize: 16,
            fontWeight: 'bold'
          }
        }
      });

      const rect3 = new joint.shapes.standard.Rectangle({
        position: { x: 100, y: 300 },
        size: { width: 150, height: 60 },
        attrs: {
          body: {
            fill: '#dcfce7',
            stroke: '#10b981',
            strokeWidth: 3
          },
          label: {
            text: 'End',
            fill: '#000000',
            fontSize: 16,
            fontWeight: 'bold'
          }
        }
      });

      // Add cells to graph
      graph.addCells([rect1, rect2, rect3]);
      console.log('Added 3 example rectangles');

      // Add links
      const link1 = new joint.shapes.standard.Link({
        source: { id: rect1.id },
        target: { id: rect2.id },
        attrs: {
          line: {
            stroke: '#666',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z'
            }
          }
        }
      });

      const link2 = new joint.shapes.standard.Link({
        source: { id: rect2.id },
        target: { id: rect3.id },
        attrs: {
          line: {
            stroke: '#666',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z'
            }
          }
        }
      });

      graph.addCells([link1, link2]);
      console.log('Added links');

      console.log('Total cells in graph:', graph.getCells().length);

    } catch (error) {
      console.error('Error initializing JointJS:', error);
    }

    // Cleanup
    return () => {
      console.log('Cleaning up');
      if (paperRef.current) {
        paperRef.current.remove();
      }
    };
  }, []);

  // Add Rectangle function
  const addRectangle = () => {
    console.log('Add Rectangle clicked');
    if (!graphRef.current) {
      alert('Graph not initialized!');
      return;
    }

    const rect = new joint.shapes.standard.Rectangle({
      position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 300 },
      size: { width: 150, height: 60 },
      attrs: {
        body: {
          fill: '#ecfeff',
          stroke: '#06b6d4',
          strokeWidth: 3
        },
        label: {
          text: 'New Box',
          fill: '#000000',
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    });

    graphRef.current.addCell(rect);
    console.log('Rectangle added. Total cells:', graphRef.current.getCells().length);
  };

  // Add Circle function
  const addCircle = () => {
    console.log('Add Circle clicked');
    if (!graphRef.current) {
      alert('Graph not initialized!');
      return;
    }

    const circle = new joint.shapes.standard.Circle({
      position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 300 },
      size: { width: 100, height: 100 },
      attrs: {
        body: {
          fill: '#fef3c7',
          stroke: '#fbbf24',
          strokeWidth: 3
        },
        label: {
          text: 'Circle',
          fill: '#000000',
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    });

    graphRef.current.addCell(circle);
    console.log('Circle added. Total cells:', graphRef.current.getCells().length);
  };

  // Add Ellipse function
  const addEllipse = () => {
    if (!graphRef.current) return;

    const ellipse = new joint.shapes.standard.Ellipse({
      position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 300 },
      size: { width: 120, height: 80 },
      attrs: {
        body: {
          fill: '#fce7f3',
          stroke: '#ec4899',
          strokeWidth: 3
        },
        label: {
          text: 'Ellipse',
          fill: '#000000',
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    });

    graphRef.current.addCell(ellipse);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (confirm('Clear all shapes?')) {
      graphRef.current?.clear();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ padding: '20px', background: 'white', borderBottom: '2px solid #ddd' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>JointJS Simple Test</h1>
        <p style={{ margin: 0, color: '#666' }}>Testing JointJS with minimal setup</p>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{
          width: '300px',
          background: 'white',
          borderRight: '2px solid #ddd',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginTop: 0 }}>Add Shapes</h3>

          <button
            onClick={addRectangle}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              background: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ◻️ Add Rectangle
          </button>

          <button
            onClick={addCircle}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              background: '#fbbf24',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ⭕ Add Circle
          </button>

          <button
            onClick={addEllipse}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              background: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ⬭ Add Ellipse
          </button>

          <button
            onClick={clearCanvas}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear Canvas
          </button>

          <div style={{ marginTop: '30px', padding: '15px', background: '#fef3c7', borderRadius: '6px' }}>
            <strong>📝 Instructions:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Click buttons to add shapes</li>
              <li>Drag shapes to move them</li>
              <li>Drag corners to resize</li>
              <li>Double-click text to edit</li>
              <li>Check browser console for logs</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Canvas */}
        <div style={{
          flex: 1,
          background: '#f9f9f9',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div
            ref={containerRef}
            style={{
              border: '3px solid #06b6d4',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              background: 'white'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JointJSSimple;
