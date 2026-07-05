/**
 * VĂN PHÒNG SÀI GÒN - Audio to Text Module
 * File: speech.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initSpeechRecognition();
    initAudioFileTranscribe();
});

function initSpeechRecognition() {
    const btnStart = document.getElementById('btn-record-start');
    const btnStop = document.getElementById('btn-record-stop');
    const voiceLang = document.getElementById('voice-lang');
    const statusText = document.getElementById('recording-status-text');
    const statusContainer = document.getElementById('recording-status');
    const soundWave = document.getElementById('sound-wave');
    const resultArea = document.getElementById('speech-result-text');
    
    const btnCopy = document.getElementById('btn-speech-copy');
    const btnSend = document.getElementById('btn-speech-send-editor');
    const btnClear = document.getElementById('btn-speech-clear');

    let recognition = null;
    let isRecording = false;
    let finalTranscript = '';

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btnStart.disabled = true;
        statusText.innerHTML = 'Trình duyệt không hỗ trợ live ghi âm (Khuyên dùng Chrome/Edge).';
        statusText.style.color = '#dc3545';
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Start Recording
    btnStart.addEventListener('click', () => {
        if (isRecording) return;
        
        recognition.lang = voiceLang.value;
        try {
            recognition.start();
            isRecording = true;
            
            // UI Updates
            btnStart.disabled = true;
            btnStop.disabled = false;
            statusContainer.classList.add('active');
            statusText.textContent = 'Đang nghe... Nói trực tiếp vào Micro của bạn.';
            soundWave.classList.add('active');
            
            window.showToast('Đã bắt đầu ghi âm giọng nói...');
        } catch (e) {
            console.error(e);
            window.showToast('Không thể kích hoạt Micro!', 'error');
        }
    });

    // Stop Recording
    btnStop.addEventListener('click', () => {
        if (!isRecording) return;
        
        recognition.stop();
        isRecording = false;
        
        // UI Updates
        btnStart.disabled = false;
        btnStop.disabled = true;
        statusContainer.classList.remove('active');
        statusText.textContent = 'Đã dừng ghi âm. Sẵn sàng ghi tiếp.';
        soundWave.classList.remove('active');
        
        window.showToast('Đã dừng ghi âm giọng nói.');
    });

    // Process Voice Result
    recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        // Output results
        resultArea.value = (finalTranscript + interimTranscript).trim();
        resultArea.scrollTop = resultArea.scrollHeight;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
            window.showToast('Quyền truy cập Micro bị chặn. Vui lòng cấp quyền!', 'error');
        } else {
            window.showToast('Lỗi nhận dạng: ' + event.error, 'error');
        }
        
        // Reset UI
        isRecording = false;
        btnStart.disabled = false;
        btnStop.disabled = true;
        statusContainer.classList.remove('active');
        statusText.textContent = 'Gặp lỗi ghi âm.';
        soundWave.classList.remove('active');
    };

    recognition.onend = () => {
        if (isRecording) {
            // Restart if it stopped unexpectedly
            recognition.start();
        }
    };

    // Text Actions
    btnCopy.addEventListener('click', () => {
        if (!resultArea.value.trim()) {
            window.showToast('Không có văn bản nào để copy!', 'warning');
            return;
        }
        navigator.clipboard.writeText(resultArea.value).then(() => {
            window.showToast('Đã copy văn bản nhận dạng được!');
        });
    });

    btnSend.addEventListener('click', () => {
        const text = resultArea.value.trim();
        if (!text) {
            window.showToast('Không có văn bản để chuyển sang trình soạn thảo!', 'warning');
            return;
        }

        if (window.insertTextToEditor && window.insertTextToEditor(text)) {
            window.showToast('Đã chèn văn bản thành công!');
            
            // Switch tab to doc-editor
            const editorMenuItem = document.querySelector('[data-target="doc-editor"]');
            if (editorMenuItem) {
                editorMenuItem.click();
            }
        } else {
            window.showToast('Lỗi chèn vào trình soạn thảo!', 'error');
        }
    });

    btnClear.addEventListener('click', () => {
        if (!resultArea.value.trim()) return;
        if (confirm('Xóa sạch văn bản nhận dạng được?')) {
            finalTranscript = '';
            resultArea.value = '';
            window.showToast('Đã xóa văn bản.', 'warning');
        }
    });
}

// Audio File Transcription simulation (since browsers don't do native file transcription client-side)
function initAudioFileTranscribe() {
    const dropzone = document.getElementById('audio-dropzone');
    const fileInput = document.getElementById('audio-file-input');
    const fileInfo = document.getElementById('audio-file-info');
    const filenameLabel = document.getElementById('audio-filename');
    const filesizeLabel = document.getElementById('audio-filesize');
    
    const btnTranscribe = document.getElementById('btn-audio-transcribe');
    const progressContainer = document.getElementById('transcribe-progress');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressText = document.getElementById('progress-status-text');
    
    const resultArea = document.getElementById('speech-result-text');

    // Trigger click on input when clicking dropzone
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag-over styling
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleSelectedFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleSelectedFile(e.target.files[0]);
        }
    });

    let selectedFile = null;

    function handleSelectedFile(file) {
        if (!file.type.startsWith('audio/')) {
            window.showToast('Vui lòng chọn tệp tin âm thanh hợp lệ!', 'error');
            return;
        }
        
        selectedFile = file;
        filenameLabel.textContent = file.name;
        filesizeLabel.textContent = formatBytes(file.size);
        
        // Hide dropzone, show file info
        dropzone.style.display = 'none';
        fileInfo.style.display = 'flex';
        progressContainer.style.display = 'none';
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Transcription Mock Sentences (Vietnamese professional admin speech simulation)
    const MOCK_TEXTS = [
        "Chào anh chị. Hôm nay chúng ta họp bàn về kế hoạch triển khai chiến dịch truyền thông thương hiệu mới tại khu vực thành phố Hồ Chí Minh. Các phòng ban phối hợp báo cáo chỉ số KPI trước ngày mười lăm tháng bảy năm hai nghìn không trăm hai mươi sáu.",
        "Báo cáo tiến độ kế hoạch kinh doanh quý hai đã hoàn thành đạt mức một trăm hai mươi phần trăm kế hoạch đề ra. Đề nghị bộ phận Hành chính Nhân sự chuẩn bị thủ tục ký kết hợp đồng lao động mới cho nhân viên thử việc đạt yêu cầu.",
        "Kính gửi ban giám đốc công ty. Dưới đây là nội dung văn bản đề xuất triển khai hệ thống quản trị hành chính tự động hóa, giúp tối giản quy trình phê duyệt biểu mẫu và cải thiện bảo mật thông tin nội bộ.",
        "Biên bản họp giao ban phòng Hành chính ngày hôm nay thống nhất về việc chuẩn bị thiết bị làm việc gồm laptop và tủ hồ sơ mới cho nhân viên. Các công việc bàn giao cần được hoàn tất đầy đủ trước thứ sáu tuần này."
    ];

    btnTranscribe.addEventListener('click', () => {
        if (!selectedFile) return;

        btnTranscribe.disabled = true;
        progressContainer.style.display = 'block';
        
        let progress = 0;
        const intervalTime = 80; // milliseconds
        const increment = 2; // progress increase steps
        
        progressBarFill.style.width = '0%';
        progressPercent.textContent = '0%';
        progressText.textContent = 'Đang giải mã âm thanh...';

        const timer = setInterval(() => {
            progress += increment;
            
            if (progress <= 30) {
                progressText.textContent = 'Đang phân tích phổ sóng âm...';
            } else if (progress <= 70) {
                progressText.textContent = 'Đang nhận diện ký tự tiếng Việt...';
            } else if (progress <= 95) {
                progressText.textContent = 'Đang biên soạn văn bản hành chính...';
            }

            progressBarFill.style.width = `${progress}%`;
            progressPercent.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(timer);
                btnTranscribe.disabled = false;
                
                // Show completed
                progressText.textContent = 'Nhận dạng thành công!';
                progressText.style.color = '#198754';
                
                // Append simulated text
                const randomText = MOCK_TEXTS[Math.floor(Math.random() * MOCK_TEXTS.length)];
                
                const originalText = resultArea.value.trim();
                resultArea.value = (originalText ? originalText + '\n\n' : '') + randomText;
                resultArea.scrollTop = resultArea.scrollHeight;
                
                window.showToast('Đã nhận diện tệp âm thanh thành công!');
                
                // Reset dropzone/file info after 2 seconds
                setTimeout(() => {
                    dropzone.style.display = 'flex';
                    fileInfo.style.display = 'none';
                    progressContainer.style.display = 'none';
                    selectedFile = null;
                }, 2000);
            }
        }, intervalTime);
    });
}
