# to-do-app

## プロジェクト目的

- todo リストを作成、更新、削除するアプリを作成する
- （余裕があれば）ユーザ別に登録できるようにする

## 環境構築

- 本リポジトリをクローンし、npm install で必要なパッケージをインストールする
- 各起動コマンドは package.json の scripts を参照すること

## API 仕様

### 前提

- DB は各ユーザのローカルに postgresSQL で「DB 構成」に記載されているテーブルを準備すること

### GET /tasks

- DB に登録されているタスクを全件取得する

### POST /tasks

- body で連携されたデータを DB に登録する

### DELETE /tasks

- クエリパラメータで連携された ID をキーに DB に登録されているデータを削除する
- ID は{ id: `id`}の形式で連携する

### PUT /tasks

- クエリパラメータで連携された ID をキーに DB に登録されているデータを更新する
- 更新データは body で連携する
- ID は{ id: `id`}の形式で連携する
- 更新対象は task, end_date

### PATCH /tasks

- クエリパラメータで連携された ID をキーに DB に登録されているデータを更新する
- 更新データは body で連携する
- ID は{ id: `id`}の形式で連携する
- すでに DB に登録されている内容と連携されたデータを比較し、差分がある項目を更新する
  - 比較対象の項目は task,end_date

## DB 構成

### データベース

- データベース名、ユーザ名、パスワードは個人で設定する
- 本 API を利用する際は .env.example ファイルをコピーし、同階層に env.local を作成して設定内容を記載すること

### テーブル

- migration ファイル

  - `db/migrations/配下`のファイルを参照すること
  - table 構築する際は`npm run migrate`を実行する

- tasks
  - タスクを管理するテーブル
  - id
    - タスクを一意に特定する主キー
    - データ登録時にシステムで自動採番する
    - index
  - task
    - タスクの中身
    - string
  - end_date
    - タスク終了期限日
    - date
  - created_at
    - データ登録日
    - date
  - updated_at
    - データ更新日
    - date
