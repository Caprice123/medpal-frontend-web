import React, { useState } from 'react';

const DiagramToolbar = ({
  selectedNodeType,
  onNodeTypeChange,
  onAddNode,
  onSave,
  onExportJSON,
  onExportPng,
  onExportSvg,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (type) => {
    switch (type) {
      case 'json':
        onExportJSON();
        break;
      case 'png':
        onExportPng();
        break;
      case 'svg':
        onExportSvg();
        break;
    }
    setShowExportMenu(false);
  };

  return (
    <div className="diagram-toolbar">
      <div className="toolbar-section">
        <label>Add Node:</label>
        <select
          value={selectedNodeType}
          onChange={(e) => onNodeTypeChange(e.target.value)}
          className="node-type-select"
        >
          <option value="input">▶️ Start - Entry Point</option>
          <option value="default">📦 Process - Action/Step</option>
          <option value="output">⏹️ End - Exit Point</option>
        </select>
        <button onClick={onAddNode} className="btn-primary">
          + Add Node
        </button>
      </div>

      <div className="toolbar-section">
        <button onClick={onUndo} disabled={!canUndo} className="btn-secondary" title="Undo (Ctrl+Z)">
          ↶ Undo
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="btn-secondary" title="Redo (Ctrl+Y)">
          ↷ Redo
        </button>
      </div>

      <div className="toolbar-section">
        <button onClick={onSave} className="btn-success">
          💾 Save
        </button>

        <div className="export-dropdown">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="btn-info"
          >
            📥 Export ▼
          </button>
          {showExportMenu && (
            <div className="export-menu">
              <button onClick={() => handleExport('png')} className="export-menu-item">
                🖼️ Export as PNG
              </button>
              <button onClick={() => handleExport('svg')} className="export-menu-item">
                📐 Export as SVG
              </button>
              <button onClick={() => handleExport('json')} className="export-menu-item">
                📄 Export as JSON
              </button>
            </div>
          )}
        </div>

        <button onClick={onClear} className="btn-danger">
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default DiagramToolbar;
