import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
  ReactFlowProvider,
  NodeToolbar,
  NodeResizer,
} from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import 'reactflow/dist/style.css';

import DiagramToolbar from './components/DiagramToolbar';
import DiagramForm from './components/DiagramForm';
import DiagramHistory from './components/DiagramHistory';
import './DiagramBuilderMockup.css';

// No custom nodeTypes needed - using React Flow built-in types only!

const initialNodes = [
  {
    id: '1',
    type: 'input', // Built-in React Flow type
    position: { x: 250, y: 50 },
    data: { label: 'Start' },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '20px',
      padding: '10px 20px',
      fontWeight: 'bold'
    },
  },
];

const initialEdges = [];

// Helper function to download image
const downloadImage = (dataUrl, filename) => {
  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', dataUrl);
  a.click();
};

const DiagramCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isGenerating,
  onExportPng,
  onExportSvg
}) => {
  const reactFlowWrapper = useRef(null);
  const { getNodes } = useReactFlow();

  // Export to PNG (transparent background, no handles, with edges and labels)
  const handleExportPng = useCallback(() => {
    // Find and hide UI elements
    const viewport = reactFlowWrapper.current.querySelector('.react-flow__viewport');
    if (!viewport) return;

    const background = reactFlowWrapper.current.querySelector('.react-flow__background');
    const controls = reactFlowWrapper.current.querySelector('.react-flow__controls');
    const minimap = reactFlowWrapper.current.querySelector('.react-flow__minimap');
    const handles = reactFlowWrapper.current.querySelectorAll('.react-flow__handle');
    const shortcutsPanel = reactFlowWrapper.current.querySelector('.keyboard-shortcuts-panel');
    const edgeTexts = reactFlowWrapper.current.querySelectorAll('.react-flow__edge-text');

    // Hide elements temporarily
    if (background) background.style.display = 'none';
    if (controls) controls.style.display = 'none';
    if (minimap) minimap.style.display = 'none';
    if (shortcutsPanel) shortcutsPanel.style.display = 'none';
    handles.forEach(handle => handle.style.display = 'none');

    // Force edge text to be visible with explicit styling
    edgeTexts.forEach(text => {
      text.style.fill = '#000000';
      text.style.fontSize = '12px';
      text.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      text.style.fontWeight = '600';
      text.style.opacity = '1';
      text.style.visibility = 'visible';
    });

    // Wait longer for fonts and SVG text to render
    setTimeout(() => {
      // Capture the viewport only (contains nodes and edges)
      toPng(viewport, {
        backgroundColor: 'transparent',
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: false,
        filter: (node) => {
          // Include everything except these classes
          return !node.classList?.contains('react-flow__background') &&
                 !node.classList?.contains('react-flow__controls') &&
                 !node.classList?.contains('react-flow__minimap');
        }
      }).then((dataUrl) => {
        // Restore hidden elements
        if (background) background.style.display = '';
        if (controls) controls.style.display = '';
        if (minimap) minimap.style.display = '';
        if (shortcutsPanel) shortcutsPanel.style.display = '';
        handles.forEach(handle => handle.style.display = '');
        // Reset edge text styles
        edgeTexts.forEach(text => {
          text.style.fill = '';
          text.style.fontSize = '';
          text.style.fontFamily = '';
          text.style.fontWeight = '';
          text.style.opacity = '';
          text.style.visibility = '';
        });

        downloadImage(dataUrl, 'diagram.png');
      }).catch((error) => {
        console.error('Export failed:', error);
        // Restore hidden elements on error
        if (background) background.style.display = '';
        if (controls) controls.style.display = '';
        if (minimap) minimap.style.display = '';
        if (shortcutsPanel) shortcutsPanel.style.display = '';
        handles.forEach(handle => handle.style.display = '');
        edgeTexts.forEach(text => {
          text.style.fill = '';
          text.style.fontSize = '';
          text.style.fontFamily = '';
          text.style.fontWeight = '';
          text.style.opacity = '';
          text.style.visibility = '';
        });
      });
    }, 500);
  }, []);

  // Export to SVG (transparent background, no handles, with edges and labels)
  const handleExportSvg = useCallback(() => {
    // Find and hide UI elements
    const viewport = reactFlowWrapper.current.querySelector('.react-flow__viewport');
    if (!viewport) return;

    const background = reactFlowWrapper.current.querySelector('.react-flow__background');
    const controls = reactFlowWrapper.current.querySelector('.react-flow__controls');
    const minimap = reactFlowWrapper.current.querySelector('.react-flow__minimap');
    const handles = reactFlowWrapper.current.querySelectorAll('.react-flow__handle');
    const shortcutsPanel = reactFlowWrapper.current.querySelector('.keyboard-shortcuts-panel');
    const edgeTexts = reactFlowWrapper.current.querySelectorAll('.react-flow__edge-text');

    // Hide elements temporarily
    if (background) background.style.display = 'none';
    if (controls) controls.style.display = 'none';
    if (minimap) minimap.style.display = 'none';
    if (shortcutsPanel) shortcutsPanel.style.display = 'none';
    handles.forEach(handle => handle.style.display = 'none');

    // Force edge text to be visible with explicit styling
    edgeTexts.forEach(text => {
      text.style.fill = '#000000';
      text.style.fontSize = '12px';
      text.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      text.style.fontWeight = '600';
      text.style.opacity = '1';
      text.style.visibility = 'visible';
    });

    // Wait longer for fonts and SVG text to render
    setTimeout(() => {
      // Capture the viewport only (contains nodes and edges)
      toSvg(viewport, {
        backgroundColor: 'transparent',
        cacheBust: true,
        skipFonts: false,
        filter: (node) => {
          // Include everything except these classes
          return !node.classList?.contains('react-flow__background') &&
                 !node.classList?.contains('react-flow__controls') &&
                 !node.classList?.contains('react-flow__minimap');
        }
      }).then((dataUrl) => {
        // Restore hidden elements
        if (background) background.style.display = '';
        if (controls) controls.style.display = '';
        if (minimap) minimap.style.display = '';
        if (shortcutsPanel) shortcutsPanel.style.display = '';
        handles.forEach(handle => handle.style.display = '');
        // Reset edge text styles
        edgeTexts.forEach(text => {
          text.style.fill = '';
          text.style.fontSize = '';
          text.style.fontFamily = '';
          text.style.fontWeight = '';
          text.style.opacity = '';
          text.style.visibility = '';
        });

        downloadImage(dataUrl, 'diagram.svg');
      }).catch((error) => {
        console.error('Export failed:', error);
        // Restore hidden elements on error
        if (background) background.style.display = '';
        if (controls) controls.style.display = '';
        if (minimap) minimap.style.display = '';
        if (shortcutsPanel) shortcutsPanel.style.display = '';
        handles.forEach(handle => handle.style.display = '');
        edgeTexts.forEach(text => {
          text.style.fill = '';
          text.style.fontSize = '';
          text.style.fontFamily = '';
          text.style.fontWeight = '';
          text.style.opacity = '';
          text.style.visibility = '';
        });
      });
    }, 500);
  }, []);

  // Pass export functions to parent
  React.useEffect(() => {
    if (onExportPng) onExportPng.current = handleExportPng;
    if (onExportSvg) onExportSvg.current = handleExportSvg;
  }, [handleExportPng, handleExportSvg, onExportPng, onExportSvg]);

  return (
    <div ref={reactFlowWrapper} className="diagram-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        selectionKeyCode="Shift"
        snapToGrid={false}
        snapGrid={[15, 15]}
        connectionLineType="smoothstep"
        defaultEdgeOptions={{
          animated: false,
          type: 'smoothstep',
          style: { strokeWidth: 2, stroke: '#b1b1b7' },
        }}
      >
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          position="bottom-left"
        />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return '#10b981';
              case 'output':
                return '#ef4444';
              case 'default':
                return '#60a5fa';
              default:
                return '#cbd5e1';
            }
          }}
          zoomable
          pannable
          position="bottom-right"
          nodeStrokeWidth={3}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background variant="dots" gap={12} size={1} color="#e2e8f0" />

        {isGenerating && (
          <Panel position="top-center">
            <div className="generating-indicator">
              <div className="spinner"></div>
              <span>Generating diagram with AI...</span>
            </div>
          </Panel>
        )}

        <Panel position="top-left" className="keyboard-shortcuts-panel">
          <div className="shortcuts-content">
            <div className="shortcuts-title">⌨️ Keyboard Shortcuts</div>
            <div className="shortcuts-list">
              <div><kbd>Ctrl+Z</kbd> Undo</div>
              <div><kbd>Ctrl+Y</kbd> Redo</div>
              <div><kbd>Del</kbd> Delete selected</div>
              <div><kbd>Ctrl+Click</kbd> Multi-select</div>
              <div><kbd>Drag</kbd> Pan canvas</div>
              <div><kbd>Scroll</kbd> Zoom in/out</div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const DiagramBuilderMockup = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState('default');
  const [showHistory, setShowHistory] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Undo/Redo state
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const exportPngRef = useRef(null);
  const exportSvgRef = useRef(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: false }, eds)),
    [setEdges]
  );

  // Save state to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [nodes, edges, history, currentIndex]);

  // Undo
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const state = history[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Redo
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const state = history[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Delete selected nodes/edges
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setTimeout(saveToHistory, 100);
  }, [setNodes, setEdges, saveToHistory]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      // Delete selected nodes/edges
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected]);

  // Add new node (using only built-in React Flow types)
  const addNode = useCallback(() => {
    // Define styles for built-in types
    const nodeConfig = {
      default: {
        label: 'Process',
        style: {
          background: '#60a5fa',
          color: 'white',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: '500',
        }
      },
      input: {
        label: 'Start',
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: '2px solid #059669',
          borderRadius: '25px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
        }
      },
      output: {
        label: 'End',
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: '2px solid #dc2626',
          borderRadius: '25px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
        }
      }
    };

    const config = nodeConfig[selectedNodeType] || nodeConfig.default;

    const newNode = {
      id: `node-${Date.now()}`,
      type: selectedNodeType, // 'default', 'input', or 'output'
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: `${config.label} ${nodes.length + 1}` },
      style: config.style
    };

    setNodes((nds) => [...nds, newNode]);
    // Save to history after a short delay to batch rapid changes
    setTimeout(saveToHistory, 100);
  }, [nodes, selectedNodeType, setNodes, saveToHistory]);

  // Simulate AI generation
  const generateDiagram = useCallback((formData) => {
    setIsGenerating(true);
    setShowForm(false);

    // Simulate AI processing
    setTimeout(() => {
      const generatedNodes = [
        {
          id: '1',
          type: 'input',
          position: { x: 250, y: 50 },
          data: { label: 'Mulai' },
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: '2px solid #059669',
            borderRadius: '25px',
            padding: '12px 24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
          }
        },
        {
          id: '2',
          type: 'default',
          position: { x: 250, y: 150 },
          data: { label: 'Input Data' },
          style: {
            background: '#60a5fa',
            color: 'white',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
          }
        },
        {
          id: '3',
          type: 'default',
          position: { x: 250, y: 270 },
          data: { label: 'Data Valid?' },
          style: {
            background: '#f59e0b',
            color: 'white',
            border: '2px solid #d97706',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
          }
        },
        {
          id: '4',
          type: 'default',
          position: { x: 100, y: 400 },
          data: { label: 'Tampilkan Error' },
          style: {
            background: '#ef4444',
            color: 'white',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
          }
        },
        {
          id: '5',
          type: 'default',
          position: { x: 400, y: 400 },
          data: { label: 'Proses Data' },
          style: {
            background: '#60a5fa',
            color: 'white',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
          }
        },
        {
          id: '6',
          type: 'output',
          position: { x: 250, y: 520 },
          data: { label: 'Selesai' },
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: '2px solid #dc2626',
            borderRadius: '25px',
            padding: '12px 24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
          }
        },
      ];

      const generatedEdges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Tidak' },
        { id: 'e3-5', source: '3', target: '5', label: 'Ya' },
        { id: 'e4-6', source: '4', target: '6' },
        { id: 'e5-6', source: '5', target: '6' },
      ];

      setNodes(generatedNodes);
      setEdges(generatedEdges);
      setIsGenerating(false);
    }, 2000);
  }, [setNodes, setEdges]);

  // Save diagram
  const saveDiagram = useCallback(() => {
    const diagram = {
      id: Date.now(),
      nodes,
      edges,
      timestamp: new Date().toISOString(),
      thumbnail: generateThumbnail(),
    };
    setSavedDiagrams((prev) => [diagram, ...prev]);
    alert('Diagram saved to history!');
  }, [nodes, edges]);

  // Load diagram from history
  const loadDiagram = useCallback((diagram) => {
    setNodes(diagram.nodes);
    setEdges(diagram.edges);
    setShowHistory(false);
  }, [setNodes, setEdges]);

  // Generate thumbnail (simplified)
  const generateThumbnail = () => {
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="200" height="150" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666">Flowchart</text></svg>`
    )}`;
  };

  // Export as JSON
  const exportJSON = useCallback(() => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
  }, [nodes, edges]);

  // Export as PNG
  const exportPng = useCallback(() => {
    if (exportPngRef.current) {
      exportPngRef.current();
    }
  }, []);

  // Export as SVG
  const exportSvg = useCallback(() => {
    if (exportSvgRef.current) {
      exportSvgRef.current();
    }
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (window.confirm('Clear all nodes and edges?')) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <div className="diagram-builder-mockup">
        {/* Header */}
        <div className="mockup-header">
          <h1>Diagram Builder Mockup</h1>
          <div className="mockup-header-buttons">
            <button onClick={() => setShowForm(!showForm)} className="btn-toggle">
              {showForm ? 'Hide' : 'Show'} Form
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className="btn-toggle">
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>
        </div>

        <div className="mockup-content">
        {/* Left Panel - Form & Chat */}
        <div className={`mockup-left-panel ${!showForm && !showHistory ? 'hidden' : ''}`}>
          {showHistory ? (
            <DiagramHistory diagrams={savedDiagrams} onLoad={loadDiagram} />
          ) : (
            <DiagramForm onGenerate={generateDiagram} isGenerating={isGenerating} />
          )}
        </div>

        {/* Right Panel - Canvas */}
        <div className="mockup-right-panel">
          <DiagramToolbar
            selectedNodeType={selectedNodeType}
            onNodeTypeChange={setSelectedNodeType}
            onAddNode={addNode}
            onSave={saveDiagram}
            onExportJSON={exportJSON}
            onExportPng={exportPng}
            onExportSvg={exportSvg}
            onClear={clearCanvas}
            onUndo={undo}
            onRedo={redo}
            canUndo={currentIndex > 0}
            canRedo={currentIndex < history.length - 1}
          />

          <DiagramCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            isGenerating={isGenerating}
            onExportPng={exportPngRef}
            onExportSvg={exportSvgRef}
          />
        </div>
      </div>
      </div>
    </ReactFlowProvider>
  );
};

export default DiagramBuilderMockup;
