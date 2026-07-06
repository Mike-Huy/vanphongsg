/**
 * VĂN PHÒNG SÀI GÒN - Document Editor Module
 * File: editor.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
});

// Custom Confirmation Dialog
function showCustomConfirm(message, onConfirm, onCancel, confirmText = 'Đồng ý', cancelText = 'Ở lại') {
    const modal = document.getElementById('confirm-modal');
    const msgEl = document.getElementById('confirm-modal-message');
    const btnOk = document.getElementById('confirm-modal-btn-ok');
    const btnCancel = document.getElementById('confirm-modal-btn-cancel');
    
    if (!modal || !msgEl || !btnOk || !btnCancel) return;
    
    msgEl.textContent = message;
    btnOk.textContent = confirmText;
    btnCancel.textContent = cancelText;
    modal.classList.add('show');
    
    btnOk.onclick = () => {
        modal.classList.remove('show');
        if (onConfirm) onConfirm();
    };
    
    btnCancel.onclick = () => {
        modal.classList.remove('show');
        if (onCancel) onCancel();
    };
}
window.showCustomConfirm = showCustomConfirm;

// Templates Data
const EDITOR_TEMPLATES = {
    'don-xin-nghi-phep': `
        <div style="text-align: center; font-family: Tahoma; font-size: 14px;">
            <p><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <strong>Độc lập - Tự do - Hạnh phúc</strong></p>
            <p>————————————</p>
        </div>
        <p style="text-align: right; font-family: Tahoma; font-size: 12px; font-style: italic;">TP. Hồ Chí Minh, ngày ...... tháng ...... năm 2026</p>
        
        <h2 style="text-align: center; font-family: Tahoma; font-size: 18px; margin-top: 20px; margin-bottom: 20px;">ĐƠN XIN NGHỈ PHÉP</h2>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-left: 40px;"><strong>Kính gửi:</strong> - Ban Giám Đốc Công ty............................................<br>
        <span style="display:inline-block; width: 62px;"></span>- Trưởng bộ phận......................................................</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 15px;">
            <tr>
                <td style="width: 50%; padding: 4px 0;">Tôi tên là: <strong>Nguyen Van A</strong></td>
                <td style="width: 50%; padding: 4px 0;">Mã nhân viên: <strong>NV001</strong></td>
            </tr>
            <tr>
                <td style="padding: 4px 0;">Chức vụ: <strong>Nhân viên Văn phòng</strong></td>
                <td style="padding: 4px 0;">Bộ phận: <strong>Hành chính Nhân sự</strong></td>
            </tr>
        </table>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 30px;">Nay tôi làm đơn này kính trình Ban Giám Đốc và Trưởng bộ phận cho tôi được xin nghỉ phép nghỉ từ ngày ......./......./2026 đến ngày ......./......./2026. (Tổng số ngày nghỉ: ...... ngày).</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">Lý do xin nghỉ:...............................................................................................................................................</p>
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">....................................................................................................................................................................</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">Tôi cam kết sẽ bàn giao công việc đầy đủ cho đồng nghiệp là Ông/Bà: ............................................ thuộc bộ phận ............................... để đảm bảo tiến độ công việc chung.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 30px;">Rất mong nhận được sự chấp thuận của Ban Giám Đốc. Tôi xin chân thành cảm ơn.</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 30px; text-align: center;">
            <tr>
                <td style="width: 33%; vertical-align: top;">
                    <strong>Ý KIẾN BAN GIÁM ĐỐC</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                </td>
                <td style="width: 33%; vertical-align: top;">
                    <strong>Ý KIẾN TRƯỞNG BỘ PHẬN</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                </td>
                <td style="width: 34%; vertical-align: top;">
                    <strong>NGƯỜI LÀM ĐƠN</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                    <br><br><br><br>
                    <strong>Nguyen Van A</strong>
                </td>
            </tr>
        </table>
    `,
    'hop-dong-lao-dong': `
        <div style="text-align: center; font-family: Tahoma; font-size: 14px;">
            <p><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <strong>Độc lập - Tự do - Hạnh phúc</strong></p>
            <p>————————————</p>
        </div>
        
        <h2 style="text-align: center; font-family: Tahoma; font-size: 18px; margin-top: 20px; margin-bottom: 20px;">HỢP ĐỒNG LAO ĐỘNG</h2>
        <p style="text-align: center; font-family: Tahoma; font-size: 12px; font-style: italic; margin-top: -15px;">Số: ....../HĐLĐ-VPSG</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px;">Chúng tôi gồm hai bên:</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px;"><strong>BÊN SỬ DỤNG LAO ĐỘNG (BÊN A):</strong> CÔNG TY TNHH VĂN PHÒNG SÀI GÒN<br>
        - Đại diện bởi: Ông/Bà <strong>Nguyễn Thành Phố</strong> - Chức vụ: Giám Đốc<br>
        - Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh<br>
        - Điện thoại: 028.38222666</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px;"><strong>BÊN LAO ĐỘNG (BÊN B):</strong><br>
        - Ông/Bà: <strong>[Nhập tên nhân viên]</strong> - Quốc tịch: Việt Nam<br>
        - Ngày sinh: ....../......./.......... tại: .................................................................................<br>
        - Số CCCD: ............................... cấp ngày: ......./......./.......... tại: .......................................<br>
        - Địa chỉ thường trú: .........................................................................................................</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 15px;">Sau khi thỏa thuận, hai bên đồng ý ký kết Hợp đồng lao động này với các điều khoản sau:</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px;"><strong>Điều 1: Công việc và thời hạn hợp đồng</strong><br>
        - Loại hợp đồng: Hợp đồng lao động xác định thời hạn 01 năm.<br>
        - Thời hạn từ ngày ......./......./2026 đến ngày ......./......./2027.<br>
        - Vị trí công tác: Nhân viên Văn phòng.<br>
        - Địa điểm làm việc: Trụ sở chính công ty.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px;"><strong>Điều 2: Chế độ làm việc</strong><br>
        - Thời gian làm việc: Từ thứ Hai đến thứ Sáu (8:00 - 17:30). Nghỉ thứ Bảy & Chủ Nhật.<br>
        - Thiết bị làm việc: Được cấp 01 máy tính xách tay và các văn phòng phẩm cần thiết.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px;"><strong>Điều 3: Quyền lợi và Nghĩa vụ của Bên B</strong><br>
        - Mức lương chính: <strong>15.000.000 VNĐ / tháng</strong> (Mười lăm triệu đồng chẵn).<br>
        - Phụ cấp ăn trưa: 730.000 VNĐ/tháng. Phụ cấp gửi xe: 150.000 VNĐ/tháng.<br>
        - Hình thức trả lương: Chuyển khoản ngân hàng vào ngày 05 hằng tháng.<br>
        - BHXH, BHYT, BHTN: Được đóng đầy đủ theo quy định của pháp luật lao động hiện hành.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px;"><strong>Điều 4: Điều khoản thi hành</strong><br>
        - Hợp đồng này có hiệu lực kể từ ngày ký. Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, Bên A giữ 01 bản, Bên B giữ 01 bản.</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 30px; text-align: center;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <strong>ĐẠI DIỆN BÊN A</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký tên & đóng dấu)</span>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <strong>ĐẠI DIỆN BÊN B</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                </td>
            </tr>
        </table>
    `,
    'giay-uy-quyen': `
        <div style="text-align: center; font-family: Tahoma; font-size: 14px;">
            <p><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <strong>Độc lập - Tự do - Hạnh phúc</strong></p>
            <p>————————————</p>
        </div>
        
        <h2 style="text-align: center; font-family: Tahoma; font-size: 18px; margin-top: 20px; margin-bottom: 20px;">GIẤY ỦY QUYỀN</h2>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px;">Hôm nay, ngày ...... tháng ...... năm 2026, tại văn phòng công ty chúng tôi gồm:</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px;"><strong>BÊN ỦY QUYỀN (BÊN A):</strong><br>
        - Tôi tên là: <strong>Nguyễn Văn A</strong> - Chức vụ: Trưởng phòng Hành chính<br>
        - Số CCCD: ............................... cấp ngày: ......./......./.......... tại: .......................................<br>
        - Địa chỉ công tác: Công ty TNHH Văn phòng Sài Gòn.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px;"><strong>BÊN NHẬN ỦY QUYỀN (BÊN B):</strong><br>
        - Tôi tên là: <strong>Trần Thị B</strong> - Chức vụ: Chuyên viên Hành chính<br>
        - Số CCCD: ............................... cấp ngày: ......./......./.......... tại: .......................................<br>
        - Địa chỉ thường trú: .........................................................................................................</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 30px;">Bằng văn bản này, Bên A ủy quyền cho Bên B thực hiện các nội dung công việc sau:</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; margin-left: 20px;">1. Thay mặt Bên A liên hệ làm việc với chi cục Thuế Quận 1 để nộp hồ sơ kê khai thuế quý II/2026.<br>
        2. Ký biên bản nhận tài liệu và giao nhận giấy tờ liên quan từ cơ quan Thuế.<br>
        3. Các hồ sơ giấy tờ cần thiết khác theo yêu cầu hướng dẫn của cán bộ Thuế.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">Thời hạn ủy quyền: Kể từ ngày ký Giấy ủy quyền này cho đến khi hoàn thành công việc hoặc đến ngày ......./......./2026.</p>
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px; text-indent: 30px;">Bên B cam kết thực hiện đúng nội dung ủy quyền và hoàn toàn chịu trách nhiệm trước pháp luật.</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 35px; text-align: center;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <strong>BÊN NHẬN ỦY QUYỀN</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                    <br><br><br><br>
                    <strong>Trần Thị B</strong>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <strong>BÊN ỦY QUYỀN</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                    <br><br><br><br>
                    <strong>Nguyễn Văn A</strong>
                </td>
            </tr>
        </table>
    `,
    'bien-ban-ban-giao': `
        <div style="text-align: center; font-family: Tahoma; font-size: 14px;">
            <p><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <strong>Độc lập - Tự do - Hạnh phúc</strong></p>
            <p>————————————</p>
        </div>
        
        <h2 style="text-align: center; font-family: Tahoma; font-size: 18px; margin-top: 20px; margin-bottom: 20px;">BIÊN BẢN BÀN GIAO CÔNG VIỆC</h2>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px;">Hôm nay, ngày ...... tháng ...... năm 2026, tại phòng họp số 2 tiến hành bàn giao công việc giữa:</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px;"><strong>NGƯỜI BÀN GIAO (BÊN A):</strong> Ông/Bà <strong>Nguyễn Văn A</strong> - Chức vụ: Nhân viên Kế toán</p>
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px;"><strong>NGƯỜI NHẬN BÀN GIAO (BÊN B):</strong> Ông/Bà <strong>Trần Quốc C</strong> - Chức vụ: Kế toán viên mới</p>
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 5px;"><strong>NGƯỜI GIÁM SÁT (BÊN C):</strong> Bà <strong>Lê Thị Trưởng</strong> - Chức vụ: Kế toán trưởng</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 15px;">Bên A thực hiện bàn giao cho Bên B toàn bộ công việc và tài liệu kế toán nội bộ cụ thể như sau:</p>
        
        <h4 style="font-family: Tahoma; font-size: 13px; margin-top: 10px;">I. HỒ SƠ, TÀI LIỆU BÀN GIAO:</h4>
        <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; font-family: Tahoma; font-size: 12px; margin-top: 5px;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 8%;">STT</th>
                    <th style="border: 1px solid #000; padding: 5px; width: 45%;">Tên hồ sơ, tài liệu</th>
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 12%;">Số lượng</th>
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 15%;">Tình trạng</th>
                    <th style="border: 1px solid #000; padding: 5px; width: 20%;">Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 5px;">Báo cáo thuế GTGT năm 2025</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">01 bộ</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">Bản gốc</td>
                    <td style="border: 1px solid #000; padding: 5px;">Trong tủ hồ sơ số 2</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">2</td>
                    <td style="border: 1px solid #000; padding: 5px;">Chứng từ hóa đơn đầu vào/ra năm 2025</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">12 file</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">Bản cứng</td>
                    <td style="border: 1px solid #000; padding: 5px;">Phân loại theo từng tháng</td>
                </tr>
            </tbody>
        </table>
        
        <h4 style="font-family: Tahoma; font-size: 13px; margin-top: 15px;">II. CÁC CÔNG VIỆC CHƯA HOÀN THÀNH CẦN THEO DÕI:</h4>
        <p style="font-family: Tahoma; font-size: 13px; margin-left: 15px;">- Đang kiểm tra đối chiếu công nợ của Công ty Hải Phòng (Hạn chót ngày 15/07/2026).<br>
        - Đang chờ hóa đơn VAT của công ty Viễn Thông điện tử.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 15px;">Biên bản này được lập thành 03 bản, mỗi bên giữ 01 bản có giá trị pháp lý tương đương để thực hiện.</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 30px; text-align: center;">
            <tr>
                <td style="width: 33%; vertical-align: top;">
                    <strong>NGƯỜI BÀN GIAO</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                    <br><br><br>
                    <strong>Nguyễn Văn A</strong>
                </td>
                <td style="width: 33%; vertical-align: top;">
                    <strong>NGƯỜI GIÁM SÁT</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                    <br><br><br>
                    <strong>Lê Thị Trưởng</strong>
                </td>
                <td style="width: 34%; vertical-align: top;">
                    <strong>NGƯỜI NHẬN BÀN GIAO</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                    <br><br><br>
                    <strong>Trần Quốc C</strong>
                </td>
            </tr>
        </table>
    `,
    'cong-van-hanh-chinh': `
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px;">
            <tr>
                <td style="width: 45%; text-align: center; vertical-align: top;">
                    <strong>ỦY BAN NHÂN DÂN QUẬN 1</strong><br>
                    <strong>VP SÀI GÒN</strong><br>
                    <p style="margin-top: 5px;">Số: 145/CV-VPSG</p>
                    <p style="margin-top: -10px;">V/v tổ chức hội thảo chuyển đổi số</p>
                </td>
                <td style="width: 55%; text-align: center; vertical-align: top;">
                    <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
                    <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
                    <p style="margin-top: 5px;">————————————</p>
                    <p style="margin-top: 5px; font-style: italic; font-size: 12px;">Quận 1, ngày 05 tháng 07 năm 2026</p>
                </td>
            </tr>
        </table>
        
        <p style="text-align: center; font-family: Tahoma; font-size: 13px; margin-top: 25px;"><strong>Kính gửi:</strong> Các doanh nghiệp, tổ chức trên địa bàn Quận 1</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 30px;">Nhằm thúc đẩy phong trào ứng dụng công nghệ thông tin và chuyển đổi số trong các quy trình xử lý văn bản hành chính của doanh nghiệp, giúp tiết kiệm chi phí và tăng hiệu năng lao động.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">Văn phòng Sài Gòn kính mời đại diện quý doanh nghiệp tới tham dự buổi tọa đàm "Trợ lý Số và Tự động hóa Văn phòng năm 2026".</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; margin-left: 30px;"><strong>- Thời gian:</strong> 08:30 ngày 15 tháng 07 năm 2026 (Thứ Tư).<br>
        <strong>- Địa điểm:</strong> Hội trường lớn lầu 3, số 123 Nguyễn Huệ, Quận 1.<br>
        <strong>- Chủ trì:</strong> Giám Đốc Sở Khoa Học Công Nghệ.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">Kính đề nghị đại diện quý đơn vị sắp xếp công việc và đăng ký danh sách đại biểu tham dự trước ngày 12/07/2026 về cho Ban tổ chức hành chính.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; text-indent: 30px;">Trân trọng kính chào./.</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 30px;">
            <tr>
                <td style="width: 50%; vertical-align: top; font-size: 11px;">
                    <strong><em>Nơi nhận:</em></strong><br>
                    - Như kính gửi;<br>
                    - Lưu văn thư hành chính;<br>
                    - Lưu VP.
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top;">
                    <strong>CHÁNH VĂN PHÒNG</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký tên & đóng dấu)</span>
                    <br><br><br><br>
                    <strong>Nguyễn Thành Phố</strong>
                </td>
            </tr>
        </table>
    `,
    'giay-moi-hop': `
        <div style="text-align: center; font-family: Tahoma; font-size: 14px;">
            <p><strong>CÔNG TY TNHH VĂN PHÒNG SÀI GÒN</strong><br>
            <strong>Ban Điều Hành Dự Án</strong></p>
            <p>————————————</p>
        </div>
        
        <h2 style="text-align: center; font-family: Tahoma; font-size: 18px; margin-top: 15px; margin-bottom: 20px;">GIẤY MỜI HỌP</h2>
        
        <p style="text-align: center; font-family: Tahoma; font-size: 13px; margin-top: -15px;"><strong>Kính gửi:</strong> Ông/Bà <strong>[Nhập tên khách mời]</strong></p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 20px; text-indent: 30px;">Ban Giám đốc dự án trân trọng kính mời Ông/Bà tới tham dự cuộc họp đánh giá và triển khai giai đoạn 2 của sản phẩm công nghệ.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 10px; margin-left: 30px;">
            - <strong>Thời gian:</strong> 14:00 - 16:30, ngày ......./......./2026.<br>
            - <strong>Địa điểm:</strong> Phòng họp Diamond lầu 5, số 123 Nguyễn Huệ, Quận 1.<br>
            - <strong>Nội dung cuộc họp:</strong> Thảo luận ý kiến thiết kế giao diện UI/UX mới và phân tích kết quả thử nghiệm người dùng.
        </p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 30px;">Sự hiện diện đầy đủ và đúng giờ của Ông/Bà đóng vai trò quan trọng quyết định tiến độ chung của toàn dự án. Rất mong Ông/Bà sắp xếp tham dự.</p>
        
        <p style="font-family: Tahoma; font-size: 13px; margin-top: 15px; text-indent: 30px;">Trân trọng kính chào!</p>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Tahoma; font-size: 13px; margin-top: 30px; text-align: center;">
            <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%;">
                    <p style="font-style: italic; font-size: 12px; margin-bottom: 5px;">Quận 1, ngày ..... tháng ..... năm 2026</p>
                    <strong>T/M BAN GIÁM ĐỐC DỰ ÁN</strong><br>
                    <span style="font-size: 11px; font-style: italic;">(Ký & ghi rõ họ tên)</span>
                </td>
            </tr>
        </table>
    `,
    'anh-tai-cau-long': `
        <div style="font-size: 13px; line-height: 1.4; color: #000000; padding: 20px; background-color: #ffffff;">
            <!-- Header section -->
            <table style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; font-weight: bold; margin-bottom: 25px;">
                <tr>
                    <td style="width: 40%; text-align: center; vertical-align: top; padding: 0; line-height: 1.3;">
                        TỔNG CÔNG TY CÔNG NGHIỆP SÀI GÒN<br>
                        TNHH MỘT THÀNH VIÊN<br>
                        (CNS)<br>
                        <span style="text-decoration: underline; font-size: 11px;">VĂN PHÒNG</span>
                    </td>
                    <td style="width: 60%; text-align: center; vertical-align: top; padding: 0; line-height: 1.3;">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
                        <span style="font-weight: bold; font-size: 13px;">Độc lập - Tự do - Hạnh phúc</span><br>
                        <span style="font-weight: normal; font-size: 12px;">————————————</span>
                    </td>
                </tr>
            </table>

            <!-- Document Title -->
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="font-size: 15px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 0.5px;">DANH SÁCH TỔNG HỢP</h3>
                <div class="title-flex-wrapper" style="display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%; position: relative;">
                    <h4 id="doc-title-h4" style="font-size: 13px; font-weight: bold; margin: 0; display: inline-block;">Tặng bánh Trung thu năm 2026 theo đề xuất của các cá nhân, Phòng, Ban và Nhà máy<br>thuộc Tổng Công ty</h4>
                    <button class="btn-edit-title no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.95rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Chỉnh sửa tiêu đề">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
                <div class="subtitle-flex-wrapper" style="display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%; position: relative; margin-top: 5px;">
                    <p id="doc-title-p" style="font-style: italic; font-size: 12px; margin: 0; display: inline-block;">(Đính kèm theo Phiếu trình số &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/PT-VPCQ ngày &nbsp;&nbsp;&nbsp;&nbsp; tháng 9 năm 2025 của Văn phòng Tổng Công ty)</p>
                    <button class="btn-edit-subtitle no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.95rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Chỉnh sửa phụ đề">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            </div>

            <!-- Table Section -->
            <table class="doc-data-table" style="width: 100%; border: 1px solid #000000; border-collapse: collapse; font-size: 11px;">
                <thead>
                    <tr style="background-color: #ffffff; text-align: center; font-weight: bold;">
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 4%; vertical-align: middle;">STT</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 22%; vertical-align: middle;">Họ và tên/ Đơn vị</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 22%; vertical-align: middle;">Chức vụ</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 16%; vertical-align: middle;">Địa chỉ (cơ quan/đơn vị / nhà riêng)</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 6%; vertical-align: middle;">Số lượng (hộp)</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 8%; vertical-align: middle;">Đơn vị / cá nhân đề xuất</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 14%; vertical-align: middle;">Lãnh đạo duyệt</th>
                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 8%; vertical-align: middle;">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>

                    <!-- Section Row -->
                    <tr style="font-weight: bold; font-size: 11px;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center;">I.</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left;">Thường trực Thành ủy</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px;"></td>
                        <td style="border: 1px solid #000000; padding: 6px 4px;"></td>
                        <td style="border: 1px solid #000000; padding: 6px 4px;"></td>
                        <td style="border: 1px solid #000000; padding: 6px 4px;"></td>
                        <td style="border: 1px solid #000000; padding: 6px 4px;"></td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center;">27</td>
                    </tr>

                    <!-- Detail Rows with Spanning Address -->
                    <tr style="font-size: 11px;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">1</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">Ông Trần Lưu Quang</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">
                            Ủy viên Bộ Chính trị, Bi<br>thư Thành ủy Thành phố<br>Hồ Chí Minh
                        </td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle; line-height: 1.3;" rowspan="5">
                            58 Trương Định,<br>Phường Xuân Hòa, TP<br>Hồ Chí Minh
                        </td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">1</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Văn phòng HĐTV</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Nguyễn Phương Nam</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;"></td>
                    </tr>
                    <tr style="font-size: 11px;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">2</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">Ông Lê Quốc Phong</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">
                            Ủy viên BCH TW Đảng,<br>Phó Bí thư Thường trực<br>Thành ủy
                        </td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">1</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Văn phòng HĐTV</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Nguyễn Phương Nam</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;"></td>
                    </tr>
                    <tr style="font-size: 11px;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">3</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">Ông Nguyễn Văn Được</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">
                            Ủy viên BCH TW Đảng,<br>Phó Bí thư Thành ủy, Chủ<br>tịch UBND Thành phố
                        </td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">1</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Văn phòng HĐTV</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Nguyễn Phương Nam</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;"></td>
                    </tr>
                    <tr style="font-size: 11px;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">4</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">Ông Võ Văn Minh</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">
                            Ủy viên BCH TW Đảng,<br>Phó Bí thư Thành ủy, Chủ<br>tịch HĐND Thành phố
                        </td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">1</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Văn phòng HĐTV</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Nguyễn Phương Nam</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;"></td>
                    </tr>
                    <tr style="font-size: 11px;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">5</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">Ông Nguyễn Phước Lộc</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">
                            Ủy viên BCH TW Đảng,<br>Phó Bí thư Thành ủy, Chủ<br>tịch Ủy ban MTTQ Thành<br>phố
                        </td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">1</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Văn phòng HĐTV</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">Nguyễn Phương Nam</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;"></td>
                    </tr>
                </tbody>
            </table>

            <!-- Signature Section -->
            <table class="doc-signature-table" style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; margin-top: 30px; font-family: Tahoma, 'Segoe UI', sans-serif; page-break-inside: avoid;">
                <tr>
                    <td style="width: 35%; text-align: center; vertical-align: top; padding: 0; line-height: 1.5;">
                        <div class="sig-title-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                            <span class="sig-title" style="font-weight: bold; text-transform: uppercase;">TỔNG GIÁM ĐỐC</span>
                            <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa chức danh">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                        <div style="height: 80px;"></div>
                        <div class="sig-name-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                            <span class="sig-name" style="font-weight: bold;">Nguyễn Phương Nam</span>
                            <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa họ tên">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                    </td>
                    <td style="width: 35%; text-align: center; vertical-align: top; padding: 0; line-height: 1.5;">
                        <div class="sig-title-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                            <span class="sig-title" style="font-weight: bold; text-transform: uppercase; display: block; text-align: center;">TL. CHÁNH VĂN PHÒNG<br><span style="font-size: 11px;">PHÓ CHÁNH VĂN PHÒNG</span></span>
                            <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa chức danh">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                        <div style="height: 62px;"></div>
                        <div class="sig-name-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                            <span class="sig-name" style="font-weight: bold;">Mai Xuân Chánh</span>
                            <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa họ tên">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                    </td>
                    <td style="width: 30%; text-align: center; vertical-align: top; padding: 0; line-height: 1.5;">
                        <div class="sig-title-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                            <span class="sig-title" style="font-weight: bold; text-transform: uppercase;">NGƯỜI LẬP</span>
                            <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa chức danh">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                        <div style="height: 80px;"></div>
                        <div class="sig-name-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                            <span class="sig-name" style="font-weight: bold;">Cao Minh Duy</span>
                            <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa họ tên">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `
};

function initEditor() {
    const editor = document.getElementById('rich-editor');
    const templateSelect = document.getElementById('doc-template-select');
    const btnClear = document.getElementById('btn-editor-clear');
    const btnCopy = document.getElementById('btn-editor-copy');
    const btnPrint = document.getElementById('btn-editor-print');
    const btnDownload = document.getElementById('btn-editor-download');
    const fontFamilySelect = document.getElementById('font-family-select');
    
    const textColorPicker = document.getElementById('text-color');
    const bgColorPicker = document.getElementById('bg-color');
    const fontSizeSelect = document.getElementById('font-size-select');
    const btnTools = document.querySelectorAll('.btn-tool');
    
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');
    const saveStatus = document.getElementById('save-status');

    if (!editor) return;

    function htmlToTextWithSpaces(html) {
        let text = html.replace(/<br\s*\/?>/gi, '\n');
        const temp = document.createElement('div');
        temp.innerHTML = text;
        return (temp.textContent || temp.innerText || '').replace(/&nbsp;/g, ' ');
    }

    function textToHtmlWithSpaces(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length));
    }

    function ensureTitleEditButtons() {
        const h4 = editor.querySelector('h4');
        if (h4 && h4.textContent.includes('Tặng bánh Trung thu') && !h4.id) {
            let parent = h4.parentNode;
            if (parent && !parent.classList.contains('title-flex-wrapper')) {
                h4.id = 'doc-title-h4';
                const wrapper = document.createElement('div');
                wrapper.className = 'title-flex-wrapper';
                wrapper.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%; position: relative;';
                parent.insertBefore(wrapper, h4);
                wrapper.appendChild(h4);
                
                const btn = document.createElement('button');
                btn.className = 'btn-edit-title no-export';
                btn.setAttribute('contenteditable', 'false');
                btn.style.cssText = 'background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.95rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;';
                btn.title = 'Chỉnh sửa tiêu đề';
                btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                wrapper.appendChild(btn);
            }
        }
        
        const p = editor.querySelector('p');
        if (p && p.textContent.includes('Đính kèm theo Phiếu trình số') && !p.id) {
            let parent = p.parentNode;
            if (parent && !parent.classList.contains('subtitle-flex-wrapper')) {
                p.id = 'doc-title-p';
                const wrapper = document.createElement('div');
                wrapper.className = 'subtitle-flex-wrapper';
                wrapper.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%; position: relative; margin-top: 5px;';
                parent.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                
                const btn = document.createElement('button');
                btn.className = 'btn-edit-subtitle no-export';
                btn.setAttribute('contenteditable', 'false');
                btn.style.cssText = 'background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.95rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;';
                btn.title = 'Chỉnh sửa phụ đề';
                btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                wrapper.appendChild(btn);
            }
        }
    }

    // Title / Subtitle Edit Modal Logic
    const editTitleModal = document.getElementById('edit-title-modal');
    const editTitleInput = document.getElementById('edit-title-input');
    const btnSaveEditTitle = document.getElementById('btn-save-edit-title');
    const closeEditTitleModal = document.getElementById('close-edit-title-modal');
    const btnCloseEditTitleModalFooter = document.getElementById('btn-close-edit-title-modal-footer');
    
    let currentEditingTarget = null;
    
    const openEditTitleModal = (target) => {
        currentEditingTarget = target;
        if (!editTitleModal || !editTitleInput) return;
        
        const titleHeader = editTitleModal.querySelector('.modal-header h3');
        
        if (target === 'title') {
            if (titleHeader) titleHeader.innerHTML = '<i class="fa-solid fa-pen-to-square text-blue"></i> Chỉnh sửa tiêu đề';
            const h4 = editor.querySelector('#doc-title-h4');
            if (h4) {
                editTitleInput.value = htmlToTextWithSpaces(h4.innerHTML);
            }
        } else if (target === 'subtitle') {
            if (titleHeader) titleHeader.innerHTML = '<i class="fa-solid fa-pen-to-square text-blue"></i> Chỉnh sửa phụ đề';
            const p = editor.querySelector('#doc-title-p');
            if (p) {
                editTitleInput.value = htmlToTextWithSpaces(p.innerHTML);
            }
        } else if (target instanceof HTMLElement) {
            const isTitle = target.classList.contains('sig-title');
            if (titleHeader) {
                titleHeader.innerHTML = isTitle 
                    ? '<i class="fa-solid fa-pen-to-square text-blue"></i> Chỉnh sửa chức danh ký' 
                    : '<i class="fa-solid fa-pen-to-square text-blue"></i> Chỉnh sửa họ tên người ký';
            }
            editTitleInput.value = htmlToTextWithSpaces(target.innerHTML);
        }
        
        editTitleModal.classList.add('show');
    };
    
    const hideEditTitleModal = () => {
        if (editTitleModal) editTitleModal.classList.remove('show');
    };
    
    if (closeEditTitleModal) closeEditTitleModal.addEventListener('click', hideEditTitleModal);
    if (btnCloseEditTitleModalFooter) btnCloseEditTitleModalFooter.addEventListener('click', hideEditTitleModal);
    
    if (btnSaveEditTitle) {
        btnSaveEditTitle.addEventListener('click', () => {
            if (!editTitleModal || !editTitleInput) return;
            const newValue = editTitleInput.value;
            
            if (currentEditingTarget === 'title') {
                const h4 = editor.querySelector('#doc-title-h4');
                if (h4) {
                    h4.innerHTML = textToHtmlWithSpaces(newValue);
                }
            } else if (currentEditingTarget === 'subtitle') {
                const p = editor.querySelector('#doc-title-p');
                if (p) {
                    p.innerHTML = textToHtmlWithSpaces(newValue);
                }
            } else if (currentEditingTarget instanceof HTMLElement) {
                if (currentEditingTarget.classList.contains('sig-title')) {
                    const lines = newValue.split('\n');
                    if (lines.length > 1) {
                        currentEditingTarget.innerHTML = lines[0] + lines.slice(1).map(line => `<br><span style="font-size: 11px;">${line}</span>`).join('');
                    } else {
                        currentEditingTarget.innerHTML = newValue;
                    }
                } else {
                    currentEditingTarget.innerHTML = textToHtmlWithSpaces(newValue);
                }
            }
            
            hideEditTitleModal();
            triggerAutoSave();
            window.showToast('Đã cập nhật thành công!');
        });
    }
    
    // Event delegation on editor to intercept edit button clicks
    editor.addEventListener('click', (e) => {
        const btnEditTitle = e.target.closest('.btn-edit-title');
        const btnEditSubtitle = e.target.closest('.btn-edit-subtitle');
        const btnEditSig = e.target.closest('.btn-edit-sig');
        
        if (btnEditTitle) {
            e.preventDefault();
            e.stopPropagation();
            openEditTitleModal('title');
        } else if (btnEditSubtitle) {
            e.preventDefault();
            e.stopPropagation();
            openEditTitleModal('subtitle');
        } else if (btnEditSig) {
            e.preventDefault();
            e.stopPropagation();
            const wrapper = btnEditSig.parentElement;
            const textSpan = wrapper?.querySelector('.sig-title, .sig-name');
            if (textSpan) {
                openEditTitleModal(textSpan);
            }
        }
    });

    // Load saved content if exists
    const loadSaved = async () => {
        const savedContent = window.syncLoadDocument ? await window.syncLoadDocument() : localStorage.getItem('vpsg-editor-content');
        if (savedContent) {
            // Clean up legacy filter buttons from saved content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = savedContent;
            const filterSpans = tempDiv.querySelectorAll('span');
            filterSpans.forEach(span => {
                if (span.textContent.trim() === '▼') {
                    const parentDiv = span.parentElement;
                    if (parentDiv && parentDiv.tagName === 'DIV' && parentDiv.style.display === 'flex') {
                        const textSpan = parentDiv.querySelector('span:not([style*="cursor"])');
                        const cell = parentDiv.parentElement; // th or td
                        if (textSpan && cell && (cell.tagName === 'TH' || cell.tagName === 'TD')) {
                            cell.innerHTML = textSpan.innerHTML;
                        }
                    }
                }
            });
            
            const cleanedContent = tempDiv.innerHTML;
            editor.innerHTML = cleanedContent;
            ensureTitleEditButtons();
            
            // If the signature block table exists but lacks edit buttons, remove it so it self-heals
            const oldSig = editor.querySelector('.doc-signature-table');
            if (oldSig && !oldSig.querySelector('.btn-edit-sig')) {
                oldSig.remove();
            }
            
            if (cleanedContent.indexOf('Tặng bánh Trung thu năm 2026') !== -1) {
                editor.classList.add('landscape-mode');
                editor.style.fontFamily = "'Times New Roman', Times, serif";
                if (templateSelect) templateSelect.value = 'anh-tai-cau-long';
                if (fontFamilySelect) fontFamilySelect.value = "'Times New Roman', Times, serif";
            } else {
                editor.classList.remove('landscape-mode');
                editor.style.fontFamily = "'Tahoma', 'Segoe UI', sans-serif";
                if (fontFamilySelect) fontFamilySelect.value = "'Tahoma', 'Segoe UI', sans-serif";
            }
            ensureSignatureBlock();
            updateCounts();
        }
        if (templateSelect) {
            templateSelect.dataset.prevValue = templateSelect.value;
        }
    };
    loadSaved();

    let autoSaveTimer;
    const triggerAutoSave = () => {
        saveStatus.textContent = 'Đang lưu...';
        saveStatus.style.color = '#f59e0b';
        
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(async () => {
            if (window.syncSaveDocument) {
                await window.syncSaveDocument(editor.innerHTML);
            } else {
                localStorage.setItem('vpsg-editor-content', editor.innerHTML);
            }
            
            // Sync structured gift records to Supabase table
            if (window.syncSaveGifts) {
                const gifts = extractDataFromEditorTable();
                await window.syncSaveGifts(gifts);
            }

            saveStatus.textContent = 'Đã lưu tự động';
            saveStatus.style.color = '#198754';
        }, 1500);
    };

    // Update Word/Char Counts
    function updateCounts() {
        const text = editor.innerText || '';
        const chars = text.replace(/\n/g, '').length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        charCount.textContent = chars;
        wordCount.textContent = words;
    }

    editor.addEventListener('input', () => {
        updateCounts();
        triggerAutoSave();
    });

    // Formatting Toolbar Buttons
    btnTools.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.getAttribute('data-command');
            document.execCommand(command, false, null);
            editor.focus();
            
            // Toggle active state locally
            btn.classList.toggle('active');
        });
    });

    // Change text color
    textColorPicker.addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
        editor.focus();
    });

    // Change text highlight (background) color
    bgColorPicker.addEventListener('input', (e) => {
        document.execCommand('hiliteColor', false, e.target.value);
        editor.focus();
    });

    // Change Font Size
    fontSizeSelect.addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
        editor.focus();
    });

    // Handle Document Templates
    templateSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        showCustomConfirm(
            'Bạn đang chuyển sang văn bản khác ! Nội dung hiện tại sẽ bị mất. Bạn muốn tiếp tục ?',
            () => {
                templateSelect.dataset.prevValue = value;
                if (value === 'empty') {
                    editor.innerHTML = '<p>Bắt đầu viết...</p>';
                    editor.classList.remove('landscape-mode');
                    editor.style.fontFamily = "'Tahoma', 'Segoe UI', sans-serif";
                    if (fontFamilySelect) fontFamilySelect.value = "'Tahoma', 'Segoe UI', sans-serif";
                    updateCounts();
                    triggerAutoSave();
                } else if (EDITOR_TEMPLATES[value]) {
                    editor.innerHTML = EDITOR_TEMPLATES[value];
                    ensureTitleEditButtons();
                    if (value === 'anh-tai-cau-long') {
                        editor.classList.add('landscape-mode');
                        editor.style.fontFamily = "'Times New Roman', Times, serif";
                        if (fontFamilySelect) fontFamilySelect.value = "'Times New Roman', Times, serif";
                    } else {
                        editor.classList.remove('landscape-mode');
                        editor.style.fontFamily = "'Tahoma', 'Segoe UI', sans-serif";
                        if (fontFamilySelect) fontFamilySelect.value = "'Tahoma', 'Segoe UI', sans-serif";
                    }
                    updateCounts();
                    triggerAutoSave();
                    window.showToast('Đã tải mẫu văn bản thành công!');
                }
            },
            () => {
                templateSelect.value = templateSelect.dataset.prevValue || 'empty';
            },
            'Đồng ý',
            'Ở lại'
        );
    });

    // Clear Workspace
    btnClear.addEventListener('click', () => {
        showCustomConfirm(
            'Bạn có chắc chắn muốn xóa toàn bộ nội dung văn bản này?',
            () => {
                editor.innerHTML = '<p><br></p>';
                updateCounts();
                triggerAutoSave();
                window.showToast('Đã xóa toàn bộ nội dung!', 'warning');
            },
            null,
            'Đồng ý',
            'Ở lại'
        );
    });

    // Copy Content
    btnCopy.addEventListener('click', () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editor.innerHTML;
        tempDiv.querySelectorAll('.no-export').forEach(el => el.remove());
        const text = tempDiv.innerText;
        navigator.clipboard.writeText(text).then(() => {
            window.showToast('Đã copy văn bản vào clipboard!');
        }).catch(err => {
            window.showToast('Không thể sao chép văn bản!', 'error');
        });
    });

    // Print & Export to PDF
    btnPrint.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editor.innerHTML;
        tempDiv.querySelectorAll('.no-export').forEach(el => el.remove());
        const contentHtml = tempDiv.innerHTML;
        
        const isLandscape = editor.classList.contains('landscape-mode');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>In văn bản - Văn phòng Sài Gòn</title>
                <style>
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        padding: 40px;
                        color: #333;
                        line-height: 1.6;
                        font-size: 12pt;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    @media print {
                        body { padding: 0; }
                        @page {
                            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
                            margin: 1.5cm;
                        }
                    }
                </style>
            </head>
            <body>
                ${contentHtml}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });

    // Download as Word Document (.doc)
    btnDownload.addEventListener('click', () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editor.innerHTML;
        tempDiv.querySelectorAll('.no-export').forEach(el => el.remove());
        const content = tempDiv.innerHTML;
        
        const isLandscape = editor.classList.contains('landscape-mode');
        
        const html = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <title>Văn bản - Văn phòng Sài Gòn</title>
                <meta charset="utf-8">
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>100</w:Zoom>
                        <w:DoNotOptimizeForBrowser/>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    body {
                        font-family: 'Times New Roman', Times, serif;
                    }
                    @page Section1 {
                        size: ${isLandscape ? '841.9pt 595.3pt' : '595.3pt 841.9pt'};
                        mso-page-orientation: ${isLandscape ? 'landscape' : 'portrait'};
                        margin: 1.0in 1.0in 1.0in 1.0in;
                    }
                    div.Section1 {
                        page: Section1;
                    }
                </style>
            </head>
            <body>
                <div class="Section1">
                    ${content}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff' + html], {
            type: 'application/msword;charset=utf-8'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VanBan_SaiGonOffice_${Date.now()}.doc`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

        window.showToast('Đã tải xuống tệp tin .doc...');
    });

    // Font Family selection
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', (e) => {
            const font = e.target.value;
            editor.style.fontFamily = font;
            
            // Clean up any inline font-family styles inside the editor so that they inherit the root font-family
            const elementsWithFont = editor.querySelectorAll('[style*="font-family"]');
            elementsWithFont.forEach(el => {
                el.style.fontFamily = '';
                if (el.getAttribute('style') === '' || el.style.length === 0) {
                    el.removeAttribute('style');
                }
            });
            
            // Also apply to current selection if any
            document.execCommand('fontName', false, font);
            editor.focus();
            triggerAutoSave();
        });
    }

    // Excel import elements
    const btnExcelImport = document.getElementById('btn-excel-import');
    const excelUploadInput = document.getElementById('excel-upload-input');
    const btnExcelTemplate = document.getElementById('btn-excel-template');
    
    if (btnExcelTemplate) {
        btnExcelTemplate.addEventListener('click', () => {
            downloadExcelTemplate();
        });
    }
    
    if (btnExcelImport && excelUploadInput) {
        btnExcelImport.addEventListener('click', () => {
            // Check if there is an active table, if not prompt
            const table = editor.querySelector('table');
            if (!table) {
                showCustomConfirm(
                    'Tính năng này sẽ tự động tải mẫu bảng "anh Tài - cầu lông" trước khi nhập Excel. Bạn có đồng ý không?',
                    () => {
                        editor.innerHTML = EDITOR_TEMPLATES['anh-tai-cau-long'];
                        editor.classList.add('landscape-mode');
                        if (templateSelect) {
                            templateSelect.value = 'anh-tai-cau-long';
                            templateSelect.dataset.prevValue = 'anh-tai-cau-long';
                        }
                        if (fontFamilySelect) fontFamilySelect.value = "'Times New Roman', Times, serif";
                        editor.style.fontFamily = "'Times New Roman', Times, serif";
                        excelUploadInput.click();
                    },
                    null,
                    'Đồng ý',
                    'Ở lại'
                );
            } else {
                excelUploadInput.click();
            }
        });

        excelUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const rawJson = XLSX.utils.sheet_to_json(worksheet);

                    if (rawJson.length === 0) {
                        window.showToast('File Excel không có dữ liệu!', 'error');
                        return;
                    }

                    const items = parseExcelData(rawJson);
                    const tableHtml = generateTableHtml(items);
                    
                    let dataTable = editor.querySelector('table.doc-data-table') || editor.querySelector('table:has(thead)');
                    let tbody = dataTable ? dataTable.querySelector('tbody') : null;
                    if (!tbody) {
                        // Create the default table structure if it was deleted or cleared
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = `
                            <table class="doc-data-table" style="width: 100%; border: 1px solid #000000; border-collapse: collapse; font-size: 11px;">
                                <thead>
                                    <tr style="background-color: #ffffff; text-align: center; font-weight: bold;">
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 4%; vertical-align: middle;">STT</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 22%; vertical-align: middle;">Họ và tên/ Đơn vị</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 22%; vertical-align: middle;">Chức vụ</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 16%; vertical-align: middle;">Địa chỉ (cơ quan/đơn vị / nhà riêng)</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 6%; vertical-align: middle;">Số lượng (hộp)</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 8%; vertical-align: middle;">Đơn vị / cá nhân đề xuất</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 14%; vertical-align: middle;">Lãnh đạo duyệt</th>
                                        <th style="border: 1px solid #000000; padding: 8px 4px; width: 8%; vertical-align: middle;">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        `;
                        editor.appendChild(wrapper.firstElementChild);
                        dataTable = editor.querySelector('table.doc-data-table');
                        tbody = dataTable ? dataTable.querySelector('tbody') : null;
                        
                        // Set layout mode to landscape when inserting a table
                        editor.classList.add('landscape-mode');
                        const fontFamilySelect = document.getElementById('font-family-select');
                        editor.style.fontFamily = "'Times New Roman', Times, serif";
                        if (fontFamilySelect) fontFamilySelect.value = "'Times New Roman', Times, serif";
                    }

                    if (tbody) {
                        tbody.innerHTML = tableHtml;
                    }
                    ensureSignatureBlock();
                    updateCounts();
                    triggerAutoSave();
                    window.showToast('Nhập danh sách từ Excel thành công!');
                } catch (err) {
                    console.error(err);
                    window.showToast('Lỗi khi đọc file Excel: ' + err.message, 'error');
                }
                // Clear input so same file can be selected again
                excelUploadInput.value = '';
            };
            reader.readAsArrayBuffer(file);
        });
    }

    // Data and Report Modal Handlers
    const btnShowData = document.getElementById('btn-show-data');
    const btnShowReport = document.getElementById('btn-show-report');
    
    const dataModal = document.getElementById('data-modal');
    const reportModal = document.getElementById('report-modal');
    
    const closeDataModal = document.getElementById('close-data-modal');
    const closeDataModalFooter = document.getElementById('btn-close-data-modal-footer');
    
    const closeReportModal = document.getElementById('close-report-modal');
    const closeReportModalFooter = document.getElementById('btn-close-report-modal-footer');

    const btnClearAllData = document.getElementById('btn-clear-all-data');

    if (btnShowData && dataModal) {
        btnShowData.addEventListener('click', () => {
            currentModalData = extractDataFromEditorTable();
            
            // Reset filter values
            const filterGroup = document.getElementById('filter-group');
            const filterProposer = document.getElementById('filter-proposer');
            const filterApprover = document.getElementById('filter-approver');
            if (filterGroup) filterGroup.value = '';
            if (filterProposer) filterProposer.value = '';
            if (filterApprover) filterApprover.value = '';

            populateFilterOptions(currentModalData);
            renderModalGridFiltered();
            dataModal.classList.add('show');
        });

        const hideData = () => dataModal.classList.remove('show');
        if (closeDataModal) closeDataModal.addEventListener('click', hideData);
        if (closeDataModalFooter) closeDataModalFooter.addEventListener('click', hideData);
    }

    if (btnClearAllData) {
        btnClearAllData.addEventListener('click', () => {
            showCustomConfirm(
                'Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu trong bảng hiện tại không? Hành động này không thể hoàn tác.',
                () => {
                    currentModalData = [];
                    
                    // Clear the table body in the editor using generateTableHtml
                    const tableHtml = generateTableHtml([]);
                    const dataTable = editor.querySelector('table.doc-data-table') || editor.querySelector('table:has(thead)');
                    const tbody = dataTable ? dataTable.querySelector('tbody') : null;
                    if (tbody) {
                        tbody.innerHTML = tableHtml;
                    }
                    ensureSignatureBlock();
                    
                    // Update stats and trigger autosave
                    updateCounts();
                    triggerAutoSave();
                    
                    // Refresh modal grid
                    populateFilterOptions([]);
                    renderModalGridFiltered();
                    
                    if (window.showToast) {
                        window.showToast("Đã xóa toàn bộ dữ liệu thành công!");
                    }
                },
                null,
                'Xóa',
                'Hủy'
            );
        });
    }

    // Bind filter select change events
    const filterGroup = document.getElementById('filter-group');
    const filterProposer = document.getElementById('filter-proposer');
    const filterApprover = document.getElementById('filter-approver');
    
    if (filterGroup) filterGroup.addEventListener('change', renderModalGridFiltered);
    if (filterProposer) filterProposer.addEventListener('change', renderModalGridFiltered);
    if (filterApprover) filterApprover.addEventListener('change', renderModalGridFiltered);

    if (btnShowReport && reportModal) {
        btnShowReport.addEventListener('click', () => {
            const data = extractDataFromEditorTable();
            generateReport(data);
            reportModal.classList.add('show');
        });

        const btnExportReportExcel = document.getElementById('btn-export-report-excel');
        if (btnExportReportExcel) {
            btnExportReportExcel.addEventListener('click', exportReportToExcel);
        }

        const hideReport = () => reportModal.classList.remove('show');
        if (closeReportModal) closeReportModal.addEventListener('click', hideReport);
        if (closeReportModalFooter) closeReportModalFooter.addEventListener('click', hideReport);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === dataModal) {
            dataModal.classList.remove('show');
        }
        if (e.target === reportModal) {
            reportModal.classList.remove('show');
        }
    });
}

// Live table parsing and dynamic aggregation
function extractDataFromEditorTable() {
    const editor = document.getElementById('rich-editor');
    if (!editor) return [];
    const table = editor.querySelector('table.doc-data-table') || editor.querySelector('table:has(thead)');
    if (!table) return [];

    const rows = table.querySelectorAll('tbody tr');
    const data = [];
    let currentGroupName = 'Khác';
    let currentSubgroupName = 'Khác';

    rows.forEach(row => {
        const firstCellText = row.cells[0]?.textContent.trim();
        
        // Detect if this is a group header row (Yellow row)
        const isGroupHeader = row.classList.contains('group-header-row') || 
            (row.cells.length === 4 && row.cells[1]?.colSpan === 3 && !row.cells[0]?.textContent.trim().endsWith('.'));

        // Skip yellow summary row (but NOT group headers)
        if (!isGroupHeader && (firstCellText === '(1)' || row.style.backgroundColor === 'rgb(255, 255, 0)' || row.getAttribute('style')?.includes('#ffff00'))) {
            return;
        }

        // 1. Detect Nhóm header row (Yellow row)
        if (isGroupHeader) {
            const stt = row.cells.length === 4 ? row.cells[0]?.textContent.trim() : '';
            const title = row.cells.length === 4 ? row.cells[1]?.textContent.trim() : row.cells[0]?.textContent.trim();
            currentGroupName = normalizeGroupName(stt ? `${stt} - ${title}` : title);
            return;
        }

        // 2. Detect Ban ngành header row (White row)
        if (row.classList.contains('subgroup-header-row') || 
            (row.cells.length <= 3 && (row.cells[1]?.colSpan >= 5 || (firstCellText && firstCellText.endsWith('.')))) ||
            (row.cells.length === 4 && row.cells[1]?.colSpan === 3 && row.cells[0]?.textContent.trim().endsWith('.'))) {
            
            currentSubgroupName = row.cells.length === 4 ? row.cells[1]?.textContent.trim() : (row.cells[1]?.textContent.trim() || 'Khác');
            // Backwards compatibility for single-level tables
            if (currentGroupName === 'Khác' || !currentGroupName) {
                currentGroupName = currentSubgroupName;
            }
            return;
        }

        // 3. Parse member row
        if (row.cells.length >= 7) {
            let stt, name, title, address, qty, proposer, approver, note;
            
            if (row.cells.length === 8) {
                stt = row.cells[0].textContent.trim();
                name = row.cells[1].textContent.trim();
                title = row.cells[2].textContent.trim();
                address = row.cells[3].textContent.trim();
                qty = parseFloat(row.cells[4].textContent.trim()) || 0;
                proposer = row.cells[5].textContent.trim();
                approver = row.cells[6].textContent.trim();
                note = row.cells[7].textContent.trim();
            } else if (row.cells.length === 7) {
                stt = row.cells[0].textContent.trim();
                name = row.cells[1].textContent.trim();
                title = row.cells[2].textContent.trim();
                
                // Address is rowspanned (inherited from previous row with 8 cells)
                let prev = row.previousElementSibling;
                while (prev) {
                    if (prev.cells.length === 8) {
                        address = prev.cells[3].textContent.trim();
                        break;
                    }
                    prev = prev.previousElementSibling;
                }
                
                qty = parseFloat(row.cells[3].textContent.trim()) || 0;
                proposer = row.cells[4].textContent.trim();
                approver = row.cells[5].textContent.trim();
                note = row.cells[6].textContent.trim();
            } else {
                return;
            }
            // Map abbreviation
            const propUpper = proposer.trim().toUpperCase();
            if (propUpper === 'VP HĐTV') proposer = 'Văn phòng HĐTV';
            else if (propUpper === 'PHKD') proposer = 'Phòng Kinh doanh';
            else if (propUpper === 'PCHE') proposer = 'Phòng Pháp chế';
            else if (propUpper === 'KTAT') proposer = 'Phòng Kỹ thuật An toàn';
            else if (propUpper === 'TCKT') proposer = 'Phòng Tài chính Kế toán';

            data.push({
                group: currentGroupName,
                subgroup: currentSubgroupName,
                stt,
                name,
                title,
                address: address || '',
                qty,
                proposer,
                approver,
                note
            });
        }
    });

    return data;
}

let currentModalData = [];

function populateFilterOptions(data) {
    const filterGroup = document.getElementById('filter-group');
    const filterProposer = document.getElementById('filter-proposer');
    const filterApprover = document.getElementById('filter-approver');

    // Helper to get unique sorted values
    const getUniqueVals = (key) => {
        const vals = new Set();
        data.forEach(item => {
            if (item[key]) vals.add(item[key]);
        });
        return Array.from(vals).sort();
    };

    if (filterGroup) {
        const selected = filterGroup.value;
        filterGroup.innerHTML = '<option value="">Tất cả</option>';
        getUniqueVals('group').forEach(val => {
            filterGroup.innerHTML += `<option value="${val}" ${val === selected ? 'selected' : ''}>${val}</option>`;
        });
    }

    if (filterProposer) {
        const selected = filterProposer.value;
        filterProposer.innerHTML = '<option value="">Tất cả</option>';
        getUniqueVals('proposer').forEach(val => {
            filterProposer.innerHTML += `<option value="${val}" ${val === selected ? 'selected' : ''}>${val}</option>`;
        });
    }

    if (filterApprover) {
        const selected = filterApprover.value;
        filterApprover.innerHTML = '<option value="">Tất cả</option>';
        getUniqueVals('approver').forEach(val => {
            filterApprover.innerHTML += `<option value="${val}" ${val === selected ? 'selected' : ''}>${val}</option>`;
        });
    }
}

function renderModalGridFiltered() {
    const table = document.getElementById('excel-grid-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const filterGroupVal = document.getElementById('filter-group')?.value || '';
    const filterProposerVal = document.getElementById('filter-proposer')?.value || '';
    const filterApproverVal = document.getElementById('filter-approver')?.value || '';

    const filtered = currentModalData.filter(item => {
        const matchGroup = !filterGroupVal || item.group === filterGroupVal;
        const matchProposer = !filterProposerVal || item.proposer === filterProposerVal;
        const matchApprover = !filterApproverVal || item.approver === filterApproverVal;
        return matchGroup && matchProposer && matchApprover;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; color: #94a3b8; padding: 20px;">Không tìm thấy dữ liệu trùng khớp với bộ lọc hoặc bảng trống.</td>
            </tr>
        `;
        return;
    }

    let tbodyHtml = '';
    filtered.forEach((item) => {
        const originalIdx = currentModalData.indexOf(item);
        
        tbodyHtml += `
            <tr>
                <td style="font-weight: bold; color: var(--primary-blue);">
                    <div>${item.group || 'Khác'}</div>
                    ${item.subgroup && item.subgroup !== item.group ? `<div style="font-size: 11px; color: #64748b; font-weight: normal; margin-top: 2px;">${item.subgroup}</div>` : ''}
                </td>
                <td style="text-align: center;">${item.stt}</td>
                <td style="font-weight: 500;">${item.name}</td>
                <td>${item.title}</td>
                <td>${item.address}</td>
                <td style="text-align: center; font-weight: bold; color: #166534;">${item.qty}</td>
                <td>${item.proposer}</td>
                <td>${item.approver}</td>
                <td>${item.note}</td>
                <td style="text-align: center;">
                    <button class="btn-delete-row" data-index="${originalIdx}" style="background: none; border: none; color: var(--danger-red); cursor: pointer; font-size: 1.3rem; padding: 2px 5px;" title="Xóa dòng này">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = tbodyHtml;

    // Attach event listeners to delete buttons
    tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            showCustomConfirm(
                'Bạn có chắc chắn muốn xóa dòng dữ liệu này không?',
                () => {
                    deleteGridRow(idx);
                },
                null,
                'Xóa',
                'Hủy'
            );
        });
    });
}

function deleteGridRow(idx) {
    // 1. Remove from local dataset
    currentModalData.splice(idx, 1);
    
    // 2. Generate new table body HTML
    const tableHtml = generateTableHtml(currentModalData);
    
    // 3. Update editor DOM
    const editor = document.getElementById('rich-editor');
    const dataTable = editor?.querySelector('table.doc-data-table') || editor?.querySelector('table:has(thead)');
    const tbody = dataTable ? dataTable.querySelector('tbody') : null;
    if (tbody) {
        tbody.innerHTML = tableHtml;
    }
    ensureSignatureBlock();
    
    // 4. Update stats and trigger autosave
    updateCounts();
    triggerAutoSave();
    
    // 5. Refresh grid and filter options in the modal
    populateFilterOptions(currentModalData);
    renderModalGridFiltered();
    
    if (window.showToast) {
        window.showToast("Đã xóa dòng dữ liệu thành công!");
    }
}

function generateReport(data) {
    const totalGroupsEl = document.getElementById('report-total-groups');
    const totalDeptsEl = document.getElementById('report-total-depts');
    const totalPeopleEl = document.getElementById('report-total-people');
    const totalBoxesEl = document.getElementById('report-total-boxes');
    const tableBody = document.getElementById('report-table-body');

    if (data.length === 0) {
        if (totalGroupsEl) totalGroupsEl.textContent = '0';
        if (totalDeptsEl) totalDeptsEl.textContent = '0';
        if (totalPeopleEl) totalPeopleEl.textContent = '0';
        if (totalBoxesEl) totalBoxesEl.textContent = '0';
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">Không có dữ liệu để báo cáo.</td>
                </tr>
            `;
        }
        return;
    }

    const reportData = {};
    let grandTotalBoxes = 0;
    let grandTotalPeople = 0;
    const uniqueDepts = new Set();
    const uniqueGroups = new Set();

    data.forEach(item => {
        let dept = item.proposer || 'Chưa phân loại';
        const deptUpper = dept.trim().toUpperCase();
        if (deptUpper === 'VP HĐTV') dept = 'Văn phòng HĐTV';
        else if (deptUpper === 'PHKD') dept = 'Phòng Kinh doanh';
        else if (deptUpper === 'PCHE') dept = 'Phòng Pháp chế';
        else if (deptUpper === 'KTAT') dept = 'Phòng Kỹ thuật An toàn';
        else if (deptUpper === 'TCKT') dept = 'Phòng Tài chính Kế toán';

        uniqueDepts.add(dept);

        const rawGroup = item.group || 'Khác';
        const groupName = normalizeGroupName(rawGroup);
        uniqueGroups.add(groupName);

        const key = `${groupName} ||| ${dept}`;
        
        if (!reportData[key]) {
            reportData[key] = {
                group: groupName,
                dept: dept,
                peopleCount: 0,
                boxesCount: 0
            };
        }
        reportData[key].peopleCount += 1;
        reportData[key].boxesCount += item.qty;
        grandTotalPeople += 1;
        grandTotalBoxes += item.qty;
    });

    // Convert to list and sort:
    // 1. By group name alphabetically (localeCompare)
    // 2. By boxesCount descending
    const reportList = Object.values(reportData).sort((a, b) => {
        const groupCompare = a.group.localeCompare(b.group);
        if (groupCompare !== 0) return groupCompare;
        return b.boxesCount - a.boxesCount;
    });

    // Calculate rowspan for Group column
    let i = 0;
    while (i < reportList.length) {
        let run = 1;
        while (i + run < reportList.length && reportList[i + run].group === reportList[i].group) {
            run++;
        }
        for (let j = 0; j < run; j++) {
            reportList[i + j].rowspan = (j === 0) ? run : 0;
        }
        i += run;
    }

    if (totalGroupsEl) totalGroupsEl.textContent = uniqueGroups.size;
    if (totalDeptsEl) totalDeptsEl.textContent = uniqueDepts.size;
    if (totalPeopleEl) totalPeopleEl.textContent = grandTotalPeople;
    if (totalBoxesEl) totalBoxesEl.textContent = grandTotalBoxes;

    let tbodyHtml = '';
    reportList.forEach((row, idx) => {
        tbodyHtml += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: 500;">${idx + 1}</td>
        `;

        if (row.rowspan > 0) {
            tbodyHtml += `
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: 600; color: #1e40af; background-color: #f8fafc;" rowspan="${row.rowspan}">
                    ${row.group}
                </td>
            `;
        }

        tbodyHtml += `
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: 500; color: var(--text-dark);">${row.dept}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; font-weight: 500;">${row.peopleCount}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #166534;">${row.boxesCount}</td>
            </tr>
        `;
    });

    // Add a summary total row at the bottom
    tbodyHtml += `
        <tr style="background: #f8fafc; font-weight: bold; border-top: 2px solid #cbd5e1;">
            <td style="padding: 10px; border: 1px solid #e5e7eb;" colspan="3">Tổng cộng</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${grandTotalPeople}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; color: #15803d;">${grandTotalBoxes}</td>
        </tr>
    `;

    if (tableBody) tableBody.innerHTML = tbodyHtml;
}

function exportReportToExcel() {
    const reportTable = document.querySelector('.report-table');
    if (!reportTable) {
        if (window.showToast) {
            window.showToast("Không tìm thấy bảng báo cáo để xuất!", "error");
        }
        return;
    }
    
    try {
        const worksheet = XLSX.utils.table_to_sheet(reportTable);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo tổng hợp");
        
        // Auto-fit column widths
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const cols = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxLen = 10;
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellRef];
                if (cell && cell.v) {
                    maxLen = Math.max(maxLen, String(cell.v).length);
                }
            }
            cols.push({ wch: maxLen + 3 });
        }
        worksheet['!cols'] = cols;
        
        XLSX.writeFile(workbook, "Bao_Cao_Tong_Hop_Qua_Tang.xlsx");
        if (window.showToast) {
            window.showToast("Đã xuất Excel báo cáo thành công!");
        }
    } catch (err) {
        console.error(err);
        if (window.showToast) {
            window.showToast("Lỗi khi xuất Excel báo cáo: " + err.message, "error");
        }
    }
}

// Remove Vietnamese diacritics / tones for robust column key matching
function removeVietnameseTones(str) {
    if (!str) return '';
    str = String(str);
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Bỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str;
}

// Canonical Group Name Normalizer to avoid split groups due to minor spelling/separators
function normalizeGroupName(gName) {
    if (!gName) return 'Khác';
    gName = String(gName).trim();
    // Replace multiple spaces with a single space
    gName = gName.replace(/\s+/g, ' ');
    
    // Match letter prefix: e.g. "A", "B", "C" followed by dot, hyphen, en-dash, em-dash, colon, spaces
    const match = gName.match(/^([A-Z])[\s\.\-\–\—\:]+(.*)$/i);
    if (match) {
        const groupStt = match[1].toUpperCase();
        const groupTitle = match[2].trim();
        return `${groupStt} - ${groupTitle}`;
    }
    return gName;
}

// Normalized Excel Parsing Helpers
function parseExcelData(rawData) {
    let lastGroup = '';
    return rawData.map(row => {
        const findVal = (prefixes) => {
            const key = Object.keys(row).find(k => 
                prefixes.some(p => {
                    const normalizedKey = removeVietnameseTones(k).toLowerCase().replace(/\s+/g, '').replace(/[-_]/g, '');
                    const normalizedPrefix = removeVietnameseTones(p).toLowerCase().replace(/\s+/g, '').replace(/[-_]/g, '');
                    return normalizedKey === normalizedPrefix || normalizedKey.includes(normalizedPrefix);
                })
            );
            return key ? row[key] : '';
        };

        const parsedGroup = findVal(['nhom', 'group']);
        const parsedSubgroup = findVal(['bannganh', 'ban_nganh', 'subgroup', 'sub_group']);
        
        let rawGroup = '';
        if (parsedGroup && String(parsedGroup).trim() !== '') {
            rawGroup = parsedGroup;
            lastGroup = parsedGroup;
        } else if (lastGroup !== '') {
            rawGroup = lastGroup;
        } else {
            rawGroup = parsedSubgroup || 'Khác';
        }

        return {
            name: findVal(['hovaten', 'hoten', 'ho_ten', 'name', 'ten']),
            title: findVal(['chucvu', 'chuc_vu', 'chuc', 'title', 'position']),
            address: findVal(['diachi', 'dia_chi', 'dia', 'address']),
            qty: parseFloat(findVal(['soluong', 'so_luong', 'quantity', 'qty', 'so'])) || 1,
            proposer: (() => {
                let p = findVal(['phong', 'donvi', 'de_xuat', 'proposed', 'nguoi_de_xuat']);
                const propUpper = p.trim().toUpperCase();
                if (propUpper === 'VP HĐTV') return 'Văn phòng HĐTV';
                if (propUpper === 'PHKD') return 'Phòng Kinh doanh';
                if (propUpper === 'PCHE') return 'Phòng Pháp chế';
                if (propUpper === 'KTAT') return 'Phòng Kỹ thuật An toàn';
                if (propUpper === 'TCKT') return 'Phòng Tài chính Kế toán';
                return p;
            })(),
            approver: findVal(['duyet', 'lanh_dao', 'approved']),
            note: findVal(['ghi', 'note']),
            group: normalizeGroupName(rawGroup),
            subgroup: (parsedSubgroup || 'Khác').trim()
        };
    });
}

function generateTableHtml(items) {
    if (!items || items.length === 0) return '';
    
    // Check if we have two distinct levels of grouping
    let hasTwoLevels = false;
    for (const item of items) {
        if (item.group && item.subgroup && item.group !== item.subgroup && item.group !== 'Khác') {
            hasTwoLevels = true;
            break;
        }
    }

    const getRoman = (num) => {
        const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
        return roman[num] || num;
    };

    let tbodyHtml = ``;

    if (hasTwoLevels) {
        // Group by Nhóm (group) first, then by Ban ngành (subgroup)
        const nestedGroups = {};
        items.forEach(item => {
            const gName = normalizeGroupName(item.group || 'Khác');
            const sgName = (item.subgroup || 'Khác').trim();
            if (!nestedGroups[gName]) {
                nestedGroups[gName] = {};
            }
            if (!nestedGroups[gName][sgName]) {
                nestedGroups[gName][sgName] = [];
            }
            nestedGroups[gName][sgName].push(item);
        });

        // Sort Nhóm alphabetically (e.g. A., B., C., D. ...)
        const sortedGroupNames = Object.keys(nestedGroups).sort((a, b) => a.localeCompare(b));

        sortedGroupNames.forEach(groupName => {
            // Split Group Name into STT and Title (e.g., "A - CƠ QUAN HÀNH CHÍNH" -> STT "A", Title "CƠ QUAN HÀNH CHÍNH")
            let groupStt = '';
            let groupTitle = groupName;
            const match = groupName.match(/^([A-Z])[\s\.\-]+(.*)$/i);
            if (match) {
                groupStt = match[1];
                groupTitle = match[2].trim();
            }

            const subgroups = nestedGroups[groupName];
            
            // Calculate total sum of quantity for this entire Nhóm
            let groupQtySum = 0;
            for (const subgroupName in subgroups) {
                groupQtySum += subgroups[subgroupName].reduce((sum, item) => sum + item.qty, 0);
            }

            // Render Nhóm header row (Yellow row)
            tbodyHtml += `
                <tr class="group-header-row" style="font-weight: bold; font-size: 11px; background-color: #ffff00; text-align: left;">
                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle; color: #ff0000;">${groupStt}</td>
                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; color: #ff0000;" colspan="3">${groupTitle}</td>
                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle; color: #ff0000;">${groupQtySum}</td>
                    <td style="border: 1px solid #000000; padding: 6px 4px;" colspan="3"></td>
                </tr>
            `;

            let subgroupIndex = 1;

            for (const subgroupName in subgroups) {
                const groupItems = subgroups[subgroupName];
                const subgroupQtySum = groupItems.reduce((sum, item) => sum + item.qty, 0);

                // Render Ban ngành header row (White row)
                tbodyHtml += `
                    <tr class="subgroup-header-row" style="font-weight: bold; font-size: 11px; background-color: #ffffff;">
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${getRoman(subgroupIndex)}.</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle;" colspan="3">${subgroupName}</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${subgroupQtySum}</td>
                        <td style="border: 1px solid #000000; padding: 6px 4px;" colspan="3"></td>
                    </tr>
                `;

                // Render member rows
                let i = 0;
                while (i < groupItems.length) {
                    let run = 1;
                    const currentAddress = groupItems[i].address;
                    
                    if (currentAddress && String(currentAddress).trim() !== '') {
                        while (i + run < groupItems.length && String(groupItems[i + run].address).trim() === String(currentAddress).trim()) {
                            run++;
                        }
                    }

                    for (let j = 0; j < run; j++) {
                        const item = groupItems[i + j];
                        const isFirstOfAddress = (j === 0);
                        
                        tbodyHtml += `
                            <tr style="font-size: 11px;">
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${i + j + 1}</td>
                                <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">${item.name}</td>
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">${String(item.title).replace(/\n/g, '<br>')}</td>
                        `;

                        if (currentAddress && String(currentAddress).trim() !== '') {
                            if (isFirstOfAddress) {
                                tbodyHtml += `
                                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle; line-height: 1.3;" rowspan="${run}">
                                        ${String(currentAddress).replace(/\n/g, '<br>')}
                                    </td>
                                `;
                            }
                        } else {
                            tbodyHtml += `
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;"></td>
                            `;
                        }

                        tbodyHtml += `
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${item.qty}</td>
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${item.proposer}</td>
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${item.approver}</td>
                                <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;">${item.note}</td>
                            </tr>
                        `;
                    }
                    i += run;
                }

                subgroupIndex++;
            }
        });
    } else {
        // Fallback to original single-level grouping (by group or subgroup)
        const groups = {};
        items.forEach(item => {
            const groupName = item.subgroup || item.group || 'Khác';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(item);
        });

        let groupIndex = 1;
        for (const groupName in groups) {
            const groupItems = groups[groupName];
            const groupQtySum = groupItems.reduce((sum, item) => sum + item.qty, 0);

            tbodyHtml += `
                <tr style="font-weight: bold; font-size: 11px;">
                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${getRoman(groupIndex)}.</td>
                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle;" colspan="6">${groupName}</td>
                    <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${groupQtySum}</td>
                </tr>
            `;

            let i = 0;
            while (i < groupItems.length) {
                let run = 1;
                const currentAddress = groupItems[i].address;
                
                if (currentAddress && String(currentAddress).trim() !== '') {
                    while (i + run < groupItems.length && String(groupItems[i + run].address).trim() === String(currentAddress).trim()) {
                        run++;
                    }
                }

                for (let j = 0; j < run; j++) {
                    const item = groupItems[i + j];
                    const isFirstOfAddress = (j === 0);
                    
                    tbodyHtml += `
                        <tr style="font-size: 11px;">
                            <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${i + j + 1}</td>
                            <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle; font-size: 13px;">${item.name}</td>
                            <td style="border: 1px solid #000000; padding: 6px 4px; text-align: left; vertical-align: middle; line-height: 1.3;">${String(item.title).replace(/\n/g, '<br>')}</td>
                    `;

                    if (currentAddress && String(currentAddress).trim() !== '') {
                        if (isFirstOfAddress) {
                            tbodyHtml += `
                                <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle; line-height: 1.3;" rowspan="${run}">
                                    ${String(currentAddress).replace(/\n/g, '<br>')}
                                </td>
                            `;
                        }
                    } else {
                        tbodyHtml += `
                            <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;"></td>
                        `;
                    }

                    tbodyHtml += `
                            <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${item.qty}</td>
                            <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${item.proposer}</td>
                            <td style="border: 1px solid #000000; padding: 6px 4px; text-align: center; vertical-align: middle;">${item.approver}</td>
                            <td style="border: 1px solid #000000; padding: 6px 4px; vertical-align: middle;">${item.note}</td>
                        </tr>
                    `;
                }
                i += run;
            }
            groupIndex++;
        }
    }

    return tbodyHtml;
}

// Global hook to send text directly into editor from other tools
window.insertTextToEditor = function(text) {
    const editor = document.getElementById('rich-editor');
    if (!editor) return false;
    
    // Append or replace
    const p = document.createElement('p');
    p.textContent = text;
    editor.appendChild(p);
    
    // Trigger input to save
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
    return true;
};

// Excel Template Generator and Downloader
function downloadExcelTemplate() {
    const data = [
        {
            "Nhóm": "A - CƠ QUAN HÀNH CHÍNH",
            "Ban ngành": "Thường trực Thành ủy",
            "Họ tên": "Ông Trần Lưu Quang",
            "Chức vụ": "Ủy viên Bộ Chính trị, Bí thư Thành ủy Thành phố Hồ Chí Minh",
            "Địa chỉ": "58 Trương Định, Phường Xuân Hòa, TP Hồ Chí Minh",
            "Số lượng": 1,
            "Người đề xuất": "Văn phòng HĐTV",
            "Lãnh đạo duyệt": "Nguyễn Phương Nam",
            "Ghi chú": ""
        },
        {
            "Nhóm": "A - CƠ QUAN HÀNH CHÍNH",
            "Ban ngành": "Thường trực Thành ủy",
            "Họ tên": "Ông Lê Quốc Phong",
            "Chức vụ": "Ủy viên BCH TW Đảng, Phó Bí thư Thường trực Thành ủy",
            "Địa chỉ": "58 Trương Định, Phường Xuân Hòa, TP Hồ Chí Minh",
            "Số lượng": 1,
            "Người đề xuất": "Văn phòng HĐTV",
            "Lãnh đạo duyệt": "Nguyễn Phương Nam",
            "Ghi chú": ""
        },
        {
            "Nhóm": "D - NGUYÊN LĐ TỔNG CTY",
            "Ban ngành": "Nguyên Lãnh đạo Tổng Công ty",
            "Họ tên": "Chu Tiến Dũng",
            "Chức vụ": "Nguyên Phó Bí thư TT Đảng ủy 10/2020 – 11/2021, Nguyên Tổng Giám đốc",
            "Địa chỉ": "58 Trương Định, Phường Xuân Hòa, TP Hồ Chí Minh",
            "Số lượng": 1,
            "Người đề xuất": "Văn phòng HĐTV",
            "Lãnh đạo duyệt": "Nguyễn Phương Nam",
            "Ghi chú": ""
        }
    ];

    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template Mau");
        
        // Auto-fit column widths
        const maxLen = {};
        data.forEach(row => {
            Object.keys(row).forEach(key => {
                const val = row[key] ? String(row[key]) : '';
                maxLen[key] = Math.max(maxLen[key] || key.length, val.length);
            });
        });
        worksheet['!cols'] = Object.keys(maxLen).map(key => ({
            wch: maxLen[key] + 4
        }));

        XLSX.writeFile(workbook, "Mau_Danh_Sach_Qua_Tang.xlsx");
        if (window.showToast) {
            window.showToast("Đã tải xuống tệp Excel mẫu thành công!");
        }
    } catch (err) {
        console.error(err);
        if (window.showToast) {
            window.showToast("Lỗi khi tạo mẫu Excel: " + err.message, "error");
        }
    }
}

function ensureSignatureBlock() {
    const editor = document.getElementById('rich-editor');
    if (!editor) return;

    // Check if it's the "anh Tài - cầu lông" document
    const templateSelect = document.getElementById('doc-template-select');
    const isAnhTaiCauLong = (templateSelect && templateSelect.value === 'anh-tai-cau-long') || 
                            (editor.innerHTML.includes('Tặng bánh Trung thu năm 2026'));

    if (isAnhTaiCauLong) {
        if (!editor.querySelector('.doc-signature-table')) {
            const table = editor.querySelector('table.doc-data-table') || editor.querySelector('table:has(thead)');
            if (table) {
                const sigDiv = document.createElement('div');
                sigDiv.innerHTML = `
                    <table class="doc-signature-table" style="width: 100%; border-collapse: collapse; border: none; font-size: 12px; margin-top: 30px; font-family: Tahoma, 'Segoe UI', sans-serif; page-break-inside: avoid;">
                        <tr>
                            <td style="width: 35%; text-align: center; vertical-align: top; padding: 0; line-height: 1.5;">
                                <div class="sig-title-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                                    <span class="sig-title" style="font-weight: bold; text-transform: uppercase;">TỔNG GIÁM ĐỐC</span>
                                    <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa chức danh">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                                <div style="height: 80px;"></div>
                                <div class="sig-name-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                                    <span class="sig-name" style="font-weight: bold;">Nguyễn Phương Nam</span>
                                    <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa họ tên">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                            </td>
                            <td style="width: 35%; text-align: center; vertical-align: top; padding: 0; line-height: 1.5;">
                                <div class="sig-title-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                                    <span class="sig-title" style="font-weight: bold; text-transform: uppercase; display: block; text-align: center;">TL. CHÁNH VĂN PHÒNG<br><span style="font-size: 11px;">PHÓ CHÁNH VĂN PHÒNG</span></span>
                                    <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa chức danh">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                                <div style="height: 62px;"></div>
                                <div class="sig-name-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                                    <span class="sig-name" style="font-weight: bold;">Mai Xuân Chánh</span>
                                    <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa họ tên">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                            </td>
                            <td style="width: 30%; text-align: center; vertical-align: top; padding: 0; line-height: 1.5;">
                                <div class="sig-title-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                                    <span class="sig-title" style="font-weight: bold; text-transform: uppercase;">NGƯỜI LẬP</span>
                                    <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa chức danh">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                                <div style="height: 80px;"></div>
                                <div class="sig-name-wrapper" style="display: inline-flex; align-items: center; gap: 4px; justify-content: center; position: relative;">
                                    <span class="sig-name" style="font-weight: bold;">Cao Minh Duy</span>
                                    <button class="btn-edit-sig no-export" contenteditable="false" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 0.8rem; padding: 2px; display: inline-flex; align-items: center; justify-content: center; outline: none;" title="Sửa họ tên">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </table>
                `;
                const sigTable = sigDiv.firstElementChild;
                
                // Insert sigTable after table
                if (table.nextSibling) {
                    table.parentNode.insertBefore(sigTable, table.nextSibling);
                } else {
                    table.parentNode.appendChild(sigTable);
                }
                
                // Auto trigger save to persist this self-healing addition
                if (typeof triggerAutoSave === 'function') {
                    triggerAutoSave();
                }
            }
        }
    }
}
