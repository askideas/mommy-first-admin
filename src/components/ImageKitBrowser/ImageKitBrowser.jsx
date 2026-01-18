import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Search, Loader, RefreshCw, Upload, ChevronLeft, ChevronRight, Calendar, FileImage } from 'lucide-react';
import './ImageKitBrowser.css';

const IMAGES_PER_PAGE = 14;

const ImageKitBrowser = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);

  const IMAGEKIT_PRIVATE_KEY = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
  const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
  const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authHeader = btoa(`${IMAGEKIT_PRIVATE_KEY}:`);
      
      // Fetch images sorted by creation date (newest first)
      const response = await fetch(
        `https://api.imagekit.io/v1/files?fileType=image&sort=DESC_CREATED&limit=100`,
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
      
      // Filter only images and sort by creation date (newest first)
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
    if (isOpen) {
      fetchImages();
      setSelectedImage(null);
      setCurrentPage(1);
      setSearchQuery('');
    }
  }, [isOpen, fetchImages]);

  const handleImageClick = (e, image) => {
    e.stopPropagation();
    console.log('Image clicked:', image.name, image.fileId);
    setSelectedImage(image);
  };

  const handleSelectConfirm = (e) => {
    e.stopPropagation();
    console.log('Select button clicked, selectedImage:', selectedImage);
    if (selectedImage && onSelect) {
      console.log('Calling onSelect with URL:', selectedImage.url);
      onSelect(selectedImage.url);
      onClose();
      setSelectedImage(null);
    } else {
      console.warn('Cannot select: selectedImage or onSelect missing', { selectedImage, onSelect });
    }
  };

  const handleRefresh = () => {
    fetchImages();
    setCurrentPage(1);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result; // Full data URL including prefix
          
          const authHeader = btoa(`${IMAGEKIT_PRIVATE_KEY}:`);
          
          // Create FormData for multipart upload
          const formData = new FormData();
          formData.append('file', base64Data);
          formData.append('fileName', file.name);
          formData.append('folder', '/mommy-first');
          formData.append('useUniqueFileName', 'true');
          
          // Use the upload API with FormData
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
            throw new Error(errorData.message || 'Failed to upload image');
          }

          const uploadedImage = await response.json();
          console.log('Image uploaded successfully:', uploadedImage);
          
          // Refresh the image list
          await fetchImages();
          setCurrentPage(1);
          setError(null);
          
        } catch (err) {
          console.error('Error uploading image:', err);
          setError(`Failed to upload image: ${err.message}`);
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(`Failed to upload image: ${err.message}`);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Filter images based on search query
  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="imagekit-modal-overlay" onClick={onClose}>
      <div className="imagekit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="imagekit-modal-header">
          <h3>Choose Image</h3>
          <button className="imagekit-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="imagekit-toolbar">
          <div className="imagekit-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="imagekit-actions">
            <button 
              className="imagekit-upload-btn" 
              onClick={handleUploadClick}
              disabled={uploading}
              title="Upload to Mommy First folder"
            >
              {uploading ? <Loader className="spinning" size={18} /> : <Upload size={18} />}
              <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button className="imagekit-refresh-btn" onClick={handleRefresh} title="Refresh">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="imagekit-content">
          {loading ? (
            <div className="imagekit-loading">
              <Loader className="spinning" size={40} />
              <p>Loading images...</p>
            </div>
          ) : error ? (
            <div className="imagekit-error">
              <p>{error}</p>
              <button onClick={handleRefresh}>Retry</button>
            </div>
          ) : (
            <div className="imagekit-list">
              {paginatedImages.map((image) => (
                <div
                  key={image.fileId}
                  className={`imagekit-list-item ${selectedImage?.fileId === image.fileId ? 'selected' : ''}`}
                  onClick={(e) => handleImageClick(e, image)}
                >
                  <div className="imagekit-list-thumbnail">
                    <img
                      src={`${image.url}?tr=w-80,h-80,fo-auto`}
                      alt={image.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="imagekit-list-info">
                    <span className="imagekit-list-name">{image.name}</span>
                    <span className="imagekit-list-path">{image.filePath}</span>
                  </div>
                  <div className="imagekit-list-meta">
                    <span className="imagekit-list-date">
                      <Calendar size={14} />
                      {formatDate(image.createdAt)}
                    </span>
                  </div>
                </div>
              ))}

              {paginatedImages.length === 0 && (
                <div className="imagekit-empty">
                  <FileImage size={48} />
                  <p>No images found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="imagekit-pagination">
            <button 
              className="imagekit-page-btn" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="imagekit-page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="imagekit-page-btn" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {selectedImage && (
          <div className="imagekit-preview-bar">
            <div className="imagekit-preview-info">
              <img
                src={`${selectedImage.url}?tr=w-60,h-60,fo-auto`}
                alt={selectedImage.name}
              />
              <div className="imagekit-preview-details">
                <span className="imagekit-preview-name">{selectedImage.name}</span>
                <span className="imagekit-preview-url">{selectedImage.url}</span>
              </div>
            </div>
            <button className="imagekit-select-btn" onClick={handleSelectConfirm}>
              Select Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageKitBrowser;
