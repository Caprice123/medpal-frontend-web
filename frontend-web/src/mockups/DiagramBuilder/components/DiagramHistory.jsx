import React from 'react';

const DiagramHistory = ({ diagrams, onLoad }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="diagram-history">
      <h2>Diagram History</h2>
      <p className="history-subtitle">{diagrams.length} saved diagrams</p>

      <div className="history-list">
        {diagrams.length === 0 ? (
          <div className="empty-state">
            <p>No diagrams saved yet.</p>
            <p>Create your first diagram and save it to see it here!</p>
          </div>
        ) : (
          diagrams.map((diagram) => (
            <div
              key={diagram.id}
              className="history-item"
              onClick={() => onLoad(diagram)}
            >
              <div className="history-thumbnail">
                <img src={diagram.thumbnail} alt="Diagram thumbnail" />
              </div>
              <div className="history-info">
                <div className="history-title">
                  Flowchart ({diagram.nodes.length} nodes)
                </div>
                <div className="history-date">{formatDate(diagram.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiagramHistory;
