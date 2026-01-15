import React, { useState } from 'react';

const DiagramForm = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState({
    diagramType: 'flowchart',
    detailLevel: 'simple',
    orientation: 'vertical',
    layout: 'branch',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    onGenerate(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="diagram-form">
      <h2>Diagram Builder</h2>
      <p className="form-subtitle">Buat diagram otomatis dari deskripsi Anda (0.5 kredit/diagram)</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipe Diagram</label>
          <select
            value={formData.diagramType}
            onChange={(e) => handleChange('diagramType', e.target.value)}
            className="form-select"
          >
            <option value="flowchart">📊 Flowchart - Proses & Alur</option>
            <option value="sequence">⏱️ Sequence - Timeline & Interaksi</option>
            <option value="class">📦 Class - Struktur Data</option>
            <option value="state">🔄 State - Diagram State</option>
            <option value="er">🔗 ER Diagram - Entity Relationship</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tingkat Detail</label>
          <select
            value={formData.detailLevel}
            onChange={(e) => handleChange('detailLevel', e.target.value)}
            className="form-select"
          >
            <option value="simple">Simple - Ringkas</option>
            <option value="detailed">Detailed - Detail</option>
            <option value="comprehensive">Comprehensive - Lengkap</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Orientasi</label>
            <select
              value={formData.orientation}
              onChange={(e) => handleChange('orientation', e.target.value)}
              className="form-select"
            >
              <option value="vertical">Vertikal ↓</option>
              <option value="horizontal">Horizontal →</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gaya Layout</label>
            <select
              value={formData.layout}
              onChange={(e) => handleChange('layout', e.target.value)}
              className="form-select"
            >
              <option value="branch">Branch - Bercabang</option>
              <option value="linear">Linear - Berurutan</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Deskripsi Diagram</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Jelaskan diagram yang ingin Anda buat dengan bahasa sehari-hari..."
            rows={8}
            className="form-textarea"
          />
        </div>

        <div className="form-tips">
          💡 Tips:
          <ul>
            <li>Jelaskan proses atau alur yang ingin divisualisasikan</li>
            <li>Sebutkan langkah-langkah utama yang harus ditampilkan</li>
            <li>Jika ada keputusan/percabangan, jelaskan kondisinya</li>
          </ul>
        </div>

        <button
          type="submit"
          className="btn-generate"
          disabled={isGenerating}
        >
          {isGenerating ? '⏳ Generating...' : '🎨 Buat Diagram dengan AI'}
        </button>
      </form>
    </div>
  );
};

export default DiagramForm;
