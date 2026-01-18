import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Search, Trash2, ChevronLeft, ChevronRight, Copy, Check, Loader, RefreshCw, X, Calendar, Image as ImageIcon } from 'lucide-react';
import './Media.css';

const Media = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const itemsPerPage = 24;

  const IMAGEKIT_PRIVATE_KEY = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authHeader = btoa(`${IMAGEKIT_PRIVATE_KEY}:`);
      
      const response = await fetch(
        `https://api.imagekit.io/v1/files?fileType=image&sort=DESC_CREATED&limit=500`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${authHeader}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images from ImageKit');
      }

      const data = await response.json();
      
      const imageItems = data.filter(item => 
        item.type === 'file' && 
        item.fileType === 'image'
      );
      
      imageItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setImages(imageItems);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [IMAGEKIT_PRIVATE_KEY]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    setError(null);

    const authHeader = btoa(`${IMAGEKIT_PRIVATE_KEY}:`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length });

      try {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const formData = new FormData();
        formData.append('file', base64);
        formData.append('fileName', file.name);
        formData.append('folder', '/mommy-first');
        formData.append('useUniqueFileName', 'true');

        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload error:', errorData);
        }
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
      }
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Refresh images after upload
    await fetchImages();
    setCurrentPage(1);
  };

  const handleDeleteImage = async (fileId) => {
    setDeleting(true);
    try {
      const authHeader = btoa(`${IMAGEKIT_PRIVATE_KEY}:`);
      
      const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Remove from local state
      setImages(prev => prev.filter(img => img.fileId !== fileId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredImages = images.filter(img => 
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

  const copyImageLink = (url, id) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="media-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">Upload and manage images from ImageKit</p>
        </div>
      </div>

      <div className="media-toolbar">
        <div className="upload-section">
          <button 
            className="btn-upload" 
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader className="spinning" size={16} />
                Uploading {uploadProgress.current}/{uploadProgress.total}...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Images
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="btn-refresh" 
            onClick={fetchImages}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          </button>
        </div>
        
        <div className="media-stats">
          <span className="stats-count">{filteredImages.length} images</span>
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

      {error && (
        <div className="media-error">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {loading ? (
        <div className="media-loading">
          <Loader className="spinning" size={40} />
          <p>Loading images from ImageKit...</p>
        </div>
      ) : (
        <>
          <div className="media-grid">
            {currentImages.map((image) => (
              <div key={image.fileId} className="media-item">
                <div className="media-image-wrapper">
                  <img 
                    src={`${image.url}?tr=w-300,h-300,fo-auto`} 
                    alt={image.name} 
                    className="media-image" 
                    loading="lazy"
                  />
                  <div className="media-overlay">
                    <button 
                      className="btn-action-media"
                      onClick={() => copyImageLink(image.url, image.fileId)}
                      title="Copy image link"
                    >
                      {copiedId === image.fileId ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button 
                      className="btn-action-media btn-delete"
                      onClick={() => setDeleteConfirm(image)}
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="media-info">
                  <p className="media-name" title={image.name}>{image.name}</p>
                  <div className="media-meta">
                    <span className="media-size">{formatFileSize(image.size)}</span>
                    <span className="media-date">{formatDate(image.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentImages.length === 0 && !loading && (
            <div className="media-empty">
              <ImageIcon size={48} />
              <p>No images found</p>
              {searchTerm && <span>Try a different search term</span>}
            </div>
          )}

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
                {getPaginationNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Image</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="btn-delete-confirm" 
                onClick={() => handleDeleteImage(deleteConfirm.fileId)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;