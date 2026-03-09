/**
 * Mock PDS Demo Application v3
 * 個人データ入力対応・GAS GET方式
 */

// ========================================
// 設定
// ========================================
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxAyn5pj-X79mvdLPWiCfXMErLKxV6WJajC5Nfig-GXEYQUsfKyl5n2LEjOj0szBV7a/exec';

// ========================================
// レコードタイプ定義
// ========================================
const RECORD_TYPES = {
  'jp.pds.profile': {
    label: '個人プロフィール',
    icon: 'bi-person-fill',
    color: 'primary',
    fields: [
      { key: 'lastName',    label: '姓',       type: 'text',   placeholder: '山田' },
      { key: 'firstName',   label: '名',       type: 'text',   placeholder: '太郎' },
      { key: 'lastNameKana',label: '姓（かな）', type: 'text',   placeholder: 'やまだ' },
      { key: 'firstNameKana',label: '名（かな）',type: 'text',   placeholder: 'たろう' },
      { key: 'birthDate',   label: '誕生日',   type: 'date',   placeholder: '' },
      { key: 'birthPlace',  label: '出生地',   type: 'text',   placeholder: '東京都渋谷区' },
      { key: 'gender',      label: '性別',     type: 'select', options: ['', '男性', '女性', 'その他', '回答しない'] },
      { key: 'nationality', label: '国籍',     type: 'text',   placeholder: '日本' },
      { key: 'occupation',  label: '職業',     type: 'text',   placeholder: 'エンジニア' },
      { key: 'note',        label: '備考',     type: 'textarea', placeholder: '' },
    ],
    templates: [
      { label: 'サンプルデータ', data: { lastName: '山田', firstName: '太郎', lastNameKana: 'やまだ', firstNameKana: 'たろう', birthDate: '1990-01-15', birthPlace: '東京都渋谷区', gender: '男性', nationality: '日本', occupation: 'ソフトウェアエンジニア', note: '' } }
    ]
  },
  'jp.pds.address': {
    label: '住所・連絡先',
    icon: 'bi-house-fill',
    color: 'success',
    fields: [
      { key: 'label',       label: '種別',     type: 'select', options: ['自宅', '勤務先', '実家', 'その他'] },
      { key: 'postalCode',  label: '郵便番号', type: 'text',   placeholder: '150-0001' },
      { key: 'prefecture',  label: '都道府県', type: 'text',   placeholder: '東京都' },
      { key: 'city',        label: '市区町村', type: 'text',   placeholder: '渋谷区' },
      { key: 'address1',    label: '番地',     type: 'text',   placeholder: '神南1-2-3' },
      { key: 'address2',    label: '建物名・部屋番号', type: 'text', placeholder: 'サンプルマンション 101号室' },
      { key: 'phone',       label: '電話番号', type: 'tel',    placeholder: '03-1234-5678' },
      { key: 'mobile',      label: '携帯番号', type: 'tel',    placeholder: '090-1234-5678' },
      { key: 'email',       label: 'メール',   type: 'email',  placeholder: 'example@email.com' },
    ],
    templates: [
      { label: '自宅サンプル', data: { label: '自宅', postalCode: '150-0001', prefecture: '東京都', city: '渋谷区', address1: '神南1-2-3', address2: 'サンプルマンション 101号室', phone: '03-1234-5678', mobile: '090-1234-5678', email: '' } }
    ]
  },
  'jp.pds.education': {
    label: '学歴',
    icon: 'bi-mortarboard-fill',
    color: 'info',
    fields: [
      { key: 'schoolName',  label: '学校名',   type: 'text',   placeholder: '○○大学' },
      { key: 'faculty',     label: '学部・学科', type: 'text',  placeholder: '工学部 情報工学科' },
      { key: 'degree',      label: '学位',     type: 'select', options: ['', '高校卒', '専門学校卒', '短大卒', '学士', '修士', '博士', 'その他'] },
      { key: 'status',      label: '状態',     type: 'select', options: ['卒業', '在学中', '中退', '休学中'] },
      { key: 'enrollDate',  label: '入学年月', type: 'month',  placeholder: '' },
      { key: 'gradDate',    label: '卒業年月', type: 'month',  placeholder: '' },
      { key: 'note',        label: '備考',     type: 'textarea', placeholder: '専攻、論文テーマなど' },
    ],
    templates: [
      { label: '大学サンプル', data: { schoolName: '○○大学', faculty: '工学部 情報工学科', degree: '学士', status: '卒業', enrollDate: '2009-04', gradDate: '2013-03', note: '卒業論文: 機械学習を用いた画像認識' } }
    ]
  },
  'jp.pds.career': {
    label: '職歴・社歴',
    icon: 'bi-briefcase-fill',
    color: 'warning',
    fields: [
      { key: 'companyName', label: '会社名',   type: 'text',   placeholder: '株式会社○○' },
      { key: 'department',  label: '部署・役職', type: 'text',  placeholder: 'システム開発部 主任' },
      { key: 'employmentType', label: '雇用形態', type: 'select', options: ['正社員', '契約社員', 'パート・アルバイト', '派遣社員', '業務委託', '役員', 'その他'] },
      { key: 'status',      label: '状態',     type: 'select', options: ['在職中', '退職済み'] },
      { key: 'joinDate',    label: '入社年月', type: 'month',  placeholder: '' },
      { key: 'leaveDate',   label: '退社年月', type: 'month',  placeholder: '在職中の場合は空欄' },
      { key: 'industry',    label: '業種',     type: 'text',   placeholder: 'IT・通信' },
      { key: 'description', label: '業務内容', type: 'textarea', placeholder: '担当した業務・プロジェクトの概要' },
    ],
    templates: [
      { label: '在職中サンプル', data: { companyName: '株式会社○○テクノロジー', department: 'システム開発部 主任', employmentType: '正社員', status: '在職中', joinDate: '2018-04', leaveDate: '', industry: 'IT・通信', description: 'Webアプリケーション開発、チームリード' } }
    ]
  },
  'jp.pds.residence': {
    label: '居住情報',
    icon: 'bi-building',
    color: 'secondary',
    fields: [
      { key: 'buildingName',label: '建物名',   type: 'text',   placeholder: '○○マンション' },
      { key: 'roomNumber',  label: '住戸番号', type: 'text',   placeholder: '101' },
      { key: 'floor',       label: '階数',     type: 'text',   placeholder: '1' },
      { key: 'ownershipType', label: '所有形態', type: 'select', options: ['賃貸', '持ち家（マンション）', '持ち家（一戸建て）', '社宅', '実家', 'その他'] },
      { key: 'moveInDate',  label: '入居年月', type: 'month',  placeholder: '' },
      { key: 'moveOutDate', label: '退去年月', type: 'month',  placeholder: '現在居住中の場合は空欄' },
      { key: 'rent',        label: '家賃（円）', type: 'number', placeholder: '80000' },
      { key: 'landlord',    label: '管理会社・大家', type: 'text', placeholder: '○○不動産' },
      { key: 'note',        label: '備考',     type: 'textarea', placeholder: 'ペット可、駐車場あり など' },
    ],
    templates: [
      { label: 'マンションサンプル', data: { buildingName: '○○マンション', roomNumber: '305', floor: '3', ownershipType: '賃貸', moveInDate: '2020-04', moveOutDate: '', rent: 85000, landlord: '○○不動産', note: 'ペット可' } }
    ]
  },
  'jp.pds.custom': {
    label: 'カスタム',
    icon: 'bi-file-earmark-code',
    color: 'dark',
    fields: [],
    templates: [
      { label: 'キーバリュー形式', data: { key1: 'value1', key2: 'value2' } },
      { label: '空のオブジェクト', data: {} }
    ]
  }
};

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
    // Tooltipの初期化
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

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
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> リポジトリがありません。「新規作成」ボタンから作成してください。<br>
                    <small class="text-muted">例: 「個人プロフィール」「住所録」「職歴」などのリポジトリを作成できます。</small>
                </div>
            </div>`;
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
                    <p class="card-text text-muted small">${escapeHtml(repo.description || '説明なし')}</p>
                    <small class="text-muted">作成日: ${formatDate(repo.createdAt)}</small>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

function showCreateRepoModal() {
    document.getElementById('repoName').value = '';
    document.getElementById('repoDescription').value = '';
    new bootstrap.Modal(document.getElementById('createRepoModal')).show();
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
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> レコードがありません。「レコード追加」ボタンからデータを追加してください。<br>
                <small class="text-muted">個人プロフィール、住所、学歴、職歴などのテンプレートが用意されています。</small>
            </div>`;
        return;
    }
    records.forEach(record => {
        const typeInfo = RECORD_TYPES[record.recordType] || { label: record.recordType, icon: 'bi-file-earmark', color: 'secondary' };
        const card = document.createElement('div');
        card.className = 'card mb-2 shadow-sm hover-card';
        card.onclick = () => selectRecord(record.recordKey);

        let preview = '';
        try {
            const data = typeof record.data === 'string' ? JSON.parse(record.data) : record.data;
            if (data) {
                // タイプ別のプレビュー
                if (record.recordType === 'jp.pds.profile') {
                    preview = [data.lastName, data.firstName].filter(Boolean).join(' ') || JSON.stringify(data).substring(0, 60);
                } else if (record.recordType === 'jp.pds.address') {
                    preview = [data.label, data.postalCode, data.prefecture, data.city].filter(Boolean).join(' ') || JSON.stringify(data).substring(0, 60);
                } else if (record.recordType === 'jp.pds.education') {
                    preview = [data.schoolName, data.faculty, data.degree].filter(Boolean).join(' / ') || JSON.stringify(data).substring(0, 60);
                } else if (record.recordType === 'jp.pds.career') {
                    preview = [data.companyName, data.department, data.status].filter(Boolean).join(' / ') || JSON.stringify(data).substring(0, 60);
                } else if (record.recordType === 'jp.pds.residence') {
                    preview = [data.buildingName, data.roomNumber ? data.roomNumber + '号室' : ''].filter(Boolean).join(' ') || JSON.stringify(data).substring(0, 60);
                } else {
                    const vals = Object.values(data).filter(v => v && typeof v === 'string');
                    preview = vals.slice(0, 3).join(' / ') || JSON.stringify(data).substring(0, 60);
                }
            }
        } catch (e) { preview = ''; }

        card.innerHTML = `
            <div class="card-body py-2">
                <div class="d-flex align-items-center">
                    <span class="badge bg-${typeInfo.color} me-2"><i class="bi ${typeInfo.icon}"></i> ${typeInfo.label}</span>
                    <strong class="me-2">${escapeHtml(record.recordKey)}</strong>
                    <span class="text-muted small">${escapeHtml(preview)}</span>
                    <small class="text-muted ms-auto">${formatDate(record.updatedAt)}</small>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

// ========================================
// レコード作成/編集モーダル
// ========================================
function showCreateRecordModal() {
    isEditMode = false;
    document.getElementById('recordModalTitle').innerHTML = '<i class="bi bi-file-earmark-plus"></i> レコードを追加';
    document.getElementById('recordKey').value = '';
    document.getElementById('recordKey').disabled = false;
    document.getElementById('recordKeyGroup').style.display = '';
    document.getElementById('recordType').value = 'jp.pds.profile';
    onRecordTypeChange();
    new bootstrap.Modal(document.getElementById('recordModal')).show();
}

function onRecordTypeChange() {
    const type = document.getElementById('recordType').value;
    const typeInfo = RECORD_TYPES[type] || RECORD_TYPES['jp.pds.custom'];

    // テンプレートボタン
    const tplSection = document.getElementById('templateSection');
    const tplBtns = document.getElementById('templateButtons');
    if (!isEditMode && typeInfo.templates && typeInfo.templates.length > 0) {
        tplSection.style.display = '';
        tplBtns.innerHTML = typeInfo.templates.map((t, i) =>
            `<button type="button" class="btn btn-sm btn-outline-primary template-btn" onclick="applyTemplate(${i})">
                <i class="bi bi-lightning-fill"></i> ${escapeHtml(t.label)}
            </button>`
        ).join('');
    } else {
        tplSection.style.display = 'none';
    }

    // フォーム入力エリア
    renderFormFields(typeInfo.fields);

    // JSONプレビューを初期化
    if (!isEditMode) {
        const defaultData = {};
        typeInfo.fields.forEach(f => { defaultData[f.key] = ''; });
        document.getElementById('recordData').value = JSON.stringify(defaultData, null, 2);
    }
}

function renderFormFields(fields) {
    const area = document.getElementById('formInputArea');
    if (!fields || fields.length === 0) {
        area.innerHTML = '<p class="text-muted small">JSONを直接編集してください。</p>';
        return;
    }
    area.innerHTML = fields.map(f => {
        let input = '';
        if (f.type === 'select') {
            input = `<select class="form-select form-select-sm" id="field_${f.key}" onchange="syncFormToJson()">
                ${f.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
            </select>`;
        } else if (f.type === 'textarea') {
            input = `<textarea class="form-control form-control-sm" id="field_${f.key}" rows="2" placeholder="${escapeHtml(f.placeholder || '')}" oninput="syncFormToJson()"></textarea>`;
        } else {
            input = `<input type="${f.type}" class="form-control form-control-sm" id="field_${f.key}" placeholder="${escapeHtml(f.placeholder || '')}" oninput="syncFormToJson()">`;
        }
        return `
            <div class="row field-row align-items-center">
                <div class="col-4 col-md-3"><label class="field-label small mb-0" for="field_${f.key}">${escapeHtml(f.label)}</label></div>
                <div class="col-8 col-md-9">${input}</div>
            </div>`;
    }).join('');
}

function applyTemplate(index) {
    const type = document.getElementById('recordType').value;
    const typeInfo = RECORD_TYPES[type];
    if (!typeInfo || !typeInfo.templates[index]) return;
    const data = typeInfo.templates[index].data;

    // フォームに値をセット
    typeInfo.fields.forEach(f => {
        const el = document.getElementById('field_' + f.key);
        if (el && data[f.key] !== undefined) el.value = data[f.key];
    });
    document.getElementById('recordData').value = JSON.stringify(data, null, 2);
}

function syncFormToJson() {
    const type = document.getElementById('recordType').value;
    const typeInfo = RECORD_TYPES[type];
    if (!typeInfo || typeInfo.fields.length === 0) return;

    const data = {};
    typeInfo.fields.forEach(f => {
        const el = document.getElementById('field_' + f.key);
        if (el) {
            const v = el.value;
            data[f.key] = (f.type === 'number' && v !== '') ? Number(v) : v;
        }
    });
    document.getElementById('recordData').value = JSON.stringify(data, null, 2);
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
        showError('JSONの形式が正しくありません。確認してください。');
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
        showError('保存に失敗しました: ' + error.message);
    }
}

async function selectRecord(recordKey) {
    try {
        currentRecord = await apiCall({ action: 'getRecord', repoId: currentRepo.repoId, recordKey });
        displayRecordDetail();
        loadRecordHistory();
        showRecordDetail();
    } catch (error) {
        showError('レコードの読み込みに失敗しました: ' + error.message);
    }
}

function displayRecordDetail() {
    const typeInfo = RECORD_TYPES[currentRecord.recordType] || { label: currentRecord.recordType, icon: 'bi-file-earmark', color: 'secondary', fields: [] };
    document.getElementById('recordDetailTitle').textContent = currentRecord.recordKey;
    document.getElementById('recordDetailType').innerHTML = `<span class="badge bg-${typeInfo.color}"><i class="bi ${typeInfo.icon}"></i> ${typeInfo.label}</span>`;

    const data = typeof currentRecord.data === 'string' ? JSON.parse(currentRecord.data) : (currentRecord.data || {});
    const content = document.getElementById('recordDetailContent');

    let html = `<div class="row mb-2">
        <div class="col-md-6"><small class="text-muted">作成日: ${formatDate(currentRecord.createdAt)}</small></div>
        <div class="col-md-6"><small class="text-muted">更新日: ${formatDate(currentRecord.updatedAt)}</small></div>
    </div>`;

    if (typeInfo.fields && typeInfo.fields.length > 0) {
        // 定義済みフィールドを見やすく表示
        html += '<div class="table-responsive"><table class="table table-sm table-borderless">';
        typeInfo.fields.forEach(f => {
            const val = data[f.key];
            if (val !== undefined && val !== '') {
                html += `<tr>
                    <td class="text-muted" style="width:140px;white-space:nowrap">${escapeHtml(f.label)}</td>
                    <td><strong>${escapeHtml(String(val))}</strong></td>
                </tr>`;
            }
        });
        html += '</table></div>';
        // 未定義フィールドがあればJSONで補完表示
        const knownKeys = typeInfo.fields.map(f => f.key);
        const extraKeys = Object.keys(data).filter(k => !knownKeys.includes(k));
        if (extraKeys.length > 0) {
            const extra = {};
            extraKeys.forEach(k => { extra[k] = data[k]; });
            html += `<details class="mt-2"><summary class="text-muted small">追加フィールド</summary><pre class="bg-light p-2 rounded small mt-1">${escapeHtml(JSON.stringify(extra, null, 2))}</pre></details>`;
        }
    } else {
        html += `<pre class="bg-light p-3 rounded">${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
    }

    content.innerHTML = html;
}

function editRecord() {
    isEditMode = true;
    document.getElementById('recordModalTitle').innerHTML = '<i class="bi bi-pencil"></i> レコードを編集';
    document.getElementById('recordKey').value = currentRecord.recordKey;
    document.getElementById('recordKey').disabled = true;
    document.getElementById('recordKeyGroup').style.display = 'none';
    document.getElementById('recordType').value = currentRecord.recordType || 'jp.pds.custom';
    document.getElementById('templateSection').style.display = 'none';

    const typeInfo = RECORD_TYPES[currentRecord.recordType] || RECORD_TYPES['jp.pds.custom'];
    renderFormFields(typeInfo.fields);

    const data = typeof currentRecord.data === 'string' ? JSON.parse(currentRecord.data) : (currentRecord.data || {});
    // フォームに既存値をセット
    typeInfo.fields.forEach(f => {
        const el = document.getElementById('field_' + f.key);
        if (el && data[f.key] !== undefined) el.value = data[f.key];
    });
    document.getElementById('recordData').value = JSON.stringify(data, null, 2);

    new bootstrap.Modal(document.getElementById('recordModal')).show();
}

async function deleteCurrentRecord() {
    if (!confirm(`「${currentRecord.recordKey}」を削除してもよろしいですか？`)) return;
    try {
        await apiCall({ action: 'deleteRecord', repoId: currentRepo.repoId, recordKey: currentRecord.recordKey });
        showSuccess('レコードを削除しました');
        showRecordList();
        loadRecords();
    } catch (error) {
        showError('削除に失敗しました: ' + error.message);
    }
}

async function loadRecordHistory() {
    try {
        const history = await apiCall({ action: 'getHistory', repoId: currentRepo.repoId, recordKey: currentRecord.recordKey });
        displayRecordHistory(history);
    } catch (error) {
        document.getElementById('recordHistory').innerHTML = '<p class="text-muted small">履歴を読み込めませんでした</p>';
    }
}

function displayRecordHistory(history) {
    const container = document.getElementById('recordHistory');
    if (history.length === 0) {
        container.innerHTML = '<p class="text-muted small">履歴がありません</p>';
        return;
    }
    container.innerHTML = history.map(entry => {
        const badges = { CREATE: '<span class="badge bg-success">作成</span>', UPDATE: '<span class="badge bg-warning text-dark">更新</span>', DELETE: '<span class="badge bg-danger">削除</span>' };
        return `<div class="history-item ${entry.operation} mb-2">
            <div class="d-flex justify-content-between">
                <div>${badges[entry.operation] || entry.operation} <small class="text-muted ms-1">${escapeHtml(entry.username || '')}</small></div>
                <small class="text-muted">${formatDate(entry.timestamp)}</small>
            </div>
        </div>`;
    }).join('');
}

// ========================================
// アクセス制御
// ========================================
async function showShareModal() {
    new bootstrap.Modal(document.getElementById('shareModal')).show();
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
    } catch (error) { console.error(error); }
}

async function loadAccessControlList() {
    try {
        const acl = await apiCall({ action: 'getAcl', repoId: currentRepo.repoId });
        displayAccessControlList(acl);
    } catch (error) {
        document.getElementById('aclList').innerHTML = '<p class="text-danger small">アクセス権の読み込みに失敗しました</p>';
    }
}

function displayAccessControlList(acl) {
    const container = document.getElementById('aclList');
    if (acl.length === 0) {
        container.innerHTML = '<p class="text-muted small">アクセス権が設定されていません</p>';
        return;
    }
    container.innerHTML = acl.map(entry => `
        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
            <div>
                <strong>${escapeHtml(entry.granteeUsername)}</strong>
                <small class="text-muted ms-1">${escapeHtml(entry.granteeEmail || '')}</small>
                <span class="badge bg-info ms-2">${escapeHtml(entry.permission)}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="revokeAccess('${entry.aclId}')">
                <i class="bi bi-x"></i>
            </button>
        </div>`).join('');
}

async function handleGrantAccess(event) {
    event.preventDefault();
    const granteeUserId = document.getElementById('granteeUserId').value;
    const permission = document.getElementById('grantPermission').value;
    if (!granteeUserId) { showError('ユーザーを選択してください'); return; }
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
    if (currentUser && currentUser.apiToken) {
        params.token = currentUser.apiToken;
    }
    const payload = encodeURIComponent(JSON.stringify(params));
    const url = `${API_BASE_URL}?payload=${payload}`;
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
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
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('ja-JP');
}

function showSuccess(message) {
    const toast = document.getElementById('toastMessage');
    document.getElementById('toastText').textContent = message;
    toast.className = 'toast align-items-center text-bg-success border-0';
    new bootstrap.Toast(toast, { delay: 3000 }).show();
}

function showError(message) {
    const toast = document.getElementById('toastMessage');
    document.getElementById('toastText').textContent = message;
    toast.className = 'toast align-items-center text-bg-danger border-0';
    new bootstrap.Toast(toast, { delay: 5000 }).show();
}
