/**
 * Supabase Connection & Synchronization Script
 * File: supabase.js
 */

const SUPABASE_URL = 'https://jhebreoxwuimlqwvjdok.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ycoHhRg7v4s11N6AKoUsEA_9wLW6L1s';

let supabase = null;

// Initialize Supabase client helper
function initSupabaseClient() {
    if (!supabase && window.supabase) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Supabase client initialized successfully.');
        } catch (e) {
            console.error('Failed to initialize Supabase client:', e);
        }
    }
    return supabase;
}

// Update Sync Status Widget
function updateSyncStatus(status, text) {
    const widget = document.getElementById('supabase-sync-status');
    if (!widget) return;

    widget.className = 'supabase-sync-status ' + status;
    const span = widget.querySelector('span');
    const icon = widget.querySelector('i');
    
    if (span) span.textContent = 'Supabase: ' + text;
    
    if (icon) {
        if (status === 'syncing') {
            icon.className = 'fa-solid fa-rotate fa-spin';
        } else if (status === 'online') {
            icon.className = 'fa-solid fa-cloud-arrow-up';
        } else {
            icon.className = 'fa-solid fa-cloud-arrow-down';
        }
    }
}

// Document Sync functions
async function syncSaveDocument(content) {
    localStorage.setItem('vpsg-editor-content', content);
    initSupabaseClient();
    if (!supabase) return;
    updateSyncStatus('syncing', 'Đang lưu...');
    try {
        const { error } = await supabase
            .from('taicaulong_documents')
            .upsert({
                id: 'latest_doc',
                title: 'Bản thảo hiện tại',
                content: content,
                updated_at: new Date().toISOString()
            });
        
        if (error) throw error;
        updateSyncStatus('online', 'Đã đồng bộ');
    } catch (err) {
        console.warn('Supabase sync document failed. Using offline storage.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
}

async function syncLoadDocument() {
    initSupabaseClient();
    if (!supabase) return localStorage.getItem('vpsg-editor-content');
    updateSyncStatus('syncing', 'Đang tải...');
    try {
        const { data, error } = await supabase
            .from('taicaulong_documents')
            .select('*')
            .eq('id', 'latest_doc')
            .maybeSingle();

        if (error) throw error;
        if (data && data.content) {
            updateSyncStatus('online', 'Đã kết nối');
            localStorage.setItem('vpsg-editor-content', data.content);
            return data.content;
        }
    } catch (err) {
        console.warn('Supabase load document failed. Using offline storage.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
    return localStorage.getItem('vpsg-editor-content');
}

// Meetings Sync functions
async function syncSaveMeeting(meetingData) {
    let saved = JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
    saved = saved.filter(m => m.id !== meetingData.id);
    saved.unshift(meetingData);
    localStorage.setItem('vpsg-meetings', JSON.stringify(saved));

    initSupabaseClient();
    if (!supabase) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabase
            .from('taicaulong_meetings')
            .upsert({
                id: meetingData.id,
                title: meetingData.title,
                date: meetingData.date,
                location: meetingData.location,
                attendees: meetingData.attendees,
                agenda: meetingData.agenda,
                notes: meetingData.notes,
                actions: JSON.stringify(meetingData.actions),
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        updateSyncStatus('online', 'Đã đồng bộ');
    } catch (err) {
        console.warn('Supabase sync meeting failed.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
}

async function syncDeleteMeeting(id) {
    let saved = JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
    saved = saved.filter(m => m.id !== id);
    localStorage.setItem('vpsg-meetings', JSON.stringify(saved));

    initSupabaseClient();
    if (!supabase) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabase
            .from('taicaulong_meetings')
            .delete()
            .eq('id', id);

        if (error) throw error;
        updateSyncStatus('online', 'Đã đồng bộ');
    } catch (err) {
        console.warn('Supabase delete meeting failed.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
}

async function syncLoadMeetings() {
    initSupabaseClient();
    if (!supabase) return JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
    updateSyncStatus('syncing', 'Đang tải...');
    try {
        const { data, error } = await supabase
            .from('taicaulong_meetings')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        if (data) {
            const formatted = data.map(item => ({
                id: item.id,
                title: item.title,
                date: item.date,
                location: item.location,
                attendees: item.attendees,
                agenda: item.agenda,
                notes: item.notes,
                actions: Array.isArray(item.actions) ? item.actions : JSON.parse(item.actions || '[]')
            }));
            localStorage.setItem('vpsg-meetings', JSON.stringify(formatted));
            updateSyncStatus('online', 'Đã kết nối');
            return formatted;
        }
    } catch (err) {
        console.warn('Supabase load meetings failed. Using offline storage.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
    return JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
}

// Tasks Sync functions
async function syncSaveTask(taskData) {
    let tasks = JSON.parse(localStorage.getItem('vpsg-tasks')) || [];
    tasks = tasks.filter(t => t.id !== taskData.id);
    tasks.unshift(taskData);
    localStorage.setItem('vpsg-tasks', JSON.stringify(tasks));

    initSupabaseClient();
    if (!supabase) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabase
            .from('taicaulong_tasks')
            .upsert({
                id: taskData.id,
                name: taskData.name,
                category: taskData.category,
                priority: taskData.priority,
                deadline: taskData.deadline,
                completed: taskData.completed,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        updateSyncStatus('online', 'Đã đồng bộ');
    } catch (err) {
        console.warn('Supabase sync task failed.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
}

async function syncDeleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('vpsg-tasks')) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('vpsg-tasks', JSON.stringify(tasks));

    initSupabaseClient();
    if (!supabase) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabase
            .from('taicaulong_tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        updateSyncStatus('online', 'Đã đồng bộ');
    } catch (err) {
        console.warn('Supabase delete task failed.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
}

async function syncLoadTasks() {
    initSupabaseClient();
    if (!supabase) return JSON.parse(localStorage.getItem('vpsg-tasks')) || [];
    updateSyncStatus('syncing', 'Đang tải...');
    try {
        const { data, error } = await supabase
            .from('taicaulong_tasks')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        if (data) {
            localStorage.setItem('vpsg-tasks', JSON.stringify(data));
            updateSyncStatus('online', 'Đã kết nối');
            return data;
        }
    } catch (err) {
        console.warn('Supabase load tasks failed. Using offline storage.', err);
        updateSyncStatus('offline', 'Lưu offline');
    }
    return JSON.parse(localStorage.getItem('vpsg-tasks')) || [];
}

// Global hooks
window.syncSaveDocument = syncSaveDocument;
window.syncLoadDocument = syncLoadDocument;
window.syncSaveMeeting = syncSaveMeeting;
window.syncDeleteMeeting = syncDeleteMeeting;
window.syncLoadMeetings = syncLoadMeetings;
window.syncSaveTask = syncSaveTask;
window.syncDeleteTask = syncDeleteTask;
window.syncLoadTasks = syncLoadTasks;

// Initial Sync check
document.addEventListener('DOMContentLoaded', async () => {
    initSupabaseClient();
    if (supabase) {
        updateSyncStatus('online', 'Đang kết nối...');
        try {
            const { error } = await supabase.from('taicaulong_documents').select('id').limit(1);
            if (error) throw error;
            updateSyncStatus('online', 'Đã kết nối');
        } catch (err) {
            console.warn('Supabase table check failed (tables may not exist yet):', err.message);
            updateSyncStatus('offline', 'Cần tạo bảng');
        }
    } else {
        updateSyncStatus('offline', 'Chưa kết nối');
    }
});
