# FindJob

Website tuyen dung full-stack theo huong `React SPA + Spring Boot REST API + MySQL`, toi uu de nguoi moi clone ve co the chay duoc dung voi moi truong public website ra ngoai.

## Stack da chot

- Backend: `Java 21`, `Spring Boot`, `Spring Security`, `JWT`, `Flyway`
- Frontend: `React`, `Vite`, `Axios`, `React Router`
- Database: `MySQL 8`
- API docs: `Swagger / OpenAPI`
- Login: `Email + password` va `Google`

## 1. Chay local nhanh nhat cho nguoi moi

### Yeu cau

- JDK 21
- Node.js 20+
- Git

### Chay backend

Backend profile `dev` dung MySQL giong production, chi khac o gia tri env va viec co the bat seed demo.

Neu chua tao MySQL local, co the import script:

```sql
SOURCE scripts/mysql/setup_local.sql;
```

Windows:

```powershell
cd backend
.\start.cmd
```

Hoac:

```powershell
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

macOS / Linux:

```bash
cd backend
./start.sh
```

Truoc khi chay backend, tao database:

```sql
CREATE DATABASE job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sau khi backend len:

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Health check: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

### Chay frontend

Tao file `.env` tu `frontend/.env.example` neu can doi URL API.

Windows PowerShell thuong bi chan `npm.ps1`, vi vay nen dung `npm.cmd`:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

macOS / Linux:

```bash
cd frontend
npm install
npm run dev
```

Frontend local:

- [http://localhost:5173](http://localhost:5173)

## 2. Tai khoan demo mac dinh

Khi chay backend o profile `dev` va `APP_SEED=true`, he thong se dam bao cac tai khoan test sau luon ton tai, khong phu thuoc database co trong hay khong:

- Admin
  - Email: `admin@jobportal.test`
  - Password: `123456`
- Candidate
  - Email: `candidate@jobportal.test`
  - Password: `123456`
- Candidate 2
  - Email: `candidate2@jobportal.test`
  - Password: `123456`
- Employer
  - Email: `employer@jobportal.test`
  - Password: `123456`
- Employer 2
  - Email: `employer2@jobportal.test`
  - Password: `123456`

Seed demo cung tao category, job posts, resume, saved job, follow company, applications va notification co ban.
Phan du lieu demo day du (jobs, resume, applications...) van uu tien database trong de tranh tao trung du lieu; rieng cac tai khoan test o tren se duoc bo sung/cap nhat lai moi lan startup.

## 3. Cau hinh bang bien moi truong

Mau bien moi truong backend nam o [backend/.env.example](/D:/WorkSpace/envCode/findJob/backend/.env.example).

Bien quan trong:

- `SPRING_PROFILES_ACTIVE=dev|prod`
- `APP_SEED=true|false`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_FRONTEND_SUCCESS_URL`
- `GOOGLE_FRONTEND_FAILURE_URL`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

Frontend:

- `VITE_API_URL`

## 4. Chay backend voi MySQL local

1. Tao database:

```sql
CREATE DATABASE job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoac dung script san co:

- [scripts/mysql/setup_local.sql](/D:/WorkSpace/envCode/findJob/scripts/mysql/setup_local.sql)
- [scripts/mysql/reset_demo_data.sql](/D:/WorkSpace/envCode/findJob/scripts/mysql/reset_demo_data.sql)

2. Set bien moi truong va chay backend:

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE="dev"
$env:DB_URL="jdbc:mysql://localhost:3306/job_portal?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD=""
$env:APP_SEED="true"
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

Flyway se tu chay migration. DataSeeder se seed du lieu neu `APP_SEED=true` va database con trong.

## 5. Google login can cau hinh gi

Luu y business rule hien tai:

- Google login chi ho tro `CANDIDATE`
- Neu email da ton tai voi `EMPLOYER` hoac `ADMIN`, he thong se tu choi dang nhap Google
- Frontend khong giu `clientId`, backend la noi duy nhat lam viec voi Google OAuth2

Cach lam:

1. Vao Google Cloud Console.
2. Tao OAuth Client ID cho Web application.
3. Them Authorized JavaScript origins:
   - `http://localhost:5173`
   - domain frontend public sau nay, vi du `https://your-app.vercel.app`
4. Them Authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
   - domain backend public, vi du `https://your-api.onrender.com/login/oauth2/code/google`
5. Gan bien moi truong backend:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_FRONTEND_SUCCESS_URL=http://localhost:5173/auth/callback`
   - `GOOGLE_FRONTEND_FAILURE_URL=http://localhost:5173/login`

Frontend khong can giu `clientId` nua. Nut Google se redirect sang backend de bat dau OAuth2.

Checklist local can khop tuyet doi:

- Backend redirect URI: `http://localhost:8080/login/oauth2/code/google`
- Frontend success URL: `http://localhost:5173/auth/callback`
- Frontend failure URL: `http://localhost:5173/login`

Checklist staging can khop tuyet doi:

- Backend redirect URI: `https://your-backend-domain/login/oauth2/code/google`
- Frontend success URL: `https://your-frontend-domain/auth/callback`
- Frontend failure URL: `https://your-frontend-domain/login`

## 6. Du lieu Joboko va import SQL

File crawl:

- [data/data_joboko_crawl.json](/D:/WorkSpace/envCode/findJob/data/data_joboko_crawl.json)

File SQL import tay da tao san:

- [data/joboko_manual_seed.sql](/D:/WorkSpace/envCode/findJob/data/joboko_manual_seed.sql)

Neu muon regenerate file SQL:

```powershell
cd data
python generate_joboko_manual_sql.py
```

Luu y:

- Chay migration truoc.
- Sau do moi import file SQL vao MySQL.

## 7. API va Postman

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Postman collection: [postman/FindJob.postman_collection.json](/D:/WorkSpace/envCode/findJob/postman/FindJob.postman_collection.json)

Public API da mo cho guest:

- `GET /api/v1/jobs`
- `GET /api/v1/jobs/{id}`
- `GET /api/v1/categories`
- `GET /api/v1/employers/{id}`

## 8. Docker local full-stack

Da co san:

- [backend/Dockerfile](/D:/WorkSpace/envCode/findJob/backend/Dockerfile)
- [backend/.dockerignore](/D:/WorkSpace/envCode/findJob/backend/.dockerignore)
- [frontend/Dockerfile](/D:/WorkSpace/envCode/findJob/frontend/Dockerfile)
- [frontend/.dockerignore](/D:/WorkSpace/envCode/findJob/frontend/.dockerignore)
- [docker-compose.yml](/D:/WorkSpace/envCode/findJob/docker-compose.yml)

Chay:

```powershell
docker compose up --build
```

Sau khi len:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8080](http://localhost:8080)

## 9. CI co san

Da them workflow:

- [.github/workflows/ci.yml](/D:/WorkSpace/envCode/findJob/.github/workflows/ci.yml)
- QA kit: [docs/qa/README.md](/D:/WorkSpace/envCode/findJob/docs/qa/README.md)

CI se:

- run backend tests bang Java 21
- run frontend tests bang Vitest
- build frontend bang Node 20

Smoke test web/security da duoc bo sung cho public jobs, categories, employer public profile va auth public.

## 10. Public website theo huong de nhat

### Frontend

- Deploy `frontend` len Vercel
- Co san [frontend/vercel.json](/D:/WorkSpace/envCode/findJob/frontend/vercel.json) de SPA route khong bi 404 khi refresh
- Set:
  - `VITE_API_URL=https://your-backend-domain/api/v1`

### Backend

- Deploy `backend` len Render hoac Railway
- Co san [render.yaml](/D:/WorkSpace/envCode/findJob/render.yaml) de bootstrap Render nhanh hon
- Set:
  - `SPRING_PROFILES_ACTIVE=prod`
  - `DB_URL`
  - `DB_USERNAME`
  - `DB_PASSWORD`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_FRONTEND_SUCCESS_URL=https://your-frontend-domain/auth/callback`
  - `GOOGLE_FRONTEND_FAILURE_URL=https://your-frontend-domain/login`
  - `CORS_ORIGINS=https://your-frontend-domain`

### Database

- Dung MySQL cloud
- Chay Flyway migration tu backend luc startup
- Co the import them `joboko_manual_seed.sql` neu muon co data demo lon

## 11. Kiem tra truoc khi public

- Backend start thanh cong
- Frontend goi duoc backend
- Swagger mo duoc
- Guest xem duoc jobs/categories/company
- Candidate login va apply duoc
- Employer xem jobs va applicants duoc
- Admin xem users/pending employers duoc

## 12. Build/Test nhanh

Backend:

```powershell
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
.\mvnw.cmd test
```

Frontend Windows:

```powershell
cd frontend
npm.cmd run build
```

Frontend macOS / Linux:

```bash
cd frontend
npm run build
```

## 13. Huong on dinh de lam tiep

Thu tu uu tien nen giu:

1. Chay on local
2. Swagger/Postman pass
3. Public API mo dung
4. Auth va phan quyen dung
5. Frontend public on
6. Candidate -> Employer -> Admin
7. Seed/demo data dep
8. Moi deploy public

Huong nay an toan hon cho nguoi moi vi moi buoc deu co diem dung ro rang va kiem tra duoc ngay.
