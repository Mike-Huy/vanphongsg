/**
 * VĂN PHÒNG SÀI GÒN - Task Manager Module
 * File: tasks.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initTaskManager();
});

const DEFAULT_TASKS = [
    {
        id: 'task_1',
        name: 'Soạn thảo đơn xin nghỉ phép gửi Trưởng phòng',
        category: 'Soạn thảo',
        priority: 'Cao',
        deadline: '2026-07-06',
        completed: false
    },
    {
        id: 'task_2',
        name: 'Ghi âm và tóm tắt biên bản cuộc họp giao ban tuần',
        category: 'Họp hành',
        priority: 'Trung bình',
        deadline: '2026-07-08',
        completed: true
    },
    {
        id: 'task_3',
        name: 'Chỉnh sửa ảnh chân dung thẻ làm thẻ nhân viên mới',
        category: 'Hình ảnh',
        priority: 'Thấp',
        deadline: '2026-07-12',
        completed: false
    },
    {
        id: 'task_4',
        name: 'Ký điện tử hợp đồng thuê mặt bằng văn phòng',
        category: 'Ký duyệt',
        priority: 'Cao',
        deadline: '2026-07-07',
        completed: false
    }
];

function initTaskManager() {
    const form = document.getElementById('task-form');
    const inputName = document.getElementById('task-name');
    const inputCategory = document.getElementById('task-category');
    const inputPriority = document.getElementById('task-priority');
    const inputDeadline = document.getElementById('task-deadline');
    const tbody = document.getElementById('task-list-tbody');
    const filterButtons = document.querySelectorAll('.task-filters button');

    if (!form) return;

    // Default deadline to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    inputDeadline.value = tomorrow.toISOString().split('T')[0];

    // Load tasks or set defaults
    let tasks = [];
    const loadTasksData = async () => {
        tasks = window.syncLoadTasks ? await window.syncLoadTasks() : (JSON.parse(localStorage.getItem('vpsg-tasks')) || []);
        if (!tasks || tasks.length === 0) {
            tasks = DEFAULT_TASKS;
            if (window.syncSaveTask) {
                for (const t of tasks) {
                    await window.syncSaveTask(t);
                }
            } else {
                localStorage.setItem('vpsg-tasks', JSON.stringify(tasks));
            }
        }
        renderTasks();
    };
    loadTasksData();

    // Form submit to add task
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskName = inputName.value.trim();
        if (!taskName) return;

        const newTask = {
            id: 'task_' + Date.now(),
            name: taskName,
            category: inputCategory.value,
            priority: inputPriority.value,
            deadline: inputDeadline.value,
            completed: false
        };

        tasks.unshift(newTask);
        if (window.syncSaveTask) {
            window.syncSaveTask(newTask).then(() => {
                form.reset();
                inputDeadline.value = tomorrow.toISOString().split('T')[0];
                window.showToast('Đã thêm công việc thành công!');
                renderTasks();
            });
        } else {
            localStorage.setItem('vpsg-tasks', JSON.stringify(tasks));
            form.reset();
            inputDeadline.value = tomorrow.toISOString().split('T')[0];
            window.showToast('Đã thêm công việc thành công!');
            renderTasks();
        }
    });

    // Task list filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            activeFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });

    // Toggle Task completion
    window.toggleTaskCompleted = function(id) {
        let toggledTask = null;
        tasks = tasks.map(task => {
            if (task.id === id) {
                const nextState = !task.completed;
                if (nextState) {
                    window.showToast('Hoàn thành công việc! Tuyệt vời 🎉');
                }
                toggledTask = { ...task, completed: nextState };
                return toggledTask;
            }
            return task;
        });
        
        if (toggledTask && window.syncSaveTask) {
            window.syncSaveTask(toggledTask).then(() => {
                renderTasks();
            });
        } else {
            localStorage.setItem('vpsg-tasks', JSON.stringify(tasks));
            renderTasks();
        }
    };

    // Delete Task
    window.deleteTask = function(id) {
        const executeDelete = () => {
            if (window.syncDeleteTask) {
                window.syncDeleteTask(id).then(() => {
                    tasks = tasks.filter(task => task.id !== id);
                    renderTasks();
                    window.showToast('Đã xóa công việc.', 'warning');
                });
            } else {
                tasks = tasks.filter(task => task.id !== id);
                localStorage.setItem('vpsg-tasks', JSON.stringify(tasks));
                renderTasks();
                window.showToast('Đã xóa công việc.', 'warning');
            }
        };

        if (window.showCustomConfirm) {
            window.showCustomConfirm('Xóa công việc này khỏi danh sách?', executeDelete, null, 'Xóa', 'Hủy');
        } else {
            if (confirm('Xóa công việc này khỏi danh sách?')) {
                executeDelete();
            }
        }
    };

    // Render tasks table helper
    function renderTasks() {
        tbody.innerHTML = '';
        
        // Filter tasks
        let filteredTasks = tasks;
        if (activeFilter === 'pending') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (activeFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        if (filteredTasks.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-20 text-gray">
                        Không có công việc nào trong danh sách bộ lọc này.
                    </td>
                </tr>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const tr = document.createElement('tr');
            if (task.completed) {
                tr.classList.add('completed-task');
            }

            // Priority class
            let priorityBadgeClass = 'badge-low';
            if (task.priority === 'Cao') priorityBadgeClass = 'badge-high';
            else if (task.priority === 'Trung bình') priorityBadgeClass = 'badge-medium';

            // Format deadline display
            const parts = task.deadline.split('-');
            const deadlineDisplay = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : task.deadline;

            tr.innerHTML = `
                <td style="text-align: center;">
                    <div class="checkbox-center">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompleted('${task.id}')">
                    </div>
                </td>
                <td class="task-name-text font-bold" style="font-size: 1.05rem;">${task.name}</td>
                <td><span class="badge badge-cat">${task.category}</span></td>
                <td style="text-align: center;"><span class="badge ${priorityBadgeClass}">${task.priority}</span></td>
                <td style="font-size: 0.9rem; color: #475569;">${deadlineDisplay}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-delete-task" onclick="deleteTask('${task.id}')" title="Xóa việc">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }
}
