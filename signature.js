/**
 * VĂN PHÒNG SÀI GÒN - e-Signature Creator Module
 * File: signature.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initSignaturePad();
    initTextSignature();
});

// Persistent strokes for Undo
let signatureStrokes = [];

function initSignaturePad() {
    const canvas = document.getElementById('signature-pad');
    const placeholder = document.getElementById('sig-pad-placeholder');
    const colorPicker = document.getElementById('sig-color');
    const widthSelect = document.getElementById('sig-width');
    const btnClear = document.getElementById('btn-sig-clear');
    const btnUndo = document.getElementById('btn-sig-undo');
    const btnDownload = document.getElementById('btn-sig-download');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentStroke = null;

    // Set canvas dimensions based on CSS display size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        // Only resize if different to prevent endless loops
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
            // Save current drawing data first
            const tempStrokes = [...signatureStrokes];
            
            canvas.width = rect.width || 400;
            canvas.height = rect.height || 180;
            
            signatureStrokes = tempStrokes;
            redrawSignature();
        }
    }

    // Export resize globally so app.js can call it when section is shown
    window.resizeSignatureCanvas = resizeCanvas;
    
    // Initial resize call
    setTimeout(resizeCanvas, 100);
    window.addEventListener('resize', resizeCanvas);

    // Drawing options helper
    function setContextStyles(strokeColor, strokeWidth) {
        ctx.strokeStyle = strokeColor || colorPicker.value;
        ctx.lineWidth = strokeWidth || parseInt(widthSelect.value);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function redrawSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (signatureStrokes.length === 0) {
            placeholder.style.display = 'block';
            return;
        }

        placeholder.style.display = 'none';

        signatureStrokes.forEach(stroke => {
            ctx.beginPath();
            setContextStyles(stroke.color, stroke.width);
            
            if (stroke.points.length > 0) {
                ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
                for (let i = 1; i < stroke.points.length; i++) {
                    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
                }
                ctx.stroke();
            }
        });
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        // Account for touch events vs mouse events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        placeholder.style.display = 'none';
        
        const pos = getMousePos(e);
        currentStroke = {
            color: colorPicker.value,
            width: parseInt(widthSelect.value),
            points: [pos]
        };
        
        ctx.beginPath();
        setContextStyles(currentStroke.color, currentStroke.width);
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing || !currentStroke) return;
        e.preventDefault();
        
        const pos = getMousePos(e);
        currentStroke.points.push(pos);
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        
        if (currentStroke && currentStroke.points.length > 1) {
            signatureStrokes.push(currentStroke);
        }
        currentStroke = null;
        redrawSignature();
    }

    // Mouse Events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    // Touch Events for iPad/Mobile
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    window.addEventListener('touchend', stopDrawing);

    // Clear Signature
    btnClear.addEventListener('click', () => {
        signatureStrokes = [];
        redrawSignature();
        window.showToast('Đã xóa chữ ký vẽ tay.', 'warning');
    });

    // Undo last stroke
    btnUndo.addEventListener('click', () => {
        if (signatureStrokes.length > 0) {
            signatureStrokes.pop();
            redrawSignature();
            window.showToast('Đã hoàn tác nét ký cuối.');
        } else {
            window.showToast('Không có nét ký nào để hoàn tác!', 'warning');
        }
    });

    // Download Signature PNG
    btnDownload.addEventListener('click', () => {
        if (signatureStrokes.length === 0) {
            window.showToast('Hãy vẽ chữ ký trước khi tải xuống!', 'warning');
            return;
        }

        // Export directly with transparent background
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ChuKyTay_VPSG_${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);

        window.showToast('Đang tải xuống tệp chữ ký vẽ tay...');
    });
}

function initTextSignature() {
    const textInput = document.getElementById('sig-text-input');
    const p1 = document.getElementById('sig-p1');
    const p2 = document.getElementById('sig-p2');
    const p3 = document.getElementById('sig-p3');
    const p4 = document.getElementById('sig-p4');
    const btnDownloads = document.querySelectorAll('.btn-download-text-sig');

    if (!textInput) return;

    const updatePreviews = () => {
        const text = textInput.value.trim() || 'Chu ky mau';
        p1.textContent = text;
        p2.textContent = text;
        p3.textContent = text;
        p4.textContent = text;
    };

    // Update on type
    textInput.addEventListener('input', updatePreviews);

    // Download text signature
    btnDownloads.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const previewEl = document.getElementById(targetId);
            const text = previewEl.textContent;
            
            // Map targetId to corresponding Google Font
            let fontName = "'Alex Brush', cursive";
            if (targetId === 'sig-p2') fontName = "'Dancing Script', cursive";
            else if (targetId === 'sig-p3') fontName = "'Great Vibes', cursive";
            else if (targetId === 'sig-p4') fontName = "'Pacifico', cursive";

            downloadTextSignatureAsPng(text, fontName);
        });
    });
}

// Generate transparent PNG image from cursive Google font client-side
function downloadTextSignatureAsPng(text, fontName) {
    // Create temporary offscreen canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set temporary sizing to measure font dimensions
    tempCtx.font = `bold 60px ${fontName}`;
    const textMetrics = tempCtx.measureText(text);
    
    const textWidth = Math.ceil(textMetrics.width) || 300;
    const textHeight = 100;
    
    // Add safety margins
    tempCanvas.width = textWidth + 60;
    tempCanvas.height = textHeight + 40;

    // Render with transparent background
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Set fonts and styling
    tempCtx.font = `bold 60px ${fontName}`;
    tempCtx.fillStyle = '#0000ff'; // Elegant blue sign ink
    tempCtx.textBaseline = 'middle';
    tempCtx.textAlign = 'center';
    
    // Draw text centered
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
    
    // Download
    const dataURL = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ChuKyTen_${text.replace(/\s+/g, '_')}_VPSG.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);

    window.showToast('Đang tải xuống mẫu chữ ký tên...');
}
