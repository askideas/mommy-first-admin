import { useState } from 'react';
import { Upload, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './Media.css';

const Media = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 12;

  // Sample images data
  const allImages = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    url: `https://via.placeholder.com/300x300?text=Image+${i + 1}`,
    name: `image-${i + 1}.jpg`,
    size: '245 KB',
    date: '2024-12-12'
  }));

  const filteredImages = allImages.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="media-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">Upload and manage images</p>
        </div>
      </div>

      <div className="media-toolbar">
        <div className="upload-section">
          <button className="btn-upload">
            <Upload size={16} />
            Upload Images
          </button>
        </div>
        
        <div className="search-section">
          <Search size={16} className="search-icon-media" />
          <input
            type="text"
            placeholder="Search images..."
            className="search-input-media"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="media-grid">
        {currentImages.map((image) => (
          <div key={image.id} className="media-item">
            <div className="media-image-wrapper">
              <img src={image.url} alt={image.name} className="media-image" />
              <div className="media-overlay">
                <button className="btn-delete-media">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="media-info">
              <p className="media-name">{image.name}</p>
              <span className="media-size">{image.size}</span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Media;