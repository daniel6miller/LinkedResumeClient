// FilePreview.js
import React, { useState, useEffect, useRef } from 'react';
import './filePreview.css';
import * as pdfjsLib from "pdfjs-dist";



function FilePreview({ documents }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(currentIndex);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [pdfCache, setPdfCache] = useState({});
    const [filePreviews, setFilePreviews] = useState([]); // Store an array of file preview URLs
  
    useEffect(() => {
      currentIndexRef.current = currentIndex;
  }, [currentIndex]);

        // Populate filePreviews when documents change
        useEffect(() => {
            const loadFilePreviews = async () => {
                const previews = await Promise.all(
                    documents.map(async (doc) => {
                        const file = doc.amazonS3Link;
                        if (isImage(file)) {
                            return file; // Use image URL directly
                        }
                        if (isPDF(file)) {
                            return await generatePdfPreview(file); // Generate PDF preview
                        }
                        return null; // Unsupported file type
                    })
                );
                setFilePreviews(previews.filter((preview) => preview !== null)); // Filter out null previews
            };
    
            loadFilePreviews();
        }, [documents]);
    
        // Generate a preview for PDFs
        const generatePdfPreview = async (fileUrl) => {
            if (pdfCache[fileUrl]) {
                return pdfCache[fileUrl]; // Use cached preview
            }
            try {
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1 });
    
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
    
                const renderContext = { canvasContext: context, viewport: viewport };
                await page.render(renderContext).promise;
    
                const preview = canvas.toDataURL();
                setPdfCache((prevCache) => ({ ...prevCache, [fileUrl]: preview })); // Cache preview
                return preview;
            } catch (error) {
                console.error("Error rendering PDF preview:", error);
                return null;
            }
        };


  
  
    useEffect(() => {
      // Preload the next and previous images for faster navigation
      if (documents.length > 1) {
          const nextIndex = (currentIndex + 1) % documents.length;
          const prevIndex = (currentIndex - 1 + documents.length) % documents.length;
  
          [nextIndex, prevIndex].forEach((index) => {
              const file = documents[index]?.amazonS3Link;
              if (isImage(file)) {
                  const img = new Image();
                  img.src = file; // Preload image
              }
          });
      }
    }, [currentIndex, documents]);
  
    useEffect(() => {
        if (filePreviews.length > 0 && currentIndex >= 0) {
          if (isPDF(filePreviews[currentIndex])) {
            renderPdfPreview(documents[currentIndex]?.amazonS3Link);
          } else {
            setPdfPreview(null);
          }
        }
      }, [currentIndex, filePreviews]);
      
  
    const renderPdfPreview = async (fileUrl) => {
      if (pdfCache[fileUrl]) {
          setPdfPreview(pdfCache[fileUrl]); // Use cached preview
          return;
      }
  
      try {
          const loadingTask = pdfjsLib.getDocument(fileUrl);
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1); // Render the first page as a preview
          const viewport = page.getViewport({ scale: 1 });
  
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
  
          const renderContext = {
              canvasContext: context,
              viewport: viewport,
          };
  
          await page.render(renderContext).promise;
          const preview = canvas.toDataURL();
          setPdfPreview(preview);
          setPdfCache((prevCache) => ({ ...prevCache, [fileUrl]: preview })); // Cache the preview
      } catch (error) {
          console.error("Error rendering PDF preview:", error);
      }
  };
  
    const showPreviousPreview = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
    };
    
    const showNextPreview = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex < filePreviews.length - 1 ? prevIndex + 1 : prevIndex
        );
    };
  
  
    const currentDocument = documents[currentIndex];
  
    const renderPreview = () => {
        const preview = filePreviews[currentIndex];
        if (!preview) return <p>Unsupported file format or preview loading...</p>;
      
        if (isImage(preview)) {
          return <img src={preview} alt="Document media" className="post-media" />;
        }
      
        if (isPDF(preview)) {
          return (
            <div className="pdf-preview">
              <img src={preview} alt="PDF preview" className="post-media" />
              <a href={documents[currentIndex]?.amazonS3Link} target="_blank" rel="noopener noreferrer">
                View Full PDF
              </a>
            </div>
          );
        }
      
        return <p>Unsupported file format</p>;
      };
      
  
      return (
        <div className="post-document">
          {renderPreview(currentDocument)}
      
          <div className="file-preview-indicator">
            {currentIndex + 1} of {filePreviews.length}
          </div>
      
          <div className="file-preview-controls">
            {currentIndex > 0 && (
              <button className="prev-button" onClick={showPreviousPreview}>←</button>
            )}
            {currentIndex < filePreviews.length - 1 && (
              <button className="next-button" onClick={showNextPreview}>→</button>
            )}
          </div>
        </div>
      );
  }
  
  
  function isImage(file) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      return imageExtensions.some(ext => file.endsWith(`.${ext}`));
  }
  
  function isPDF(file) {
      return file.endsWith('.pdf');
  }
  
  function isDoc(file) {
      return file.endsWith('.doc') || file.endsWith('.docx');
  }

  export default FilePreview;