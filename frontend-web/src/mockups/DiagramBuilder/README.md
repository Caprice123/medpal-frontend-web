# Diagram Builder Mockup

## Overview
This is a standalone mockup of the Diagram Builder feature using **React Flow** for interactive, drag-and-drop diagram editing.

## Access the Mockup
Navigate to: `http://localhost:5173/diagram-mockup` (or your dev server URL)

## Features Implemented

### ✅ Interactive Canvas
- **Drag and drop nodes** to reposition them
- **Connect nodes** by dragging from one handle to another
- **Zoom and pan** using mouse wheel and drag
- **Minimap** for navigation
- **Background grid** for alignment

### ✅ Custom Node Types
1. **Process Node** (Blue Rectangle)
   - Standard process/action node
   - Single input (top) and output (bottom)

2. **Decision Node** (Yellow Diamond)
   - Decision/condition node
   - Multiple outputs (left, right, bottom)

3. **Start/End Node** (Green/Red Oval)
   - Start node (green) - source only
   - End node (red) - target only

### ✅ Diagram Form
- **Diagram Type**: Flowchart, Sequence, Class, State, ER
- **Detail Level**: Simple, Detailed, Comprehensive
- **Orientation**: Vertical or Horizontal
- **Layout Style**: Branch or Linear
- **Description**: Text area for AI prompt

### ✅ Toolbar Controls
- **Add Node**: Select node type and add to canvas
- **Save**: Save current diagram to history
- **Export JSON**: Download diagram data
- **Clear**: Reset canvas

### ✅ History Viewer
- View all saved diagrams
- Click to load a previous diagram
- Shows node count and timestamp

### ✅ AI Generation Simulation
- Click "Buat Diagram dengan AI" to simulate AI generation
- Shows loading indicator
- Generates sample flowchart with 6 nodes

## How to Use

### 1. Manual Editing
1. Select a node type from the toolbar dropdown
2. Click "Add Node" to add it to the canvas
3. Drag nodes to position them
4. Connect nodes by dragging from source handle to target handle
5. Click "Save" to add to history

### 2. AI Generation (Simulated)
1. Fill out the form with diagram preferences
2. Enter a description of what you want
3. Click "Buat Diagram dengan AI"
4. Wait for generation (2 seconds)
5. Edit the generated diagram as needed

### 3. History Management
1. Click "Show History" in the header
2. Browse saved diagrams
3. Click any diagram to load it
4. Continue editing

## React Flow Integration

This mockup uses **React Flow** library with:
- Custom node types (extensible)
- Edge animations
- Interactive controls
- Minimap navigation
- Background variants

## Next Steps for Full Integration

1. **Backend Integration**
   - Connect to actual Skripsi API endpoints
   - Implement real AI diagram generation
   - Save diagrams to `skripsi_messages` table

2. **Enhanced Export**
   - Add SVG export (using `toSvg()`)
   - Add PNG export (using `toPng()`)
   - Add "Copy to Editor" feature

3. **Advanced Editing**
   - Edit node labels inline
   - Delete nodes/edges with keyboard
   - Undo/redo functionality
   - Node styling options

4. **AI Improvements**
   - Parse AI response to React Flow format
   - Support all diagram types
   - Auto-layout algorithms

## File Structure

```
DiagramBuilder/
├── DiagramBuilderMockup.jsx      # Main component
├── DiagramBuilderMockup.css       # Styles
├── README.md                      # This file
├── nodes/
│   ├── ProcessNode.jsx            # Rectangle node
│   ├── DecisionNode.jsx           # Diamond node
│   └── StartEndNode.jsx           # Oval node
└── components/
    ├── DiagramToolbar.jsx         # Top toolbar
    ├── DiagramForm.jsx            # Left panel form
    └── DiagramHistory.jsx         # History viewer
```

## Libraries Used

- **reactflow** (v11+): Core diagram library
- **react**: UI framework
- **react-router-dom**: Routing

## Resources

- React Flow Docs: https://reactflow.dev/
- React Flow Examples: https://reactflow.dev/examples
- React Flow API: https://reactflow.dev/api-reference

## Notes

- This is a **mockup/prototype** for testing the UX
- AI generation is **simulated** (not connected to backend)
- Diagrams are saved in **local state** (not persisted)
- Ready to integrate with your existing Skripsi Builder architecture
