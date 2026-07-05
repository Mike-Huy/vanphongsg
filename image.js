/**
 * VĂN PHÒNG SÀI GÒN - Image Editor Module
 * File: image.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initImageEditor();
});

function initImageEditor() {
    const dropzone = document.getElementById('image-dropzone');
    const fileInput = document.getElementById('image-file-input');
    const btnUploadTrigger = document.getElementById('btn-image-upload-trigger');
    const canvasContainer = document.getElementById('canvas-container');
    const canvas = document.getElementById('editor-canvas');
    const ctx = canvas.getContext('2d');

    // Controls
    const sliderBrightness = document.getElementById('slider-brightness');
    const sliderContrast = document.getElementById('slider-contrast');
    const sliderGrayscale = document.getElementById('slider-grayscale');
    const sliderBlur = document.getElementById('slider-blur');
    
    const valBrightness = document.getElementById('val-brightness');
    const valContrast = document.getElementById('val-contrast');
    const valGrayscale = document.getElementById('val-grayscale');
    const valBlur = document.getElementById('val-blur');

    const btnRotateLeft = document.getElementById('btn-rotate-left');
    const btnRotateRight = document.getElementById('btn-rotate-right');
    const btnFlipH = document.getElementById('btn-flip-h');
    const btnFlipV = document.getElementById('btn-flip-v');

    const drawToolSelect = document.getElementById('draw-tool-select');
    const drawColor = document.getElementById('draw-color');
    const drawSize = document.getElementById('draw-size');
    const textInputGroup = document.getElementById('text-insert-input-group');
    const textContentInput = document.getElementById('image-text-content');

    const btnReset = document.getElementById('btn-image-reset');
    const btnDownload = document.getElementById('btn-image-download');

    let originalImage = null; // Image object
    let rotation = 0; // 0, 90, 180, 270 degrees
    let flipH = 1; // 1 or -1
    let flipV = 1; // 1 or -1
    
    // Annotation state
    let drawings = []; // List of all persistent drawings
    let currentStroke = null;
    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    if (!canvas) return;

    // Trigger File Input Click
    dropzone.addEventListener('click', () => fileInput.click());
    btnUploadTrigger.addEventListener('click', () => fileInput.click());

    // Drag-drop files
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#0066cc';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '#cee0f2';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#cee0f2';
        if (e.dataTransfer.files.length > 0) {
            loadImageFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            loadImageFile(e.target.files[0]);
        }
    });

    // Toggle text input group when text tool is selected
    drawToolSelect.addEventListener('change', (e) => {
        if (e.target.value === 'text') {
            textInputGroup.style.display = 'block';
        } else {
            textInputGroup.style.display = 'none';
        }
    });

    function loadImageFile(file) {
        if (!file.type.startsWith('image/')) {
            window.showToast('Vui lòng chọn tệp tin hình ảnh hợp lệ!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                resetToDefaults();
                
                // Show canvas container, hide dropzone
                dropzone.style.display = 'none';
                canvasContainer.style.display = 'flex';
                
                // Initialize canvas dimensions
                setupCanvasDimensions();
                renderImage();
                window.showToast('Đã tải hình ảnh lên thành công!');
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function setupCanvasDimensions() {
        if (!originalImage) return;
        // Standardise max size for editing to avoid huge lags
        const maxDimension = 1200;
        let w = originalImage.width;
        let h = originalImage.height;

        if (w > maxDimension || h > maxDimension) {
            if (w > h) {
                h = Math.round((h * maxDimension) / w);
                w = maxDimension;
            } else {
                w = Math.round((w * maxDimension) / h);
                h = maxDimension;
            }
        }

        // Adjust dimensions if rotated 90 or 270 degrees
        if (rotation === 90 || rotation === 270) {
            canvas.width = h;
            canvas.height = w;
        } else {
            canvas.width = w;
            canvas.height = h;
        }
    }

    function resetToDefaults() {
        rotation = 0;
        flipH = 1;
        flipV = 1;
        drawings = [];
        currentStroke = null;
        isDrawing = false;
        
        // Reset sliders
        sliderBrightness.value = 100;
        sliderContrast.value = 100;
        sliderGrayscale.value = 0;
        sliderBlur.value = 0;

        // Reset values
        valBrightness.textContent = '100%';
        valContrast.textContent = '100%';
        valGrayscale.textContent = '0%';
        valBlur.textContent = '0px';

        drawToolSelect.value = 'none';
        textInputGroup.style.display = 'none';
    }

    // Sliders input events
    const updateFilterValues = () => {
        valBrightness.textContent = `${sliderBrightness.value}%`;
        valContrast.textContent = `${sliderContrast.value}%`;
        valGrayscale.textContent = `${sliderGrayscale.value}%`;
        valBlur.textContent = `${sliderBlur.value}px`;
        renderImage();
    };

    sliderBrightness.addEventListener('input', updateFilterValues);
    sliderContrast.addEventListener('input', updateFilterValues);
    sliderGrayscale.addEventListener('input', updateFilterValues);
    sliderBlur.addEventListener('input', updateFilterValues);

    // Rotation and Flips
    btnRotateLeft.addEventListener('click', () => {
        rotation = (rotation - 90 + 360) % 360;
        setupCanvasDimensions();
        renderImage();
    });

    btnRotateRight.addEventListener('click', () => {
        rotation = (rotation + 90) % 360;
        setupCanvasDimensions();
        renderImage();
    });

    btnFlipH.addEventListener('click', () => {
        flipH = flipH === 1 ? -1 : 1;
        renderImage();
    });

    btnFlipV.addEventListener('click', () => {
        flipV = flipV === 1 ? -1 : 1;
        renderImage();
    });

    btnReset.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn khôi phục ảnh về trạng thái ban đầu?')) {
            resetToDefaults();
            setupCanvasDimensions();
            renderImage();
            window.showToast('Đã khôi phục ảnh gốc.', 'warning');
        }
    });

    // Render Canvas
    function renderImage() {
        if (!originalImage) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // 1. Position & Translate for rotates and flips
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(flipH, flipV);
        ctx.rotate((rotation * Math.PI) / 180);

        // Calculate original dims
        const maxDimension = 1200;
        let imgW = originalImage.width;
        let imgH = originalImage.height;
        if (imgW > maxDimension || imgH > maxDimension) {
            if (imgW > imgH) {
                imgH = Math.round((imgH * maxDimension) / imgW);
                imgW = maxDimension;
            } else {
                imgW = Math.round((imgW * maxDimension) / imgH);
                imgH = maxDimension;
            }
        }

        // 2. Set filters on image drawing
        const brightnessVal = sliderBrightness.value;
        const contrastVal = sliderContrast.value;
        const grayscaleVal = sliderGrayscale.value;
        const blurVal = sliderBlur.value;

        ctx.filter = `brightness(${brightnessVal}%) contrast(${contrastVal}%) grayscale(${grayscaleVal}%) blur(${blurVal}px)`;
        
        // Draw centered image
        ctx.drawImage(originalImage, -imgW / 2, -imgH / 2, imgW, imgH);
        
        ctx.restore(); // Restore to normal context (clears rotation translation and filters)

        // 3. Draw annotations on top (without photo filters)
        drawAllAnnotations();
    }

    // Draw persistent annotations
    function drawAllAnnotations() {
        drawings.forEach(draw => {
            drawSingleAnnotation(draw);
        });

        // Draw active drawing stroke/rect if exists
        if (currentStroke) {
            drawSingleAnnotation(currentStroke);
        }
    }

    function drawSingleAnnotation(draw) {
        ctx.strokeStyle = draw.color;
        ctx.fillStyle = draw.color;
        ctx.lineWidth = draw.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (draw.type === 'pen' && draw.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(draw.points[0].x, draw.points[0].y);
            for (let i = 1; i < draw.points.length; i++) {
                ctx.lineTo(draw.points[i].x, draw.points[i].y);
            }
            ctx.stroke();
        } else if (draw.type === 'rect') {
            ctx.strokeRect(draw.x, draw.y, draw.w, draw.h);
        } else if (draw.type === 'text') {
            ctx.font = `bold ${draw.size * 3}px Tahoma, sans-serif`;
            ctx.textBaseline = 'top';
            ctx.fillText(draw.text, draw.x, draw.y);
        }
    }

    // Get exact canvas coordinates from mouse click
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    // Canvas drawing mouse events
    canvas.addEventListener('mousedown', (e) => {
        const tool = drawToolSelect.value;
        if (tool === 'none') return;

        const coords = getCanvasCoordinates(e);
        isDrawing = true;
        startX = coords.x;
        startY = coords.y;

        if (tool === 'pen') {
            currentStroke = {
                type: 'pen',
                color: drawColor.value,
                size: parseInt(drawSize.value) || 5,
                points: [coords]
            };
        } else if (tool === 'rect') {
            currentStroke = {
                type: 'rect',
                color: drawColor.value,
                size: parseInt(drawSize.value) || 5,
                x: startX,
                y: startY,
                w: 0,
                h: 0
            };
        } else if (tool === 'text') {
            const txt = textContentInput.value.trim();
            if (!txt) {
                window.showToast('Vui lòng nhập nội dung chữ cần chèn ở menu bên trái!', 'warning');
                isDrawing = false;
                return;
            }
            drawings.push({
                type: 'text',
                color: drawColor.value,
                size: parseInt(drawSize.value) || 5,
                text: txt,
                x: coords.x,
                y: coords.y
            });
            isDrawing = false;
            renderImage();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing || !currentStroke) return;

        const coords = getCanvasCoordinates(e);
        const tool = drawToolSelect.value;

        if (tool === 'pen') {
            currentStroke.points.push(coords);
            renderImage();
        } else if (tool === 'rect') {
            currentStroke.w = coords.x - startX;
            currentStroke.h = coords.y - startY;
            renderImage();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (!isDrawing) return;
        isDrawing = false;
        
        if (currentStroke) {
            drawings.push(currentStroke);
            currentStroke = null;
            renderImage();
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (isDrawing && currentStroke) {
            drawings.push(currentStroke);
            currentStroke = null;
            renderImage();
        }
        isDrawing = false;
    });

    // Download Image
    btnDownload.addEventListener('click', () => {
        if (!originalImage) return;

        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `AnhDaChinhSua_${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);

        window.showToast('Đang tải hình ảnh xuống...');
    });
}
