import React, { useState, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CropModal = ({ onClose, coverPhoto }) => {
    const userId = sessionStorage.getItem('_id');
    const src = encodeURI(coverPhoto);
    // Set initial crop to cover the full image (no crop applied yet)
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100, minHeight: 5, minWidth: 5 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [displayDimensions, setDisplayDimensions] = useState({width: 0, height: 0}); // Store the dimensions here

    function onImageLoad(e) {
        console.log("Image Loaded");
        const { naturalWidth, naturalHeight, clientWidth, clientHeight } = e.target;  // Access clientWidth and clientHeight directly from the event target
        setDisplayDimensions({width: clientWidth, height: clientHeight}); 
    
        const crop = centerCrop(
            makeAspectCrop(
                { unit: '%', width: 90, minHeight: 5, minWidth: 5 },
                21 / 9,
                naturalWidth,
                naturalHeight
            ),
            naturalWidth,
            naturalHeight,
        );
      
        setCrop(crop);
        console.log(crop);
    }

    const handleCompleteCrop = useCallback((crop) => {
        console.log(crop);
        setCompletedCrop(crop);
    }, []);

    async function handleSaveClick() {
        if (completedCrop) {
            getCroppedImg(completedCrop, displayDimensions);
        } else {
            // If no crop was made, use the default crop values
            const defaultCrop = { x: 0, y: 0, width: 100, height: 100 };
            getCroppedImg(defaultCrop, displayDimensions);
        }
    }

    const handleCropChange = useCallback((newCrop) => {
        // Enforce minimum dimensions
        const updatedCrop = {
            ...newCrop,
            width: Math.max(newCrop.width, 5),  // Use 5% as the minimum width
            height: Math.max(newCrop.height, 5)  // Use 5% as the minimum height
        };
        setCrop(updatedCrop);
    }, []);


    const getCroppedImg = useCallback((pixelCrop, {width, height}) => {
        const image = new Image();
        image.crossOrigin = "anonymous"; // Ensure CORS compliance if fetching from another domain.
        image.src = src; // The source image loaded into the crop tool.
    
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Calculate the scale factors for the natural image dimensions.
            const scaleX = image.naturalWidth / width;
            const scaleY = image.naturalHeight / height;
            console.log( scaleX, scaleY );
    
            // Set the canvas dimensions to match the scaled crop dimensions.
            canvas.width = pixelCrop.width * scaleX;
            canvas.height = pixelCrop.height * scaleY;
    
            // Draw the cropped image portion onto the canvas.
            ctx.drawImage(
                image,
                pixelCrop.x * scaleX,  // Scale crop x-coordinate to natural dimensions.
                pixelCrop.y * scaleY,  // Scale crop y-coordinate to natural dimensions.
                pixelCrop.width * scaleX,  // Scale crop width to natural dimensions.
                pixelCrop.height * scaleY,  // Scale crop height to natural dimensions.
                0,  // Draw at 0 x-coordinate on canvas.
                0,  // Draw at 0 y-coordinate on canvas.
                canvas.width,  // Use canvas width for drawing.
                canvas.height  // Use canvas height for drawing.
            );
    
            // Convert the canvas to a Blob and then handle the upload.
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                uploadCroppedImage(blob);  // Handle the blob upload function.
            }, 'image/jpeg');
        };
    }, [src]); 

    const uploadCroppedImage = async (blob) => {
        const formData = new FormData();
        formData.append('coverPhotoCrop', blob, 'cropped-image.jpg');
        console.log("formData",formData);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/cover-photo-crop`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload cropped image.');
            }
            const data = await response.json();
            sessionStorage.setItem('coverPhotoCrop', data.user.coverPhotoCrop);
            onClose(data.croppedImageUrl);
        } catch (error) {
            console.error('Error uploading cropped image:', error);
        }
    };

    return (
        <div className="crop-modal-backdrop" onClick={() => onClose(null)}>
            <div className="crop-modal-container" onClick={e => e.stopPropagation()}>
                <button className="crop-modal-close-button" onClick={() => onClose(null)}>X</button>
                <div>
                    <ReactCrop
                        src={src}
                        crop={crop}
                        aspect={21 / 9}
                        keepSelection= {true}
                        onLoad={onImageLoad}
                        onComplete={handleCompleteCrop}
                        onChange={handleCropChange}
                        crossOrigin="anonymous"
                    >
                    <img src={src} crop={crop} onLoad={onImageLoad} onChange={handleCropChange} onComplete={handleCompleteCrop} />
                    </ReactCrop>
                </div>
                <button className="crop-modal-save-button" onClick={handleSaveClick}>Save Photo</button>
            </div>
        </div>
    );
};

export default CropModal;

