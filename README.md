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
- responseは以下の項目をjson形式で返却する
  - id : int
  - task : string(255)
  - end_date : yyyy-mm-dd
  - created_at : yyyy-mm-dd
  - updated_at : yyyy-mm-dd
  
### POST /tasks

- body で連携されたタスクを DB に登録する
- body は json 形式で以下の項目を設定すること
  - task : string(255)
  - end_date : yyyy-mm-dd
  - created_at : yyyy-mm-dd
  - updated_at : yyyy-mm-dd
- responseはデータ登録後のDBに登録されているデータ全件をjson形式で返却する
  - id : int
  - task : string(255)
  - end_date : yyyy-mm-dd
  - created_at : yyyy-mm-dd
  - updated_at : yyyy-mm-dd
  
### DELETE /tasks/:id

- クエリパラメータで連携された ID をキーに DB に登録されているタスクを削除する
- responseは削除後のDBに登録されているデータ全件をjson形式で返却する
  - id : int
  - task : string(255)
  - end_date : yyyy-mm-dd
  - created_at : yyyy-mm-dd
  - updated_at : yyyy-mm-dd
  
### PUT /tasks/:id

- クエリパラメータで連携された ID をキーに DB に登録されているタスクを更新する
- 更新するデータはjson形式で以下の項目を設定すること
  - task : string(255)
  - end_date : yyyy-mm-dd
- responseは更新後のDBに登録されているデータ全件をjson形式で返却する
  - id : int
  - task : string(255)
  - end_date : yyyy-mm-dd
  - created_at : yyyy-mm-dd
  - updated_at : yyyy-mm-dd

<!-- ### PATCH /tasks

- クエリパラメータで連携された ID をキーに DB に登録されているデータを更新する
- 更新データは body で連携する
- ID は{ id: `id`}の形式で連携する
- すでに DB に登録されている内容と連携されたデータを比較し、差分がある項目を更新する
  - 比較対象の項目は task,end_date -->

## DB 構成

### データベース

- データベース名、ユーザ名、パスワードは個人で設定する
- 本 API を利用する際は .env.example ファイルをコピーし、同階層に env.local を作成して設定内容を記載すること

### テーブル

- migration ファイル

  - `db/migrations/配下`のファイルを参照すること
  - table 構築する際は`npm run migrate`を実行する

- tasks
  | 項目名 | 型 | 桁数 | 概要 |
  | ---------- | ------ | ---- | ---------------------------- |
  | id | int | | タスクを一意に特定する主キー<br>データ登録時に自動採番される |
  | task | string | 255 | タスクの内容 |
  | end_date | date | | タスク終了期限 |
  | created_at | date | | データ登録日 |
  | updated_at | date | | データ更新日 |
