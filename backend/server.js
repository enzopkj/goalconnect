require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// Mock Database / モックデータベース
// ==========================================
// In-memory storage for demonstration purposes
// デモ用のインメモリデータストレージ
const users = [
    { email: 'user1@example.com', password: 'password123', name: 'Alice Smith', dob: '1990-01-01' },
    { email: 'user2@example.com', password: 'password123', name: 'Bob Jones', dob: '1985-05-15' },
    { email: 'user3@example.com', password: 'password123', name: 'Charlie Day', dob: '1992-12-30' },
    { email: 'user4@example.com', password: 'password123', name: 'Diana Prince', dob: '1988-07-07' },
    { email: 'user5@example.com', password: 'password123', name: 'Evan Peters', dob: '1995-03-22' },
    { email: 'enzopkj@hotmail.com', password: 'password123', name: 'Enzo PKJ', dob: '1990-01-01' }
];

// Token store for reset flow: { email: { token, expires } }
// パスワードリセット用トークンストア
const resetTokens = {};

// ==========================================
// API Endpoints / APIエンドポイント
// ==========================================

// Login Endpoint / ログインエンドポイント
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful', user: { email: user.email, name: user.name } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Register Endpoint / 登録エンドポイント
app.post('/api/register', (req, res) => {
    const { email, password, dob } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    // Add new user to mock DB / 新しいユーザーをモックDBに追加
    users.push({ email, password, name: 'New User', dob: dob || '2000-01-01' });
    res.json({ success: true, message: 'User registered successfully' });
});

// Step 1: Verify Email + DOB -> Generate Link
// ステップ1: メールと生年月日を確認 -> リンク生成
app.post('/api/forgot-password', (req, res) => {
    const { email, dob } = req.body;
    const user = users.find(u => u.email === email && u.dob === dob);

    if (!user) {
        // Security: Don't reveal if user exists
        // セキュリティ: ユーザーが存在するかどうかを明かさない
        return res.status(400).json({ success: false, message: 'Invalid email or Date of Birth' });
    }

    // Generate mock token (valid for 5 mins)
    // モックトークンを生成 (5分間有効)
    const token = Math.random().toString(36).substring(7);
    const expires = Date.now() + 5 * 60 * 1000;
    resetTokens[email] = { token, expires };

    // Mock Email Trigger / モックメール送信トリガー
    console.log(`[EMAIL TRIGGER] Sending Temporary Password Link to ${email}`);
    console.log(`[EMAIL CONTENT] Link: http://localhost:5173/change-password?email=${email}&token=${token}`);
    console.log(`[EMAIL INFO] Link expires in 5 minutes.`);

    res.json({ success: true, message: 'If details match, a reset link has been sent to your email.' });
});

// Step 2: Change Password
// ステップ2: パスワード変更
app.post('/api/change-password', (req, res) => {
    const { email, token, newPassword } = req.body;

    const record = resetTokens[email];
    if (!record || record.token !== token) {
        return res.status(400).json({ success: false, message: 'Invalid or missing reset token' });
    }

    if (Date.now() > record.expires) {
        return res.status(400).json({ success: false, message: 'Token has expired' });
    }

    // Update Password / パスワード更新
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        delete resetTokens[email]; // Consume token / トークンを消費

        // Mock Confirmation Email
        console.log(`[EMAIL TRIGGER] Sending Password Changed Confirmation to ${email}`);
        res.json({ success: true, message: 'Password updated successfully. Please login.' });
    } else {
        res.status(500).json({ success: false, message: 'User not found' });
    }
});

// ==========================================
// Social Login (OAuth 2.0) / ソーシャルログイン
// ==========================================

// Helper to simulate "logging in" a user after social auth
// ソーシャル認証後のユーザーログイン処理ヘルパー
const handleSocialUser = (email, name, provider) => {
    let user = users.find(u => u.email === email);
    if (!user) {
        // Auto-register / 自動登録
        user = {
            id: users.length + 1,
            email,
            password: null, // Social users might not have a password / ソーシャルユーザーはパスワードを持たない場合がある
            name,
            dob: null,
            provider
        };
        users.push(user);
        console.log(`[${provider}] New user registered: ${email}`);
    } else {
        console.log(`[${provider}] Existing user logged in: ${email}`);
    }
    return user;
};

// Google Auth / Google認証
app.get('/api/auth/google', (req, res) => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };
    const qs = new URLSearchParams(options);
    res.redirect(`${rootUrl}?${qs.toString()}`);
});

app.get('/api/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, FRONTEND_URL } = process.env;

    try {
        // 1. Exchange code for tokens / コードをトークンと交換
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();
        if (!tokens.access_token) throw new Error('Failed to retrieve Google tokens');

        // 2. Get User Info / ユーザー情報の取得
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const googleUser = await userResponse.json();

        // 3. Handle User locally / ローカルでユーザー処理
        handleSocialUser(googleUser.email, googleUser.name, 'google');

        // 4. Redirect to Frontend / フロントエンドへリダイレクト
        res.redirect(`${FRONTEND_URL || 'http://localhost:5173'}?social_login=success&provider=google`);

    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.redirect(`${FRONTEND_URL || 'http://localhost:5173'}?social_login=error&message=${encodeURIComponent('Google login failed')}`);
    }
});

// LINE Auth / LINE認証
app.get('/api/auth/line', (req, res) => {
    const rootUrl = 'https://access.line.me/oauth2/v2.1/authorize';
    const state = Math.random().toString(36).substring(7);
    const options = {
        response_type: 'code',
        client_id: process.env.LINE_CHANNEL_ID,
        redirect_uri: process.env.LINE_REDIRECT_URI,
        state: state,
        scope: 'profile openid email',
    };
    const qs = new URLSearchParams(options);
    res.redirect(`${rootUrl}?${qs.toString()}`);
});

app.get('/api/auth/line/callback', async (req, res) => {
    const code = req.query.code;
    const { LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, LINE_REDIRECT_URI, FRONTEND_URL } = process.env;

    try {
        // 1. Exchange code for tokens / コードをトークンと交換
        const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: LINE_REDIRECT_URI,
                client_id: LINE_CHANNEL_ID,
                client_secret: LINE_CHANNEL_SECRET,
            }),
        });

        const tokens = await tokenResponse.json();
        if (!tokens.id_token) throw new Error('Failed to retrieve LINE tokens');

        // 2. Decode ID Token / IDトークンのデコード
        // Simplified for demo / デモ用に簡略化
        const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());

        // 3. Handle User / ユーザー処理
        handleSocialUser(payload.email || `line_user_${payload.sub}@example.com`, payload.name, 'line');

        // 4. Redirect / リダイレクト
        res.redirect(`${FRONTEND_URL || 'http://localhost:5173'}?social_login=success&provider=line`);

    } catch (error) {
        console.error('LINE Login Error:', error.message);
        res.redirect(`${FRONTEND_URL || 'http://localhost:5173'}?social_login=error&message=${encodeURIComponent('LINE login failed')}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
