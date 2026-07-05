/**
 * VĂN PHÒNG SÀI GÒN - Meeting Minutes Module
 * File: meeting.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initMeetingMinutes();
});

const MEETING_TEMPLATES = {
    'hop-giao-ban': {
        title: 'Họp Giao Ban Tuần - Phòng Hành Chính Nhân Sự',
        location: 'Phòng họp lớn / Google Meet',
        agenda: '1. Báo cáo tình hình làm việc tuần qua.\n2. Phổ biến công việc trọng tâm tuần mới.\n3. Giải đáp các vướng mắc của nhân viên.',
        notes: '1. Phòng Nhân sự đã tuyển thêm 2 chuyên viên mới thử việc tuần tới.\n2. Kế hoạch kiểm kê tài sản văn phòng sẽ tiến hành vào ngày Thứ Năm.\n3. Đề nghị mọi người hoàn thành báo cáo tuần trước 17:00 Thứ Sáu.',
        actions: [
            { desc: 'Chuẩn bị phòng làm việc cho nhân viên mới', owner: 'Nguyễn Văn A', deadline: '2026-07-10' },
            { desc: 'Kiểm kê bàn ghế và thiết bị văn phòng', owner: 'Trần Thị B', deadline: '2026-07-09' }
        ]
    },
    'hop-khoi-dong': {
        title: 'Họp Khởi Động Dự Án (Kick-off) - Saigon Office Portal v1.0',
        location: 'Phòng họp dự án / Microsoft Teams',
        agenda: '1. Giới thiệu mục tiêu dự án, phạm vi công việc.\n2. Thống nhất tiến độ (Milestones) và vai trò từng thành viên.\n3. Thảo luận các rủi ro kỹ thuật dự kiến.',
        notes: '1. Mục tiêu: Hoàn tất ứng dụng Văn phòng Sài Gòn trước ngày 30/08.\n2. Vai trò: A (Tech Lead), B (Designer), C (Tester).\n3. Rủi ro: Thời gian nhận diện giọng nói có thể trễ. Giải pháp: Thêm cơ chế xử lý ngoại tuyến.',
        actions: [
            { desc: 'Thiết kế chi tiết giao diện UI/UX', owner: 'Trần Thị B', deadline: '2026-07-15' },
            { desc: 'Cài đặt môi trường code và cấu hình Git', owner: 'Nguyễn Văn A', deadline: '2026-07-12' },
            { desc: 'Xây dựng kịch bản kiểm thử (Test cases)', owner: 'Lê Văn C', deadline: '2026-07-18' }
        ]
    },
    'hop-danh-gia': {
        title: 'Họp Đánh Giá & Rà Soát Định Kỳ Quý II - 2026',
        location: 'Phòng họp Diamond / Zoom',
        agenda: '1. Đánh giá KPI doanh số và hiệu suất công việc Quý II.\n2. Tuyên dương cá nhân xuất sắc.\n3. Đề xuất kế hoạch hành động cải thiện cho Quý III.',
        notes: '1. Hiệu suất toàn phòng đạt 95% mục tiêu đề ra.\n2. Biểu dương Ông Nguyễn Văn A vì nỗ lực hoàn thành xuất sắc hệ thống hành chính.\n3. Một số đầu việc bị trễ hạn do khâu phê duyệt tài liệu còn thủ công.',
        actions: [
            { desc: 'Triển khai công cụ Soạn thảo và Chữ ký số để đẩy nhanh phê duyệt', owner: 'Ban Giám Đốc', deadline: '2026-07-20' },
            { desc: 'Tổ chức tiệc liên hoan quý II cho nhân viên', owner: 'Công đoàn', deadline: '2026-07-16' }
        ]
    }
};

function initMeetingMinutes() {
    const form = document.getElementById('meeting-form');
    const inputTitle = document.getElementById('meet-title');
    const inputDate = document.getElementById('meet-date');
    const inputLocation = document.getElementById('meet-location');
    const inputAttendees = document.getElementById('meet-attendees');
    const inputAgenda = document.getElementById('meet-agenda');
    const inputNotes = document.getElementById('meet-notes');
    
    const templateSelect = document.getElementById('meeting-template-select');
    const btnAddAction = document.getElementById('btn-add-action-item');
    const actionItemsTbody = document.getElementById('action-items-tbody');
    
    const btnClear = document.getElementById('btn-meeting-clear');
    const btnSave = document.getElementById('btn-meeting-save');
    const btnExport = document.getElementById('btn-meeting-export-doc');
    const savedList = document.getElementById('saved-minutes-list');

    if (!form) return;

    // Set default datetime to current local time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    inputDate.value = now.toISOString().slice(0, 16);

    // Initial render of saved meetings
    renderSavedMeetingsList();

    // Template Selector
    templateSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (MEETING_TEMPLATES[val]) {
            const template = MEETING_TEMPLATES[val];
            
            inputTitle.value = template.title;
            inputLocation.value = template.location;
            inputAgenda.value = template.agenda;
            inputNotes.value = template.notes;
            
            // Set current time again
            const t = new Date();
            t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
            inputDate.value = t.toISOString().slice(0, 16);

            // Rebuild actions table
            actionItemsTbody.innerHTML = '';
            template.actions.forEach(act => {
                addActionRow(act.desc, act.owner, act.deadline);
            });

            window.showToast('Đã tải mẫu biên bản cuộc họp!');
        }
    });

    // Action Items Table controls
    function addActionRow(desc = '', owner = '', deadline = '') {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="table-input act-desc" value="${desc}" placeholder="Tên công việc..."></td>
            <td><input type="text" class="table-input act-owner" value="${owner}" placeholder="Tên người..."></td>
            <td><input type="date" class="table-input act-deadline" value="${deadline}"></td>
            <td style="text-align: center;"><button type="button" class="btn-delete-row"><i class="fa-regular fa-trash-can"></i></button></td>
        `;
        
        tr.querySelector('.btn-delete-row').addEventListener('click', () => {
            tr.remove();
        });
        
        actionItemsTbody.appendChild(tr);
    }

    btnAddAction.addEventListener('click', () => {
        addActionRow();
    });

    // Static event binding for initially rendered rows
    actionItemsTbody.querySelectorAll('.btn-delete-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.currentTarget.closest('tr').remove();
        });
    });

    // Clear Meeting Form
    btnClear.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa và làm mới biểu mẫu biên bản?')) {
            form.reset();
            actionItemsTbody.innerHTML = '';
            addActionRow(); // add one empty row
            
            // Reset date
            const t = new Date();
            t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
            inputDate.value = t.toISOString().slice(0, 16);

            window.showToast('Đã làm mới biểu mẫu biên bản!', 'warning');
        }
    });

    // Save/Archive draft meeting minutes
    btnSave.addEventListener('click', () => {
        if (!inputTitle.value.trim()) {
            window.showToast('Vui lòng nhập tiêu đề cuộc họp!', 'error');
            return;
        }

        const actions = [];
        actionItemsTbody.querySelectorAll('tr').forEach(tr => {
            const desc = tr.querySelector('.act-desc').value.trim();
            const owner = tr.querySelector('.act-owner').value.trim();
            const deadline = tr.querySelector('.act-deadline').value;
            if (desc) {
                actions.push({ desc, owner, deadline });
            }
        });

        const meetingData = {
            id: 'meet_' + Date.now(),
            title: inputTitle.value.trim(),
            date: inputDate.value,
            location: inputLocation.value.trim(),
            attendees: inputAttendees.value.trim(),
            agenda: inputAgenda.value.trim(),
            notes: inputNotes.value.trim(),
            actions: actions
        };

        const currentId = form.getAttribute('data-active-id');
        if (currentId) {
            meetingData.id = currentId;
        }

        if (window.syncSaveMeeting) {
            window.syncSaveMeeting(meetingData).then(() => {
                window.showToast('Đã lưu và đồng bộ biên bản cuộc họp!');
                renderSavedMeetingsList();
            });
        } else {
            let saved = JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
            if (currentId) {
                saved = saved.filter(m => m.id !== currentId);
            }
            saved.unshift(meetingData);
            localStorage.setItem('vpsg-meetings', JSON.stringify(saved));
            window.showToast('Đã lưu biên bản cuộc họp vào bộ nhớ tạm!');
            renderSavedMeetingsList();
        }
    });

    // Load meeting details from saved list
    window.loadMeetingMinutes = function(id) {
        const saved = JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
        const item = saved.find(m => m.id === id);
        if (item) {
            form.setAttribute('data-active-id', item.id);
            
            inputTitle.value = item.title;
            inputDate.value = item.date;
            inputLocation.value = item.location;
            inputAttendees.value = item.attendees;
            inputAgenda.value = item.agenda;
            inputNotes.value = item.notes;

            // Load actions
            actionItemsTbody.innerHTML = '';
            if (item.actions && item.actions.length > 0) {
                item.actions.forEach(act => {
                    addActionRow(act.desc, act.owner, act.deadline);
                });
            } else {
                addActionRow();
            }

            // Highlight in list
            document.querySelectorAll('#saved-minutes-list li').forEach(li => {
                li.classList.remove('active-minutes');
                if (li.getAttribute('data-id') === id) {
                    li.classList.add('active-minutes');
                }
            });

            window.showToast('Đã mở biên bản: ' + item.title);
        }
    };

    // Delete meeting details from saved list
    window.deleteMeetingMinutes = function(e, id) {
        e.stopPropagation(); // prevent loading
        if (confirm('Xóa biên bản này khỏi bộ nhớ lưu trữ?')) {
            const performDelete = async () => {
                if (window.syncDeleteMeeting) {
                    await window.syncDeleteMeeting(id);
                } else {
                    let saved = JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
                    saved = saved.filter(m => m.id !== id);
                    localStorage.setItem('vpsg-meetings', JSON.stringify(saved));
                }
                
                // If active is deleted, reset
                if (form.getAttribute('data-active-id') === id) {
                    form.removeAttribute('data-active-id');
                    form.reset();
                    actionItemsTbody.innerHTML = '';
                    addActionRow();
                }

                renderSavedMeetingsList();
                window.showToast('Đã xóa biên bản thành công!', 'warning');
            };
            performDelete();
        }
    };

    // Render saved list
    async function renderSavedMeetingsList() {
        const saved = window.syncLoadMeetings ? await window.syncLoadMeetings() : (JSON.parse(localStorage.getItem('vpsg-meetings')) || []);
        savedList.innerHTML = '';

        if (saved.length === 0) {
            savedList.innerHTML = '<li class="empty-list-msg">Chưa có biên bản nào được lưu trữ.</li>';
            return;
        }

        saved.forEach(item => {
            const dateStr = item.date ? item.date.replace('T', ' ') : 'N/A';
            const li = document.createElement('li');
            li.setAttribute('data-id', item.id);
            li.addEventListener('click', () => loadMeetingMinutes(item.id));
            
            li.innerHTML = `
                <div class="flex-between">
                    <span class="minutes-item-title" title="${item.title}">${item.title}</span>
                    <button type="button" class="btn-delete-row" onclick="deleteMeetingMinutes(event, '${item.id}')">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                <div class="minutes-item-meta">
                    <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${item.location || 'Chưa rõ'}</span>
                </div>
            `;
            savedList.appendChild(li);
        });
    }

    // Export to Doc File
    btnExport.addEventListener('click', () => {
        if (!inputTitle.value.trim()) {
            window.showToast('Vui lòng nhập tiêu đề cuộc họp trước khi xuất!', 'error');
            return;
        }

        const title = inputTitle.value.trim();
        const date = inputDate.value ? inputDate.value.replace('T', ' ') : '';
        const location = inputLocation.value.trim();
        const attendees = inputAttendees.value.trim();
        const agenda = inputAgenda.value.trim().replace(/\n/g, '<br>');
        const notes = inputNotes.value.trim().replace(/\n/g, '<br>');

        // Actions rows
        let actionRowsHtml = '';
        let stt = 1;
        actionItemsTbody.querySelectorAll('tr').forEach(tr => {
            const desc = tr.querySelector('.act-desc').value.trim();
            const owner = tr.querySelector('.act-owner').value.trim();
            const deadline = tr.querySelector('.act-deadline').value;
            
            if (desc) {
                actionRowsHtml += `
                    <tr>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${stt++}</td>
                        <td style="border: 1px solid #000; padding: 6px;">${desc}</td>
                        <td style="border: 1px solid #000; padding: 6px;">${owner}</td>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${deadline}</td>
                    </tr>
                `;
            }
        });

        if (!actionRowsHtml) {
            actionRowsHtml = `
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 10px; text-align: center; font-style: italic; color: #7f8c8d;">
                        Không có phân công công việc tiếp theo
                    </td>
                </tr>
            `;
        }

        const html = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <title>${title}</title>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: 'Tahoma', sans-serif;
                        font-size: 11pt;
                        line-height: 1.5;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    .title {
                        font-size: 16pt;
                        font-weight: bold;
                        text-align: center;
                        margin-top: 15px;
                        margin-bottom: 15px;
                    }
                    .meta-table {
                        width: 100%;
                        margin-bottom: 20px;
                    }
                    .meta-table td {
                        padding: 4px 0;
                        vertical-align: top;
                    }
                    .section-title {
                        font-weight: bold;
                        margin-top: 15px;
                        margin-bottom: 5px;
                        color: #003366;
                        border-bottom: 1px solid #003366;
                        padding-bottom: 2px;
                    }
                    .content-box {
                        margin-left: 15px;
                        margin-bottom: 15px;
                    }
                    table.action-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 10pt;
                    }
                    table.action-table th {
                        border: 1px solid #000;
                        background-color: #f1f5f9;
                        padding: 6px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <strong>CÔNG TY TNHH VĂN PHÒNG SÀI GÒN</strong><br>
                    <span>Bộ phận Hành chính Văn phòng</span><br>
                    <span>————————————</span>
                </div>
                
                <div class="title">BIÊN BẢN CUỘC HỌP</div>
                
                <table class="meta-table">
                    <tr>
                        <td style="width: 20%;"><strong>Cuộc họp:</strong></td>
                        <td style="width: 80%;">${title}</td>
                    </tr>
                    <tr>
                        <td><strong>Thời gian:</strong></td>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <td><strong>Địa điểm:</strong></td>
                        <td>${location}</td>
                    </tr>
                    <tr>
                        <td><strong>Người tham gia:</strong></td>
                        <td>${attendees}</td>
                    </tr>
                </table>
                
                <div class="section-title">I. MỤC TIÊU & CHƯƠNG TRÌNH HỌP</div>
                <div class="content-box">${agenda || 'Không ghi nhận'}</div>
                
                <div class="section-title">II. NỘI DUNG CUỘC HỌP (CHI TIẾT THẢO LUẬN)</div>
                <div class="content-box">${notes || 'Không ghi nhận'}</div>
                
                <div class="section-title">III. PHÂN CÔNG CÔNG VIỆC & HÀNH ĐỘNG TIẾP THEO</div>
                <table class="action-table">
                    <thead>
                        <tr>
                            <th style="width: 8%; border: 1px solid #000;">STT</th>
                            <th style="width: 47%; border: 1px solid #000;">Nội dung công việc</th>
                            <th style="width: 25%; border: 1px solid #000;">Người phụ trách</th>
                            <th style="width: 20%; border: 1px solid #000;">Hạn chót</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${actionRowsHtml}
                    </tbody>
                </table>
                
                <table style="width: 100%; margin-top: 40px; text-align: center;">
                    <tr>
                        <td style="width: 50%;">
                            <strong>THƯ KÝ GHI BIÊN BẢN</strong><br>
                            <span style="font-size: 9pt; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                        </td>
                        <td style="width: 50%;">
                            <strong>CHỦ TRÌ CUỘC HỌP</strong><br>
                            <span style="font-size: 9pt; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff' + html], {
            type: 'application/msword;charset=utf-8'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BienBanHop_${title.replace(/\s+/g, '_')}_${Date.now()}.doc`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

        window.showToast('Đang tải xuống biên bản cuộc họp .doc...');
    });
}
