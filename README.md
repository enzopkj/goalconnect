# Modern OAuth 2.0 Login System / モダンOAuth 2.0ログインシステム

A premium, responsive, and identifiable authentication system featuring email/password login, social authentication (Google & LINE), and theme customization.
メール/パスワードログイン、ソーシャル認証（Google＆LINE）、およびテーマカスタマイズ機能を備えた、プレミアムでレスポンシブな認証システム。

## Features / 機能

*   **Email & Password Auth**: Login, Sign Up, Forgot Password, Change Password flow.
    *   **メール＆パスワード認証**: ログイン、登録、パスワード忘れ、パスワード変更フロー。
*   **Social Login**: Real OAuth 2.0 integration with Google and LINE.
    *   **ソーシャルログイン**: GoogleおよびLINEとのリアルタイムOAuth 2.0統合。
*   **Internationalization (i18n)**: One-click English/Japanese toggle.
    *   **国際化 (i18n)**: ワンクリックで英語/日本語を切り替え。
*   **Theming**: Easily switch between 3 presets (Dark Blue, Goal Connect Green, 16-Bit Retro).
    *   **テーマ**: 3つのプリセット（ダークブルー、Goal Connectグリーン、16ビットレトロ）を簡単に切り替え可能。
*   **Responsive**: Optimized for Desktop and Mobile.
    *   **レスポンシブ**: デスクトップおよびモバイル向けに最適化。

## Project Structure / プロジェクト構造

*   `backend/`: Node.js + Express server for API handling and auth.
    *   `backend/`: API処理と認証のためのNode.js + Expressサーバー。
*   `frontend/`: React + Vite application for the UI.
    *   `frontend/`: UI用のReact + Viteアプリケーション。
*   `frontend/src/styles/theme.css`: **Theme Configuration File**. Edit this to change designs.
    *   `frontend/src/styles/theme.css`: **テーマ設定ファイル**。デザインを変更するにはここを編集します。

## How to Run / 実行方法

1.  **Install Dependencies / 依存関係のインストール**:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

2.  **Start the App / アプリの起動**:
    Return to the root folder and run:
    ルートフォルダに戻り、以下を実行します:
    ```bash
    start.bat
    ```
    This will launch both Backend (port 3000) and Frontend (port 5173).
    これにより、バックエンド（ポート3000）とフロントエンド（ポート5173）の両方が起動します。

## Changing Themes / テーマの変更

Open `frontend/src/styles/theme.css` and uncomment the block you want to use.
`frontend/src/styles/theme.css` を開き、使用したいブロックのコメントを解除してください。

*   **Dark Blue**: Original premium look.
*   **Goal Connect**: Fresh green, corporate look.
*   **16-Bit Retro**: Pixelated, high-contrast gaming look.
