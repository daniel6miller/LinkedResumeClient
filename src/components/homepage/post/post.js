// post.js
import React, { useRef, useState, useEffect } from 'react';
import './post.css';
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import mammoth from "mammoth";  // Import mammoth

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Post({ onClose }) {
  const [postText, setPostText] = useState(''); 
  const [files, setFiles] = useState([]); 
  const [filePreviews, setFilePreviews] = useState([]); // Store an array of file preview URLs
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0); // Track current preview index
  const userId = sessionStorage.getItem('_id');
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  const profilePhotoCrop = sessionStorage.getItem('profilePhotoCrop');
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  
      for (const file of selectedFiles) {
        try {
          if (file.type === "application/pdf") {
            const pdfPreview = await generatePdfPreview(file);
            setFilePreviews((prevPreviews) => [...prevPreviews, pdfPreview]);
          } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // For .docx files, just store the file name
            setFilePreviews((prevPreviews) => [...prevPreviews, file.name]);
          } else if (file.type.startsWith("image/")) {
            const filePreview = URL.createObjectURL(file);
            setFilePreviews((prevPreviews) => [...prevPreviews, filePreview]);
          } else {
            console.warn("Unsupported file type:", file.type);
          }
        } catch (error) {
          console.error("Error generating preview for file:", file.name, error);
        }
      }
    }
  };

  const generatePdfPreview = async (file) => {
    const fileReader = new FileReader();
  
    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const pdfData = new Uint8Array(fileReader.result);
          const pdfDocument = await pdfjsLib.getDocument(pdfData).promise;
          const firstPage = await pdfDocument.getPage(1);
  
          const scale = 1.5; // Increase scaling for better readability
          const viewport = firstPage.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
  
          canvas.width = viewport.width;
          canvas.height = viewport.height;
  
          await firstPage.render({ canvasContext: context, viewport }).promise;
  
          resolve(canvas.toDataURL("image/png")); // Return as image URL
        } catch (error) {
          console.error("Error generating PDF preview:", error);
          reject(error);
        }
      };
  
      fileReader.readAsArrayBuffer(file); // Read as ArrayBuffer
    });
  };

  const generateDocxPreview = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
      mammoth.extractRawText({ arrayBuffer })
        .then((result) => {
          // Extract the first few lines or the first paragraph
          const textPreview = result.value.slice(0, 200); // Show first 200 characters of text
          resolve(textPreview);
        })
        .catch(reject);
    });
  };
  
  const handlePost = async () => {
    if (files.length === 0 && !postText) {
      console.log('No content to post');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file)); // Append all files
    formData.append('userId', userId);
    formData.append('text', postText);

    console.log(userId, postText, files);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post/create-post`, {
        method: 'POST',
        body: formData, 
      });
      if (!response.ok) {
        throw new Error('Server responded with an error.');
      }
      const data = await response.json();
      console.log(data);
      // Reset form and close modal
      setPostText('');
      setFiles([]);
      setFilePreviews([]);
      setCurrentPreviewIndex(0);
      fileInputRef.current.value = null; // Reset the file input

      onClose(); // Close the modal
      window.location.reload();
    } catch (error) {
      console.error('Post submission failed:', error);
    }
  };

  const showPreviousPreview = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex((prevIndex) => prevIndex - 1);
    }
  };
  
  const showNextPreview = () => {
    if (currentPreviewIndex < filePreviews.length - 1) {
      setCurrentPreviewIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="post-modal">
      <button className="post-close-button" onClick={onClose}>X</button>
      <div className="post-left">
        <div className="post-header">
        <img src={profilePhotoCrop} alt="profile" className="profile-pic" />
          <div className="header-info">
            <span className="post-to">{firstName} {lastName}</span>
            <span className="post-to-anyone">Post to Anyone</span>
          </div>
        </div>
        <textarea
          className="post-textarea"
          placeholder="What do you want to talk about?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        <button className="post-button" onClick={handlePost}>Post</button>
      </div>
      <div className="post-right">
        <button className="post-attach-button" onClick={handleFileInputClick}>
          Attach
        </button>
        <div className="file-preview-container">
          {filePreviews.length > 0 && (
            <div className="file-preview-wrapper">
              { typeof filePreviews[currentPreviewIndex]?.startsWith("blob:") ? (
                <img
                  src={filePreviews[currentPreviewIndex]}
                  alt={`Preview ${currentPreviewIndex + 1}`}
                  className="file-preview"
                />
              ) : typeof filePreviews[currentPreviewIndex] === "string" && filePreviews[currentPreviewIndex].endsWith(".docx") ? (
                // Display file name for .docx files
                <p className="docx-preview">{filePreviews[currentPreviewIndex]}</p>
              ) : typeof filePreviews[currentPreviewIndex] === "string" ? (
                // Display text preview for .docx files (non-PDF text)
                <p className="docx-preview">{filePreviews[currentPreviewIndex]}</p>
              ) : (
                // Display image or PDF preview as an image
                <img
                  src={filePreviews[currentPreviewIndex]}
                  alt={`Preview ${currentPreviewIndex + 1}`}
                  className="file-preview"
                />
              )}
              <div className="file-preview-controls">
                {currentPreviewIndex > 0 && (
                  <button className="prev-button" onClick={showPreviousPreview}>←</button>
                )}
                {currentPreviewIndex < filePreviews.length - 1 && (
                  <button className="next-button" onClick={showNextPreview}>→</button>
                )}
              </div>
              <div className="file-preview-indicator">
                {currentPreviewIndex + 1} of {filePreviews.length}
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="application/pdf, application/vnd.ms-excel, image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
        />
      </div>
    </div>
  );
}


export default Post;

