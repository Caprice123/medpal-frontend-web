import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';
import './JointJSBuilderMockup.css';

const { dia, shapes } = joint;

const JointJSBuilderMockup = () => {
  const paperRef = useRef(null);
  const graphRef = useRef(null);
  const canvasRef = useRef(null);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [activeTab, setActiveTab] = useState('diagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [diagramType, setDiagramType] = useState('flowchart');
  const [detailLevel, setDetailLevel] = useState('simple');
  const [orientation, setOrientation] = useState('vertical');
  const [layoutStyle, setLayoutStyle] = useState('branch');
  const [description, setDescription] = useState('');

  // Initialize JointJS Paper and Graph
  useEffect(() => {
    console.log('useEffect running - initializing JointJS');
    console.log('canvasRef.current:', canvasRef.current);
    console.log('graphRef.current (before):', graphRef.current);

    if (!canvasRef.current) {
      console.error('canvasRef.current is null!');
      return;
    }

    if (graphRef.current) {
      console.log('Graph already initialized, skipping');
      return;
    }

    // Get canvas dimensions with fallbacks
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = rect.width > 0 ? rect.width : window.innerWidth - 500; // Subtract left panel width
    const canvasHeight = rect.height > 0 ? rect.height : window.innerHeight - 100; // Subtract header height

    console.log('Canvas dimensions:', {
      width: canvasWidth,
      height: canvasHeight,
      rectWidth: rect.width,
      rectHeight: rect.height
    });

    // Create graph
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    graphRef.current = graph;
    console.log('Graph created:', graph);

    // Create paper
    const paper = new dia.Paper({
      el: canvasRef.current,
      model: graph,
      width: canvasWidth,
      height: canvasHeight,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: '#f8fafc',
      },
      cellViewNamespace: shapes,
      interactive: true,
      defaultLink: () => new shapes.standard.Link(),
    });

    paperRef.current = paper;
    console.log('Paper created:', paper);

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current && paperRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        paperRef.current.setDimensions(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup resize listener
    const cleanupResize = () => window.removeEventListener('resize', handleResize);

    // Add some initial example shapes
    const rect1 = new shapes.standard.Rectangle({
      position: { x: 100, y: 50 },
      size: { width: 150, height: 60 },
      attrs: {
        body: {
          fill: '#ecfeff',
          stroke: '#06b6d4',
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        },
        label: {
          text: 'Start',
          fill: '#1f2937',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    const rect2 = new shapes.standard.Rectangle({
      position: { x: 100, y: 150 },
      size: { width: 150, height: 60 },
      attrs: {
        body: {
          fill: '#fef3c7',
          stroke: '#fbbf24',
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        },
        label: {
          text: 'Process',
          fill: '#1f2937',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    const rect3 = new shapes.standard.Rectangle({
      position: { x: 100, y: 250 },
      size: { width: 150, height: 60 },
      attrs: {
        body: {
          fill: '#dcfce7',
          stroke: '#10b981',
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        },
        label: {
          text: 'End',
          fill: '#1f2937',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    const link1 = new shapes.standard.Link({
      source: { id: rect1.id },
      target: { id: rect2.id },
      attrs: {
        line: {
          stroke: '#6b7280',
          strokeWidth: 2,
          targetMarker: {
            type: 'path',
            d: 'M 10 -5 0 0 10 5 z',
          },
        },
      },
    });

    const link2 = new shapes.standard.Link({
      source: { id: rect2.id },
      target: { id: rect3.id },
      attrs: {
        line: {
          stroke: '#6b7280',
          strokeWidth: 2,
          targetMarker: {
            type: 'path',
            d: 'M 10 -5 0 0 10 5 z',
          },
        },
      },
    });

    graph.addCells([rect1, rect2, rect3, link1, link2]);

    // Cleanup on unmount
    return () => {
      cleanupResize();
      if (paperRef.current) {
        paperRef.current.remove();
        paperRef.current = null;
      }
      if (graphRef.current) {
        graphRef.current.clear();
        graphRef.current = null;
      }
    };
  }, []);

  // Export to PNG
  const handleExportPng = useCallback(() => {
    if (!paperRef.current) return;

    try {
      paperRef.current.toDataURL((dataURL) => {
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'diagram.png';
        a.click();
      }, {
        type: 'image/png',
        quality: 1,
        padding: 20,
      });
    } catch (error) {
      console.error('Export PNG failed:', error);
      alert('Export failed. Please try again.');
    }
  }, []);

  // Export to SVG
  const handleExportSvg = useCallback(() => {
    if (!paperRef.current) return;

    try {
      const svgString = paperRef.current.svg;
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export SVG failed:', error);
      alert('Export failed. Please try again.');
    }
  }, []);

  // Export to JSON
  const handleExportJson = useCallback(() => {
    if (!graphRef.current) return;

    const data = {
      type: 'jointjs',
      version: 1,
      source: 'medpalm-mediko',
      graph: graphRef.current.toJSON(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Save diagram to history
  const handleSave = useCallback(() => {
    if (!graphRef.current) return;

    const diagram = {
      id: Date.now(),
      graph: graphRef.current.toJSON(),
      timestamp: new Date().toISOString(),
    };

    setSavedDiagrams((prev) => [diagram, ...prev]);
    alert('Diagram saved to history!');
  }, []);

  // Load diagram from history
  const handleLoad = useCallback((diagram) => {
    if (!graphRef.current) return;

    graphRef.current.fromJSON(diagram.graph);
  }, []);

  // Clear canvas
  const handleClear = useCallback(() => {
    if (!graphRef.current) return;

    if (confirm('Are you sure you want to clear the canvas?')) {
      graphRef.current.clear();
    }
  }, []);

  // Add Rectangle
  const handleAddRectangle = useCallback(() => {
    console.log('handleAddRectangle called');
    console.log('graphRef.current:', graphRef.current);
    console.log('paperRef.current:', paperRef.current);

    if (!graphRef.current) {
      console.error('Graph not initialized!');
      alert('Graph not initialized. Please refresh the page.');
      return;
    }

    try {
      const rect = new shapes.standard.Rectangle({
        position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
        size: { width: 150, height: 60 },
        attrs: {
          body: {
            fill: '#ecfeff',
            stroke: '#06b6d4',
            strokeWidth: 2,
            rx: 8,
            ry: 8,
          },
          label: {
            text: 'New Box',
            fill: '#1f2937',
            fontSize: 14,
            fontWeight: 600,
          },
        },
      });

      console.log('Rectangle created:', rect);
      graphRef.current.addCell(rect);
      console.log('Rectangle added to graph');
    } catch (error) {
      console.error('Error adding rectangle:', error);
      alert('Error adding rectangle: ' + error.message);
    }
  }, []);

  // Add Circle
  const handleAddCircle = useCallback(() => {
    if (!graphRef.current) return;

    const circle = new shapes.standard.Circle({
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 100, height: 100 },
      attrs: {
        body: {
          fill: '#fef3c7',
          stroke: '#fbbf24',
          strokeWidth: 2,
        },
        label: {
          text: 'Circle',
          fill: '#1f2937',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    graphRef.current.addCell(circle);
  }, []);

  // Add Ellipse
  const handleAddEllipse = useCallback(() => {
    if (!graphRef.current) return;

    const ellipse = new shapes.standard.Ellipse({
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 120, height: 80 },
      attrs: {
        body: {
          fill: '#fce7f3',
          stroke: '#ec4899',
          strokeWidth: 2,
        },
        label: {
          text: 'Ellipse',
          fill: '#831843',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    graphRef.current.addCell(ellipse);
  }, []);

  // Add Diamond (Decision)
  const handleAddDiamond = useCallback(() => {
    if (!graphRef.current) return;

    const diamond = new shapes.standard.Polygon({
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 100, height: 100 },
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          fill: '#fff7ed',
          stroke: '#f97316',
          strokeWidth: 2,
        },
        label: {
          text: 'Decision',
          fill: '#7c2d12',
          fontSize: 12,
          fontWeight: 600,
        },
      },
    });

    graphRef.current.addCell(diamond);
  }, []);

  // Add Cylinder (Database)
  const handleAddCylinder = useCallback(() => {
    if (!graphRef.current) return;

    const cylinder = new shapes.standard.Cylinder({
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 80, height: 100 },
      attrs: {
        body: {
          fill: '#ede9fe',
          stroke: '#8b5cf6',
          strokeWidth: 2,
        },
        top: {
          fill: '#c4b5fd',
          stroke: '#8b5cf6',
          strokeWidth: 2,
        },
        label: {
          text: 'Database',
          fill: '#4c1d95',
          fontSize: 12,
          fontWeight: 600,
        },
      },
    });

    graphRef.current.addCell(cylinder);
  }, []);

  // Add Hexagon
  const handleAddHexagon = useCallback(() => {
    if (!graphRef.current) return;

    const hexagon = new shapes.standard.Polygon({
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 120, height: 100 },
      attrs: {
        body: {
          refPoints: '10,0 20,5 20,15 10,20 0,15 0,5',
          fill: '#f0fdf4',
          stroke: '#22c55e',
          strokeWidth: 2,
        },
        label: {
          text: 'Hexagon',
          fill: '#14532d',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    graphRef.current.addCell(hexagon);
  }, []);

  // Add Parallelogram (Data I/O)
  const handleAddParallelogram = useCallback(() => {
    if (!graphRef.current) return;

    const parallelogram = new shapes.standard.Polygon({
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 150, height: 60 },
      attrs: {
        body: {
          refPoints: '2,0 20,0 18,10 0,10',
          fill: '#dbeafe',
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        label: {
          text: 'Data I/O',
          fill: '#1e3a8a',
          fontSize: 14,
          fontWeight: 600,
        },
      },
    });

    graphRef.current.addCell(parallelogram);
  }, []);

  // Generate diagram (placeholder)
  const handleGenerate = useCallback(() => {
    if (!description.trim()) {
      alert('Mohon isi deskripsi diagram terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('AI generation adalah placeholder. Silakan buat diagram Anda secara manual menggunakan tools JointJS.');
    }, 2000);
  }, [description]);

  return (
    <div className="jointjs-builder-mockup">
      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab ${activeTab === 'researcher1' ? 'active' : ''}`}
          onClick={() => setActiveTab('researcher1')}
        >
          AI Researcher 1
        </button>
        <button
          className={`tab ${activeTab === 'researcher2' ? 'active' : ''}`}
          onClick={() => setActiveTab('researcher2')}
        >
          AI Researcher 2
        </button>
        <button
          className={`tab ${activeTab === 'researcher3' ? 'active' : ''}`}
          onClick={() => setActiveTab('researcher3')}
        >
          AI Researcher 3
        </button>
        <button
          className={`tab ${activeTab === 'paraphraser' ? 'active' : ''}`}
          onClick={() => setActiveTab('paraphraser')}
        >
          Paraphraser
        </button>
        <button
          className={`tab ${activeTab === 'diagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagram')}
        >
          JointJS Diagram Builder
        </button>
      </div>

      <div className="mockup-content">
        {/* Left Panel - Diagram Builder */}
        <div className="mockup-left-panel">
          <div className="panel-header">
            <h1>JointJS Diagram Builder</h1>
            <p className="subtitle">Buat diagram terstruktur dengan JointJS (0.5 kredit/diagram)</p>
            <div className="credit-badge">
              🪙 0.00 kredit
            </div>
          </div>

          <div className="panel-actions">
            <button className="btn-action" onClick={handleGenerate} disabled={isGenerating}>
              🎨 Buat Diagram
            </button>
            <button className="btn-preview" onClick={() => setShowPreview(!showPreview)}>
              👁 Preview
            </button>
          </div>

          <div className="diagram-config">
            <div className="config-section">
              <div className="section-header">
                <span className="section-icon">📊</span>
                <span className="section-title">Flowchart - Proses & Alur</span>
              </div>

              <div className="config-body">
                <div className="form-row">
                  <div className="form-field">
                    <label>Tingkat Detail</label>
                    <select
                      className="form-select"
                      value={detailLevel}
                      onChange={(e) => setDetailLevel(e.target.value)}
                    >
                      <option value="simple">Simple - Ringkas</option>
                      <option value="medium">Medium - Sedang</option>
                      <option value="detailed">Detailed - Detail</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Orientasi</label>
                    <select
                      className="form-select"
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                    >
                      <option value="vertical">Vertikal ↓</option>
                      <option value="horizontal">Horizontal →</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Gaya Layout</label>
                  <select
                    className="form-select"
                    value={layoutStyle}
                    onChange={(e) => setLayoutStyle(e.target.value)}
                  >
                    <option value="branch">Branch - Bercabang</option>
                    <option value="linear">Linear - Linear</option>
                    <option value="tree">Tree - Pohon</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Deskripsi Diagram</label>
                  <textarea
                    className="form-textarea"
                    rows="10"
                    placeholder="Jelaskan diagram yang ingin Anda buat dengan bahasa sehari-hari..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="tips-box">
                  <div className="tips-icon">💡</div>
                  <div className="tips-content">
                    <strong>Tips:</strong>
                    <p>Contoh input untuk Flowchart:</p>
                    <p>"Penelitian dimulai dengan identifikasi masalah, kemudian dilakukan studi literatur, setelah itu pengumpulan data melalui wawancara dan observasi, lalu analisis data, dan terakhir penentuan kesimpulan."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="quick-tools">
              <h3>Basic Shapes</h3>
              <div className="tools-grid">
                <button onClick={handleAddRectangle} className="tool-btn">
                  ◻️ Rectangle
                </button>
                <button onClick={handleAddCircle} className="tool-btn">
                  ⭕ Circle
                </button>
                <button onClick={handleAddEllipse} className="tool-btn">
                  ⬭ Ellipse
                </button>
                <button onClick={handleAddDiamond} className="tool-btn">
                  ♦️ Diamond
                </button>
              </div>

              <h3 style={{ marginTop: '1rem' }}>Flowchart Shapes</h3>
              <div className="tools-grid">
                <button onClick={handleAddCylinder} className="tool-btn">
                  🗄️ Database
                </button>
                <button onClick={handleAddHexagon} className="tool-btn">
                  ⬡ Hexagon
                </button>
                <button onClick={handleAddParallelogram} className="tool-btn">
                  ▱ Data I/O
                </button>
              </div>

              <h3 style={{ marginTop: '1rem' }}>Actions</h3>
              <div className="tools-grid">
                <button onClick={handleClear} className="tool-btn tool-btn-danger">
                  🗑️ Clear Canvas
                </button>
              </div>
            </div>
          </div>

          <div className="panel-footer">
            <button
              className="btn-generate-ai"
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? '⏳ Generating...' : '🎨 Buat Diagram dengan AI'}
            </button>

            <div className="export-actions">
              <button onClick={handleSave} className="btn-small btn-primary">
                💾 Save
              </button>
              <button onClick={handleExportPng} className="btn-small btn-success">
                PNG
              </button>
              <button onClick={handleExportSvg} className="btn-small btn-success">
                SVG
              </button>
              <button onClick={handleExportJson} className="btn-small btn-info">
                JSON
              </button>
            </div>

            {/* History Section */}
            {savedDiagrams.length > 0 && (
              <div className="history-section">
                <h3>Saved Diagrams ({savedDiagrams.length})</h3>
                <div className="history-list">
                  {savedDiagrams.map((diagram) => (
                    <div key={diagram.id} className="history-item">
                      <div className="history-info">
                        <span className="history-icon">📊</span>
                        <span className="history-date">
                          {new Date(diagram.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleLoad(diagram)}
                        className="history-load-btn"
                      >
                        Load
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - JointJS Canvas */}
        <div className="mockup-right-panel">
          <div className="jointjs-wrapper">
            <div ref={canvasRef} className="jointjs-canvas" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JointJSBuilderMockup;
