/**
 * Supabase Connection & Synchronization Script
 * File: supabase.js
 */

const SUPABASE_URL = 'https://jhebreoxwuimlqwvjdok.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ycoHhRg7v4s11N6AKoUsEA_9wLW6L1s';

// Renamed from 'supabase' to 'supabaseClient' to avoid naming conflicts
// with the global 'window.supabase' / 'var supabase' defined by the CDN.
let supabaseClient = null;

// Initialize Supabase client helper
function initSupabaseClient() {
    if (!supabaseClient && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Supabase client initialized successfully.');
        } catch (e) {
            console.error('Failed to initialize Supabase client:', e);
        }
    }
    return supabaseClient;
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
    if (!supabaseClient) return;
    updateSyncStatus('syncing', 'Đang lưu...');
    try {
        const { error } = await supabaseClient
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
    if (!supabaseClient) return localStorage.getItem('vpsg-editor-content');
    updateSyncStatus('syncing', 'Đang tải...');
    try {
        const { data, error } = await supabaseClient
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
    if (!supabaseClient) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabaseClient
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
    if (!supabaseClient) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabaseClient
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
    if (!supabaseClient) return JSON.parse(localStorage.getItem('vpsg-meetings')) || [];
    updateSyncStatus('syncing', 'Đang tải...');
    try {
        const { data, error } = await supabaseClient
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
    if (!supabaseClient) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabaseClient
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
    if (!supabaseClient) return;
    updateSyncStatus('syncing', 'Đang đồng bộ...');
    try {
        const { error } = await supabaseClient
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
    if (!supabaseClient) return JSON.parse(localStorage.getItem('vpsg-tasks')) || [];
    updateSyncStatus('syncing', 'Đang tải...');
    try {
        const { data, error } = await supabaseClient
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

// Gifts List Sync functions
async function syncSaveGifts(giftsList) {
    initSupabaseClient();
    if (!supabaseClient) return;
    try {
        // Delete all existing records for this project so we can replace them with the new list
        const { error: deleteError } = await supabaseClient
            .from('taicaulong_gifts')
            .delete()
            .neq('id', 0); // deletes all rows

        if (deleteError) throw deleteError;

        if (!giftsList || giftsList.length === 0) return;

        // Insert new records
        const rowsToInsert = giftsList.map((item, index) => ({
            stt: item.stt || String(index + 1),
            group_name: item.group || 'Khác',
            subgroup_name: item.subgroup || 'Khác',
            name: item.name || '',
            title: item.title || '',
            address: item.address || '',
            qty: parseFloat(item.qty) || 0,
            proposer: item.proposer || '',
            approver: item.approver || '',
            note: item.note || ''
        }));

        // Supabase allows bulk inserts
        const { error: insertError } = await supabaseClient
            .from('taicaulong_gifts')
            .insert(rowsToInsert);

        if (insertError) throw insertError;
        console.log('Successfully synchronized structured gifts to Supabase.');
    } catch (err) {
        console.warn('Failed to sync gifts to Supabase:', err);
    }
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
window.syncSaveGifts = syncSaveGifts;

// Initial Sync check
async function checkInitialSync() {
    initSupabaseClient();
    if (supabaseClient) {
        updateSyncStatus('syncing', 'Đang kết nối...');
        try {
            // Check taicaulong_documents
            const { error } = await supabaseClient.from('taicaulong_documents').select('id').limit(1);
            if (error) throw error;

            // Check taicaulong_gifts
            const { error: giftsError } = await supabaseClient.from('taicaulong_gifts').select('id').limit(1);
            if (giftsError) {
                console.warn('taicaulong_gifts table check failed. It might not exist yet:', giftsError.message);
                updateSyncStatus('offline', 'Cần tạo bảng gifts');
                return;
            }

            updateSyncStatus('online', 'Đã kết nối');
        } catch (err) {
            console.warn('Supabase table check failed:', err.message);
            updateSyncStatus('offline', 'Cần tạo bảng / Lỗi bảng');
        }
    } else {
        if (!window.supabase) {
            updateSyncStatus('offline', 'Lỗi tải CDN (Bị chặn?)');
        } else {
            updateSyncStatus('offline', 'Lỗi cấu hình');
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkInitialSync);
} else {
    checkInitialSync();
}

