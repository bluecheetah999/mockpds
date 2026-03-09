/**
 * Mock PDS Demo Application v2
 * GAS GET対応版 - payloadパラメータ方式
 */

// ========================================
// 設定
// ========================================

// GAS Web AppのURLをここに設定
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxAyn5pj-X79mvdLPWiCfXMErLKxV6WJajC5Nfig-GXEYQUsfKyl5n2LEjOj0szBV7a/exec';

// ========================================
// グローバル変数
// ========================================

let currentUser = null;
let currentRepo = null;
let currentRecord = null;
let isEditMode = false;

// ========================================
// 初期化
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('pds_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainScreen();
        loadRepositories();
    }
});

// ========================================
// 認証
// ========================================

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    try {
        const response = await apiCall({ action: 'register', username, email });
        currentUser = response;
        localStorage.setItem('pds_user', JSON.stringify(currentUser));
        showSuccess('登録が完了しました！');
        showMainScreen();
        loadRepositories();
    } catch (error) {
        showError('登録に失敗しました: ' + error.message);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    try {
        const response = await apiCall({ action: 'login', email });
        currentUser = response;
        localStorage.setItem('pds_user', JSON.stringify(currentUser));
        showSuccess('ログインしました！');
        showMainScreen();
        loadRepositories();
    } catch (error) {
        showError('ログインに失敗しました: ' + error.message);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('pds_user');
    showLoginScreen();
    showSuccess('ログアウトしました');
}

// ========================================
// 画面遷移
// ========================================

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

function showMainScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('username').textContent = currentUser.username;
    showRepositoryList();
}

function showRepositoryList() {
    document.getElementById('repositoryListView').style.display = 'block';
    document.getElementById('recordListView').style.display = 'none';
    document.getElementById('recordDetailView').style.display = 'none';
    currentRepo = null;
    currentRecord = null;
}

function showRecordList() {
    document.getElementById('repositoryListView').style.display = 'none';
    document.getElementById('recordListView').style.display = 'block';
    document.getElementById('recordDetailView').style.display = 'none';
    currentRecord = null;
}

function showRecordDetail() {
    document.getElementById('repositoryListView').style.display = 'none';
    document.getElementById('recordListView').style.display = 'none';
    document.getElementById('recordDetailView').style.display = 'block';
}

// ========================================
// リポジトリ操作
// ========================================

async function loadRepositories() {
    try {
        const repos = await apiCall({ action: 'getRepos' });
        displayRepositories(repos);
    } catch (error) {
        showError('リポジトリの読み込みに失敗しました: ' + error.message);
    }
}

function displayRepositories(repos) {
    const container = document.getElementById('repositoryList');
    container.innerHTML = '';
    if (repos.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">リポジトリがありません。新規作成してください。</p></div>';
        return;
    }
    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3';
        const sharedBadge = repo.isShared ? '<span class="badge bg-info ms-1">共有</span>' : '';
        card.innerHTML = `
            <div class="card h-100 shadow-sm hover-card" onclick="selectRepository('${repo.repoId}')">
                <div class="card-body">
                    <h5 class="card-title"><i class="bi bi-folder-fill text-primary"></i> ${escapeHtml(repo.name)}${sharedBadge}</h5>
                    <p class="card-text text-muted">${escapeHtml(repo.description || '説明なし')}</p>
                    <small class="text-muted">作成日: ${formatDate(repo.createdAt)}</small>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showCreateRepoModal() {
    document.getElementById('repoName').value = '';
    document.getElementById('repoDescription').value = '';
    const modal = new bootstrap.Modal(document.getElementById('createRepoModal'));
    modal.show();
}

async function handleCreateRepo(event) {
    event.preventDefault();
    const name = document.getElementById('repoName').value;
    const description = document.getElementById('repoDescription').value;
    try {
        await apiCall({ action: 'createRepo', name, description });
        bootstrap.Modal.getInstance(document.getElementById('createRepoModal')).hide();
        showSuccess('リポジトリを作成しました');
        loadRepositories();
    } catch (error) {
        showError('リポジトリの作成に失敗しました: ' + error.message);
    }
}

async function selectRepository(repoId) {
    try {
        currentRepo = await apiCall({ action: 'getRepo', repoId });
        document.getElementById('currentRepoName').textContent = currentRepo.name;
        showRecordList();
        loadRecords();
    } catch (error) {
        showError('リポジトリの読み込みに失敗しました: ' + error.message);
    }
}

// ========================================
// レコード操作
// ========================================

async function loadRecords() {
    try {
        const records = await apiCall({ action: 'getRecords', repoId: currentRepo.repoId });
        displayRecords(records);
    } catch (error) {
        showError('レコードの読み込みに失敗しました: ' + error.message);
    }
}

function displayRecords(records) {
    const container = document.getElementById('recordList');
    container.innerHTML = '';
    if (records.length === 0) {
        container.innerHTML = '<p class="text-muted">レコードがありません。新規作成してください。</p>';
        return;
    }
    records.forEach(record => {
        const card = document.createElement('div');
        card.className = 'card mb-2 shadow-sm hover-card';
        card.onclick = () => selectRecord(record.recordKey);
        let preview = '';
        try {
            const data = typeof record.data === 'string' ? JSON.parse(record.data) : record.data;
            if (data && data.title) preview = data.title;
            else if (data && data.content) preview = data.content.substring(0, 50) + '...';
            else preview = JSON.stringify(data).substring(0, 50) + '...';
        } catch (e) {
            preview = 'データのプレビューを表示できません';
        }
        card.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">
                    <i class="bi bi-file-earmark-text"></i> ${escapeHtml(record.recordKey)}
                    <span class="badge bg-secondary ms-2">${escapeHtml(record.recordType)}</span>
                </h6>
                <p class="card-text text-muted small">${escapeHtml(preview)}</p>
                <small class="text-muted">更新日: ${formatDate(record.updatedAt)}</small>
            </div>
        `;
        container.appendChild(card);
    });
}

function showCreateRecordModal() {
    isEditMode = false;
    document.getElementById('recordModalTitle').textContent = '新しいレコードを作成';
    document.getElementById('recordKey').value = '';
    document.getElementById('recordKey').disabled = false;
    document.getElementById('recordKeyGroup').style.display = 'block';
    document.getElementById('recordType').value = 'com.example.note';
    document.getElementById('recordData').value = JSON.stringify({ title: '', content: '' }, null, 2);
    const modal = new bootstrap.Modal(document.getElementById('recordModal'));
    modal.show();
}

async function handleSaveRecord(event) {
    event.preventDefault();
    const recordKey = document.getElementById('recordKey').value;
    const recordType = document.getElementById('recordType').value;
    const dataText = document.getElementById('recordData').value;
    let data;
    try {
        data = JSON.parse(dataText);
    } catch (e) {
        showError('データのJSON形式が正しくありません');
        return;
    }
    try {
        if (isEditMode) {
            await apiCall({ action: 'updateRecord', repoId: currentRepo.repoId, recordKey: currentRecord.recordKey, data: JSON.stringify(data) });
            showSuccess('レコードを更新しました');
        } else {
            await apiCall({ action: 'createRecord', repoId: currentRepo.repoId, recordKey, recordType, data: JSON.stringify(data) });
            showSuccess('レコードを作成しました');
        }
        bootstrap.Modal.getInstance(document.getElementById('recordModal')).hide();
        loadRecords();
    } catch (error) {
        showError('レコードの保存に失敗しました: ' + error.message);
    }
}

async function selectRecord(recordKey) {
    try {
        currentRecord = await apiCall({ action: 'getRecord', repoId: currentRepo.repoId, recordKey });
        displayRecordDetail();
        loadRecordHistory();
    } catch (error) {
        showError('レコードの読み込みに失敗しました: ' + error.message);
    }
}

function displayRecordDetail() {
    document.getElementById('recordDetailTitle').textContent = currentRecord.recordKey;
    const data = typeof currentRecord.data === 'string' ? JSON.parse(currentRecord.data) : currentRecord.data;
    const content = document.getElementById('recordDetailContent');
    content.innerHTML = `
        <div class="mb-3">
            <strong>レコードタイプ:</strong> <span class="badge bg-secondary">${escapeHtml(currentRecord.recordType)}</span>
        </div>
        <div class="mb-3">
            <strong>作成日:</strong> ${formatDate(currentRecord.createdAt)}
        </div>
        <div class="mb-3">
            <strong>更新日:</strong> ${formatDate(currentRecord.updatedAt)}
        </div>
        <div class="mb-3">
            <strong>データ:</strong>
            <pre class="bg-light p-3 rounded">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        </div>
    `;
    showRecordDetail();
}

function editRecord() {
    isEditMode = true;
    document.getElementById('recordModalTitle').textContent = 'レコードを編集';
    document.getElementById('recordKey').value = currentRecord.recordKey;
    document.getElementById('recordKey').disabled = true;
    document.getElementById('recordKeyGroup').style.display = 'none';
    document.getElementById('recordType').value = currentRecord.recordType;
    const data = typeof currentRecord.data === 'string' ? JSON.parse(currentRecord.data) : currentRecord.data;
    document.getElementById('recordData').value = JSON.stringify(data, null, 2);
    const modal = new bootstrap.Modal(document.getElementById('recordModal'));
    modal.show();
}

async function deleteCurrentRecord() {
    if (!confirm('このレコードを削除してもよろしいですか？')) return;
    try {
        await apiCall({ action: 'deleteRecord', repoId: currentRepo.repoId, recordKey: currentRecord.recordKey });
        showSuccess('レコードを削除しました');
        showRecordList();
        loadRecords();
    } catch (error) {
        showError('レコードの削除に失敗しました: ' + error.message);
    }
}

async function loadRecordHistory() {
    try {
        const history = await apiCall({ action: 'getHistory', repoId: currentRepo.repoId, recordKey: currentRecord.recordKey });
        displayRecordHistory(history);
    } catch (error) {
        console.error('履歴の読み込みに失敗しました:', error);
        document.getElementById('recordHistory').innerHTML = '<p class="text-muted">履歴を読み込めませんでした</p>';
    }
}

function displayRecordHistory(history) {
    const container = document.getElementById('recordHistory');
    if (history.length === 0) {
        container.innerHTML = '<p class="text-muted">履歴がありません</p>';
        return;
    }
    container.innerHTML = history.map(entry => {
        let operationBadge = '';
        if (entry.operation === 'CREATE') operationBadge = '<span class="badge bg-success">作成</span>';
        else if (entry.operation === 'UPDATE') operationBadge = '<span class="badge bg-warning">更新</span>';
        else if (entry.operation === 'DELETE') operationBadge = '<span class="badge bg-danger">削除</span>';
        return `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>${operationBadge} <small class="text-muted ms-2">${escapeHtml(entry.username || '')}</small></div>
                        <small class="text-muted">${formatDate(entry.timestamp)}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// アクセス制御
// ========================================

async function showShareModal() {
    const modal = new bootstrap.Modal(document.getElementById('shareModal'));
    modal.show();
    loadAccessControlList();
    loadAllUsers();
}

async function loadAllUsers() {
    try {
        const users = await apiCall({ action: 'getUsers' });
        const select = document.getElementById('granteeUserId');
        select.innerHTML = '<option value="">ユーザーを選択...</option>';
        users.forEach(u => {
            if (u.userId !== currentUser.userId) {
                const opt = document.createElement('option');
                opt.value = u.userId;
                opt.textContent = `${u.username} (${u.email})`;
                select.appendChild(opt);
            }
        });
    } catch (error) {
        console.error('ユーザー一覧の読み込みに失敗:', error);
    }
}

async function loadAccessControlList() {
    try {
        const acl = await apiCall({ action: 'getAcl', repoId: currentRepo.repoId });
        displayAccessControlList(acl);
    } catch (error) {
        document.getElementById('aclList').innerHTML = '<p class="text-danger">アクセス権の読み込みに失敗しました</p>';
    }
}

function displayAccessControlList(acl) {
    const container = document.getElementById('aclList');
    if (acl.length === 0) {
        container.innerHTML = '<p class="text-muted">アクセス権が設定されていません</p>';
        return;
    }
    container.innerHTML = acl.map(entry => `
        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
            <div>
                <strong>${escapeHtml(entry.granteeUsername)}</strong>
                <small class="text-muted ms-1">${escapeHtml(entry.granteeEmail || '')}</small>
                <span class="badge bg-info ms-2">${escapeHtml(entry.permission)}</span>
            </div>
            <button class="btn btn-sm btn-danger" onclick="revokeAccess('${entry.aclId}')">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `).join('');
}

async function handleGrantAccess(event) {
    event.preventDefault();
    const granteeUserId = document.getElementById('granteeUserId').value;
    const permission = document.getElementById('grantPermission').value;
    if (!granteeUserId) {
        showError('ユーザーを選択してください');
        return;
    }
    try {
        await apiCall({ action: 'grantAccess', repoId: currentRepo.repoId, granteeUserId, permission });
        showSuccess('アクセス権を付与しました');
        loadAccessControlList();
    } catch (error) {
        showError('アクセス権の付与に失敗しました: ' + error.message);
    }
}

async function revokeAccess(aclId) {
    try {
        await apiCall({ action: 'revokeAccess', repoId: currentRepo.repoId, aclId });
        showSuccess('アクセス権を取り消しました');
        loadAccessControlList();
    } catch (error) {
        showError('アクセス権の取り消しに失敗しました: ' + error.message);
    }
}

// ========================================
// API呼び出し（GAS GET対応版）
// ========================================

async function apiCall(params) {
    // tokenを自動付与
    if (currentUser && currentUser.apiToken) {
        params.token = currentUser.apiToken;
    }

    // payloadとしてJSONをURLエンコードしてGETで送信
    const payload = encodeURIComponent(JSON.stringify(params));
    const url = `${API_BASE_URL}?payload=${payload}`;

    const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'APIエラーが発生しました');
    }

    return data.data;
}

// ========================================
// ユーティリティ
// ========================================

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function formatDate(isoString) {
    if (!isoString) return '不明';
    const date = new Date(isoString);
    return date.toLocaleString('ja-JP');
}

function showSuccess(message) {
    const toast = document.getElementById('toastMessage');
    if (toast) {
        document.getElementById('toastText').textContent = message;
        toast.className = 'toast align-items-center text-bg-success border-0';
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
    } else {
        alert('✓ ' + message);
    }
}

function showError(message) {
    const toast = document.getElementById('toastMessage');
    if (toast) {
        document.getElementById('toastText').textContent = message;
        toast.className = 'toast align-items-center text-bg-danger border-0';
        const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
        bsToast.show();
    } else {
        alert('✗ ' + message);
    }
}
