import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
