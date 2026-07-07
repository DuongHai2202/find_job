-- Manual MySQL seed generated from data_joboko_crawl.json
-- Recommended usage: import into a database that has already run V1, V2, V3 migrations.
SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1000, 'IT phần mềm', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1001, 'Quản trị kinh doanh', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1002, 'Tư vấn/ Chăm sóc khách hàng', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1003, 'Kinh doanh', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1004, 'Bán hàng', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1005, 'Marketing - PR', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1006, 'Kế toán', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1007, 'Ngân hàng/ Tài Chính', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1008, 'Hành chính - Văn phòng', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1009, 'Nhân sự', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1010, 'Thiết kế đồ họa - Mỹ thuật', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1011, 'Xây dựng', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1012, 'Khách sạn - Nhà hàng', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1013, 'Du lịch', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1014, 'Sản xuất / Vận hành sản xuất', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1015, 'Dệt may - Da giày', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1016, 'Y tế - Dược', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1017, 'Điện tử viễn thông', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1018, 'Bất động sản', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, parent_id, created_at, updated_at)
VALUES (1019, 'Ngành nghề khác', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100000, 'cong-ty-co-phan-y-duoc-vietlife-1@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'Công ty Cổ phần Y Dược Vietlife', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100000, 'Công ty Cổ phần Y Dược Vietlife', 'Thông tin tuyển dụng cho Công ty Cổ phần Y Dược Vietlife.', NULL, NULL, NULL, '50-100', '97-99 Láng Hạ, Đống Đa, Hà Nội', TRUE, 'https://vn.joboko.com/cong-ty-co-phan-y-duoc-vietlife-xci427276')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100001, 'cong-ty-co-phan-joboko-toan-cau-2@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'Công ty cổ phần JobOKO Toàn cầu', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100001, 'Công ty cổ phần JobOKO Toàn cầu', 'Thông tin tuyển dụng cho Công ty cổ phần JobOKO Toàn cầu.', NULL, NULL, NULL, '50-100', 'Tầng 23 tòa nhà Viwaseen, Số 48 Tố Hữu, P. Trung Văn, Q. Nam Từ Liêm, Tp. Hà Nội.', TRUE, 'https://vn.joboko.com/cong-ty-co-phan-joboko-toan-cau-xci612210')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100002, 'unknown-company-3@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'Unknown Company', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100002, 'Unknown Company', 'Thông tin tuyển dụng cho Unknown Company.', NULL, NULL, NULL, '50-100', 'Thôn 3, Xã Tiến Xuân, Huyện Thạch Thất, Thành phố Hà Nội, Việt Nam', TRUE, NULL)
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100003, 'cong-ty-co-phan-thiet-bi-va-phat-trien-cong-nghe-trong-diem-4@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'CÔNG TY CỔ PHẦN THIẾT BỊ VÀ PHÁT TRIỂN CÔNG NGHỆ TRỌNG ĐIỂM', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100003, 'CÔNG TY CỔ PHẦN THIẾT BỊ VÀ PHÁT TRIỂN CÔNG NGHỆ TRỌNG ĐIỂM', 'Thông tin tuyển dụng cho CÔNG TY CỔ PHẦN THIẾT BỊ VÀ PHÁT TRIỂN CÔNG NGHỆ TRỌNG ĐIỂM.', NULL, NULL, NULL, '50-100', 'Số 8/8, ngõ 36, phố Trung Hòa, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam', TRUE, 'https://vn.joboko.com/cong-ty-co-phan-thiet-bi-va-phat-trien-cong-nghe-trong-diem-xci434727')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100004, 'cong-ty-tnhh-savills-viet-nam-5@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'Công ty TNHH Savills Việt Nam', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100004, 'Công ty TNHH Savills Việt Nam', 'Thông tin tuyển dụng cho Công ty TNHH Savills Việt Nam.', NULL, NULL, NULL, '50-100', '81-83-83B-85, Đường Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1, Thành phố Hồ Chí Minh, Việt Nam', TRUE, 'https://vn.joboko.com/cong-ty-tnhh-savills-viet-nam-xci781525')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100005, 'cong-ty-co-phan-thiet-ke-xay-dung-dbplus-6@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'CÔNG TY CỔ PHẦN THIẾT KẾ & XÂY DỰNG DBPLUS', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100005, 'CÔNG TY CỔ PHẦN THIẾT KẾ & XÂY DỰNG DBPLUS', 'Thông tin tuyển dụng cho CÔNG TY CỔ PHẦN THIẾT KẾ & XÂY DỰNG DBPLUS.', NULL, NULL, NULL, '50-100', 'Số 40 Đường 62, Khu phố 01, Phường Thạnh Mỹ Lợi, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', TRUE, 'https://vn.joboko.com/cong-ty-cp-thiet-ke-xay-dung-dbplus-xci824104')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100006, 'cong-ty-co-phan-cong-trinh-cau-pha-tp-hcm-7@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'CÔNG TY CỔ PHẦN CÔNG TRÌNH CẦU PHÀ TP.HCM', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100006, 'CÔNG TY CỔ PHẦN CÔNG TRÌNH CẦU PHÀ TP.HCM', 'Thông tin tuyển dụng cho CÔNG TY CỔ PHẦN CÔNG TRÌNH CẦU PHÀ TP.HCM.', NULL, NULL, NULL, '50-100', '451/10 Tô Hiến Thành, Phường Diên Hồng, TP Hồ Chí Minh', TRUE, 'https://vn.joboko.com/cong-ty-co-phan-cong-trinh-cau-pha-tp-hcm-xi-nghiep-cong-trinh-10-xci789281')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100007, 'cong-ty-co-phan-am-thuc-mat-troi-vang-goldsun-food-8@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'CÔNG TY CỔ PHẦN ẨM THỰC MẶT TRỜI VÀNG - Goldsun Food', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100007, 'CÔNG TY CỔ PHẦN ẨM THỰC MẶT TRỜI VÀNG - Goldsun Food', 'Thông tin tuyển dụng cho CÔNG TY CỔ PHẦN ẨM THỰC MẶT TRỜI VÀNG - Goldsun Food.', NULL, NULL, NULL, '50-100', 'Số 1 đường 4, KTT F361, ngõ 32 phố An Dương, Phường Yên Phụ, Quận Tây Hồ, Hà Nội', TRUE, 'https://vn.joboko.com/cong-ty-co-phan-am-thuc-goldsun-food-xci539399')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100008, 'cong-ty-tnhh-thuong-mai-fc-viet-nam-9@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'Công ty TNHH Thương mại FC Việt Nam', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100008, 'Công ty TNHH Thương mại FC Việt Nam', 'Thông tin tuyển dụng cho Công ty TNHH Thương mại FC Việt Nam.', NULL, NULL, NULL, '50-100', 'HS05 - 06, đô thị sinh thái Vinhomes Riverside, Phường Phúc Lợi, Thành phố HN', TRUE, 'https://vn.joboko.com/cong-ty-tnhh-thuong-mai-fc-viet-nam-xci894703')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100009, 'cong-ty-tnhh-thiet-bi-cong-nghe-binh-minh-10@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'Công ty TNHH thiết bị công nghệ Bình Minh', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100009, 'Công ty TNHH thiết bị công nghệ Bình Minh', 'Thông tin tuyển dụng cho Công ty TNHH thiết bị công nghệ Bình Minh.', NULL, NULL, NULL, '50-100', 'Số 31 ngõ 92 đường Nguyễn Khánh Toàn, P. Nghĩa Đô, TP. Hà Nội', TRUE, 'https://vn.joboko.com/cong-ty-tnhh-thiet-bi-cong-nghe-binh-minh-xci901910')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_at, updated_at)
VALUES (100010, 'cong-ty-co-phan-bang-huu-kinh-doanh-11@jobportal.local', '$2a$10$S9nQhQ/pZ.R7R8n1kG3qauR2TzYmR0K/3V7w7Tj37p8l5gC6D0q5y', 'CÔNG TY CỔ PHẦN BẰNG HỮU KINH DOANH', NULL, 'EMPLOYER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    full_name = VALUES(full_name),
    role = VALUES(role),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO employers (user_id, company_name, company_description, tax_code, logo_url, website, company_size, address, approved, source_url)
VALUES (100010, 'CÔNG TY CỔ PHẦN BẰNG HỮU KINH DOANH', 'Thông tin tuyển dụng cho CÔNG TY CỔ PHẦN BẰNG HỮU KINH DOANH.', NULL, NULL, NULL, '50-100', '10 đường 79 Phường Tân Quy, Quận 7, Tp.HCM; A56, TT9, Khu đô thị Văn Quán, Hà Đông, Hà Nội', TRUE, 'https://vn.joboko.com/cong-ty-co-phan-bang-huu-kinh-doanh-xci33851')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    company_description = VALUES(company_description),
    logo_url = VALUES(logo_url),
    website = VALUES(website),
    company_size = VALUES(company_size),
    address = VALUES(address),
    approved = VALUES(approved),
    source_url = VALUES(source_url);

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300000, 100000, 1000, 'Data Engineer | 2-4 Năm Kinh Nghiệm | Hà Nội', 'Thiết kế kiến trúc dữ liệu tổng thể (Data Lake, DWH, Data Mart). Chuẩn hóa framework ETL/ELT và tiêu chuẩn kỹ thuật. Tối ưu hiệu năng và chi phí xử lý dữ liệu. Dẫn dắt kỹ thuật, review code và mentoring đội ngũ. Phối hợp với Business, BI, AI để chuyển hóa yêu cầu nghiệp vụ. Đảm bảo Data Governance: quality, security, lineage. Tham gia lựa chọn công nghệ và chiến lược dữ liệu.', '2-4 năm kinh nghiệm Data Engineer hoặc tương đương. Thành thạo SQL. Sử dụng tốt Python/Scala/Java. Có kinh nghiệm với công cụ ETL/ELT. Hiểu về Data Warehouse và mô hình dữ liệu. Có tư duy hệ thống và khả năng làm việc nhóm.', 'Thu nhập: Thỏa thuận theo năng lực Lương tháng 13, Thưởng lễ, tết, thưởng hiệu quả công việc. Cơ hội thăng tiến và phát triển nghề nghiệp. Môi trường làm việc chuyên nghiệp, năng động và thân thiện. Được đào tạo nâng cao nghiệp vụ thường xuyên. Được thăm khám sức khỏe miễn phí tổng quát 1 năm 1 lần tại hệ thống phòng khám đa khoa Vietlife. Mua các sản phẩm dược của Vietlife sản xuất với chính sách ưu đãi lên đến 50% Tham dự các sự kiện lớn của công ty được tổ chức tại các khách sạn 5 sao trở lên', NULL, NULL, 'Hà Nội', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-17', 0, 'https://vn.joboko.com/viec-lam-data-engineer-xvi6519789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200000, 'phần mềm', 'phan-mem', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300000, 200000, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200001, 'sql', 'sql', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300000, 200001, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200002, 'python', 'python', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300000, 200002, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200003, 'java', 'java', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300000, 200003, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300001, 100001, 1001, 'Chuyên viên phát triển kinh doanh B2B', 'Tư vấn, giới thiệu khách hàng sử dụng dịch vụ tuyển dụng trên nền tảng công nghệ tuyển dụng JobOKO. Thiết lập quan hệ với các khách hàng dựa trên data có sẵn và tìm kiếm thêm. Xử lý báo giá, hợp đồng cho khách, follow chặt chẽ quá trình bán hàng. Hoàn thành các chỉ tiêu về doanh số theo yêu cầu của công ty. Đối tượng khách hàng: Các Doanh nghiệp có nhu cầu tuyển dụng là các giám đốc, trưởng bộ phận tuyển dụng, HR.', 'Có kinh nghiệm sale từ 2 năm trở lên. Khả năng giao tiếp tốt, truyền đạt thông tin tốt, nhạy bén trong xử lý tình huống. Kỹ năng lắng nghe và thuyết phục khách hàng tốt. Tác phong làm việc chuyên nghiệp.', 'Lương cứng: 10.000.000 - 12.000.000đ/tháng + Commission. Tổng thu nhập từ 15.000.000đ - 25.000.000đ/tháng. Hỗ trợ công tác phí: Theo chính sách chung của công ty. Thưởng lễ Tết, đóng BHXH theo quy định. Môi trường công nghệ, đồng nghiệp trẻ trung, năng động. Có đầy đủ tiện nghi: Tủ lạnh, lò vi sóng, máy pha cafe, đồ uống trà, cafe. Các hoạt động gắn kết nhân sự: Happy Hour, Sinh nhật nhân viên, Team Building hàng năm và một số hoạt động khác. Thời gian làm việc: Làm việc từ T2-T6; Sáng từ 8h-12h. Chiều từ 13h30-17h30. Nghỉ T7 và CN.', NULL, NULL, 'Hà Nội', 'FULLTIME', 'MIDDLE', 'APPROVED', '2026-07-24', 0, 'https://vn.joboko.com/viec-lam-business-development-xvi6491931', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200004, 'b2b', 'b2b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300001, 200004, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300002, 100002, 1005, '[HN] Trưởng Phòng Tuyển Sinh - Thu Nhập Đến 35 Triệu + Hoa Hồng | Hỗ Trợ Học Phí Cho Con', '1. Chiến lược và kế hoạch tuyển sinh: Xây dựng kế hoạch tuyển sinh năm: Lập kế hoạch tuyển sinh chi tiết cho 4 cấp học theo năm và theo từng quý, từng đợt; xác định chỉ tiêu, phân khúc thị trường, kênh tiếp cận và ngân sách tuyển sinh. Nghiên cứu thị trường: Theo dõi đối thủ cạnh tranh, xu hướng tuyển sinh Hà Nội, nhu cầu phụ huynh và phản hồi thị trường về Maya. Đề xuất chính sách tuyển sinh: Tham mưu cho Giám đốc Vận hành Trường về học phí, ưu đãi, học bổng và các chính sách hỗ trợ tài chính cho gia đình. 2. Vận hành phòng tuyển sinh: Quản lý đội ngũ: Tuyển dụng, đào tạo và đánh giá nhân sự Phòng Tuyển sinh; xây dựng bộ kỹ năng tư vấn chuyên nghiệp, am hiểu chương trình giáo dục Maya. Vận hành quy trình tuyển sinh: Thiết lập và tối ưu hóa quy trình từ tiếp nhận lead → tư vấn → tham quan trường → ghi danh; đảm bảo thời gian phản hồi lead mới trong vòng 24 giờ. Quản lý cơ sở dữ liệu: Duy trì hệ thống CRM tuyển sinh; theo dõi pipeline, tỷ lệ chuyển đổi từng giai đoạn và báo cáo định kỳ cho Ban Giám hiệu. 3. Trải nghiệm phụ huynh và tham quan trường: Tổ chức Open Day & Tham quan trường: Chủ trì các sự kiện Open Day định kỳ và tour tham quan cá nhân; phối hợp với Ban Giám hiệu các cấp đảm bảo trải nghiệm chuyên nghiệp, ấm áp đúng văn hóa Maya. Tư vấn chuyên sâu: Trực tiếp tư vấn cho các trường hợp đặc biệt; giải đáp thắc mắc về chương trình học, phương pháp giáo dục, học phí và lộ trình phát triển của học sinh. Khảo sát hài lòng: Triển khai khảo sát hài lòng sau mỗi buổi tham quan và sau khi nhập học; phân tích phản hồi để cải thiện quy trình. 4. Truyền thông và sự kiện tuyển sinh: Phối hợp Marketing: Cùng Phòng Marketing & Truyền thông Trường xây dựng nội dung tuyển sinh cho các kênh truyền thông (website, fanpage, hội chợ giáo dục). Sự kiện cộng đồng: Tổ chức và tham gia các sự kiện kết nối phụ huynh hiện hữu - phụ huynh tiềm năng; chương trình giới thiệu bạn bè (referral) Quan hệ đối tác: Phát triển và nuôi dưỡng quan hệ đối tác tuyển sinh với các trường mầm non/tiểu học/THCS và các trung tâm đào tạo/kỹ năng phù hợp ở Hà Nội. 5. Báo cáo và phối hợp BGH: Báo cáo định kỳ: Báo cáo tuần/tháng/quý về tình hình tuyển sinh, tỷ lệ chuyển đổi, ngân sách và đề xuất điều chỉnh cho Giám đốc Vận hành Trường. Phối hợp Ban Giám hiệu: Làm việc chặt chẽ với Hiệu trưởng và Phó Hiệu trưởng các cấp học để đảm bảo chất lượng đầu vào học sinh phù hợp với chương trình. Tuân thủ Bảo vệ Trẻ em: Đảm bảo toàn bộ nhân sự Phòng Tuyển sinh tuân thủ Bộ Quy tắc Ứng xử và quy trình Bảo vệ Trẻ em khi tiếp xúc với học sinh và phụ huynh. 6. Các công việc khác theo phân công của Giám đốc Vận hành Trường.', 'Tốt nghiệp Đại học trở lên các chuyên ngành Marketing, Truyền thông, Quản trị Kinh doanh, Giáo dục hoặc các ngành liên quan; Ưu tiên có chứng chỉ về Quản lý Tuyển sinh giáo dục, Digital Marketing Tối thiểu 5 năm kinh nghiệm trong lĩnh vực tuyển sinh giáo dục, kinh doanh dịch vụ giáo dục hoặc tư vấn khách hàng cao cấp; Tối thiểu 2 năm kinh nghiệm quản lý đội nhóm tuyển sinh hoặc bán hàng; Có kinh nghiệm tuyển sinh tại trường song ngữ/quốc tế là một lợi thế lớn. Tiếng Việt: thành thạo (đọc - viết - nói), khả năng giao tiếp và thuyết trình tốt. Tiếng Anh: đủ cho yêu cầu công việc (giao tiếp cơ bản với phụ huynh nước ngoài, đọc tài liệu tiếng Anh). Am hiểu thị trường giáo dục tư thục/song ngữ/quốc tế tại Hà Nội; Thành thạo các công cụ CRM, quản lý pipeline, phân tích dữ liệu tuyển sinh; Hiểu biết về các chương trình giáo dục (CTGDPT 2018, Common Core, Cambridge,...) đủ để tư vấn cho phụ huynh; Kỹ năng xây dựng và triển khai chiến lược tuyển sinh. Lãnh đạo & Truyền cảm hứng cho đội nhóm. Giao tiếp & Thuyết phục xuất sắc. Xây dựng quan hệ & Chăm sóc khách hàng dài hạn. Tư duy chiến lược & Định hướng kết quả. Quản lý dự án & Xử lý tình huống linh hoạt. Tôn trọng, đa nhiệm, tinh thần phục vụ, đam mê giáo dục và phục vụ con người', '1. Thu nhập gộp: Lương khoảng 25.000.000 - 35.000.000đ/tháng + Hoa hồng tuyển sinh theo chính sách nhà trường. 2. Phép năm, nghỉ lễ: 12 ngày phép & 12 ngày nghỉ bổ sung vào các đợt Nghỉ hè, Nghỉ Tết Nguyên đán và Nghỉ đông theo Lịch năm học Tết Nguyên đán; Tết Dương lịch; Giỗ Tổ Hùng Vương; Giải phóng Miền Nam; Quốc tế Lao động; Quốc khánh 3. Phúc lợi cho con cán bộ nhân viên: Giảm 185.000.000đ học phí/năm Tiểu học/THCS; hoặc giảm 213.500.000đ học phí/năm THPT; hoặc giảm 10.600.000đ học phí/tháng Mẫu giáo - cho 01 con ruột khi theo học tại các trường ở Làng Maya Giảm 5.300.000đ học phí/tháng cho 01 con ruột khi theo học tại Casa Dei Piccioni hoặc Maya Preschool - Bồ Đề Giảm 50% học phí cho tất cả các con ruột khi tham gia các khóa trại hè Tiếng Anh tại Làng Maya. 4. Phúc lợi khác: 01 chuyến du lịch cùng toàn thể cán bộ giáo viên/năm làm việc chính thức Xe buýt đưa đón tại các điểm cố định trong Hà Nội Ngân sách Phát triển chuyên môn dành riêng cho cán bộ lãnh đạo cấp học Tháng lương thứ 13, review lương hàng năm Tham gia đầy đủ BHXH', NULL, NULL, 'Hà Nội', 'FULLTIME', 'MANAGER', 'APPROVED', '2026-06-29', 0, 'https://vn.joboko.com/viec-lam-truong-phong-tuyen-sinh-xvi6500205', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200005, 'giáo dục', 'giao-duc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300002, 200005, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200006, 'tiếng anh', 'tieng-anh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300002, 200006, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300003, 100003, 1006, 'Focustech Tuyển Kế Toán Tổng Hợp | Thu Nhập 13-17 Triệu | Duy Tân, Cầu Giấy', 'Phụ trách công tác kế toán, thuế, báo cáo tài chính của một đơn vị thành viên (khối lượng nghiệp vụ không nhiều). Thực hiện nhập liệu, hạch toán chứng từ; theo dõi doanh thu, công nợ và hồ sơ thanh quyết toán đối với các hợp đồng thầu và một số đơn hàng được phân công. Hỗ trợ Kế toán trưởng tập hợp chứng từ, nhập liệu hóa đơn, đối chiếu số liệu phục vụ công tác kê khai thuế định kỳ của Công ty. Chuẩn bị hồ sơ tài chính; theo dõi, kiểm soát các đầu mục hồ sơ thầu; phối hợp với các bộ phận liên quan để hoàn thiện và nộp hồ sơ dự thầu theo quy định. Lưu trữ, quản lý chứng từ kế toán, hồ sơ thuế và hồ sơ đấu thầu. Thực hiện các công việc khác theo sự phân công của Kế toán trưởng. ​Thời gian làm việc: Thứ 2 - Thứ 6 (08h00 - 17h00), Thứ 7 làm việc buổi sáng', 'Tốt nghiệp Cao đẳng/Đại học chuyên ngành Kế toán, Kiểm toán, Tài chính hoặc các ngành liên quan. Có từ 3 - 4 năm kinh nghiệm ở vị trí Kế toán tổng hợp hoặc tương đương. Có kinh nghiệm kê khai thuế, lập báo cáo tài chính. Thành thạo Excel và phần mềm kế toán (AMIS, MISA hoặc tương đương). Cẩn thận, trung thực, trách nhiệm và chủ động trong công việc. Ưu tiên ứng viên có kinh nghiệm liên quan đến hồ sơ đấu thầu hoặc doanh nghiệp thương mại. Chấp nhận ứng viên chưa có kinh nghiệm đấu thầu nhưng có tinh thần học hỏi và mong muốn phát triển nghiệp vụ.', 'Thu nhập: 13.000.000 - 17.000.000 đồng/tháng (theo năng lực) + phụ cấp ăn trưa. Thu nhập năm từ 14 tháng lương trở lên, bao gồm lương tháng 13 và thưởng theo kết quả kinh doanh, hiệu quả công việc. Xét tăng lương định kỳ vào ngày 01/01 hằng năm theo năng lực và kết quả công việc. Thưởng các dịp Lễ, Tết và các chế độ phúc lợi khác theo quy định của Công ty. Tham gia đầy đủ BHXH, BHYT, BHTN theo quy định. Được đào tạo, hướng dẫn trực tiếp về nghiệp vụ đấu thầu trong quá trình làm việc. Công ty hỗ trợ chi phí đào tạo và các khóa học chuyên môn phù hợp với nhu cầu công việc và định hướng phát triển nghề nghiệp. Làm việc trực tiếp với Kế toán trưởng, có cơ hội phát triển chuyên môn về kế toán tổng hợp, thuế, đấu thầu và lộ trình nghề nghiệp dài hạn. Môi trường làm việc ổn định, chuyên nghiệp, thân thiện và sẵn sàng hỗ trợ nhân sự phát triển.', NULL, NULL, 'Hà Nội', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-23', 0, 'https://vn.joboko.com/viec-lam-focustech-tuyen-ke-toan-tong-hop-thu-nhap-13-17-trieu-duy-tan-cau-giay-xvi6538603', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200007, 'kế toán', 'ke-toan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300003, 200007, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200008, 'thuế', 'thue', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300003, 200008, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200009, 'tài chính', 'tai-chinh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300003, 200009, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300004, 100004, 1007, 'Sales Consultant (Chuyên Viên Tư Vấn BĐS Cao Cấp) | Hà Nội & TP.HCM', '1. Lead Generation & Client Advisory | Phát triển khách hàng & Tư vấn: Generate leads through personal networks, referrals, and company-provided channels./ Tìm kiếm và phát triển khách hàng tiềm năng thông qua mạng lưới cá nhân, giới thiệu và các kênh do công ty cung cấp. Consult clients on suitable residential property products based on their needs and investment objectives./ Tư vấn các sản phẩm bất động sản nhà ở phù hợp với nhu cầu và mục tiêu đầu tư của khách hàng. Conduct presentations, property viewings, site visits, and client meetings./ Thực hiện thuyết trình, dẫn khách tham quan dự án, khảo sát thực tế và gặp gỡ khách hàng. 2. Deal Closing | Chốt giao dịch: Convert qualified leads into successful transactions./ Chuyển đổi khách hàng tiềm năng thành các giao dịch thành công. Manage the negotiation and closing process professionally and effectively./ Quản lý quá trình đàm phán và chốt giao dịch một cách chuyên nghiệp và hiệu quả. Maintain strong follow-up and long-term client relationship management./ Theo sát khách hàng và xây dựng mối quan hệ lâu dài với khách hàng. 3. Pipeline Management | Quản lý nguồn khách hàng: Maintain and manage an effective personal sales pipeline./ Xây dựng và quản lý hiệu quả nguồn khách hàng cá nhân. Track leads, follow-up activities, and conversion progress using company systems and tools./ Theo dõi khách hàng tiềm năng, các hoạt động chăm sóc và tiến độ chuyển đổi thông qua hệ thống và công cụ của công ty. Build and maintain a professional personal brand; active social media presence is an advantage./ Xây dựng và duy trì thương hiệu cá nhân chuyên nghiệp; có sự hiện diện tích cực trên các nền tảng mạng xã hội là một lợi thế.', 'Experience | Kinh nghiệm: 1-5+ years of sales experience (real estate preferred)./ Từ 1-5 năm kinh nghiệm trong lĩnh vực kinh doanh/bán hàng (ưu tiên bất động sản). Candidates from banking, insurance, automotive, luxury retail, or related industries are also encouraged to apply./ Ứng viên đến từ các lĩnh vực ngân hàng, bảo hiểm, ô tô, bán lẻ cao cấp hoặc các ngành liên quan đều phù hợp. Fresh graduates with a strong sales mindset and passion for client engagement may be considered./ Sinh viên mới tốt nghiệp có tư duy kinh doanh tốt và đam mê làm việc với khách hàng vẫn có thể được xem xét. Capabilities | Năng lực: Strong communication and persuasion skills./ Kỹ năng giao tiếp và thuyết phục tốt. Target-driven, proactive, and resilient./ Có tinh thần hướng đến mục tiêu, chủ động và kiên trì. Strong client relationship management and follow-up discipline./ Có khả năng xây dựng, duy trì mối quan hệ khách hàng và theo sát cơ hội kinh doanh. Ability to work effectively in a commission-driven environment./ Có khả năng làm việc hiệu quả trong môi trường thu nhập theo hiệu quả kinh doanh/hoa hồng. Professional attitude with a strong customer service mindset./ Tác phong chuyên nghiệp và tư duy dịch vụ khách hàng. A strong personal brand and active presence on social media is an added advantage./ Có thương hiệu cá nhân tốt và hoạt động tích cực trên mạng xã hội là một lợi thế.', 'Competitive salary and bonus./ Mức lương cạnh tranh và chế độ thưởng hấp dẫn Premium healthcare and annual health check-up./ Bảo hiểm sức khỏe cao cấp và khám sức khỏe định kỳ hằng năm Full statutory insurance coverage./ Được tham gia đầy đủ các chế độ bảo hiểm theo quy định của pháp luật Professional training and career development opportunities./ Cơ hội được đào tạo chuyên môn và phát triển nghề nghiệp Dynamic international working environment./ Môi trường làm việc quốc tế năng động và chuyên nghiệp Employee engagement activities/ Tham gia các hoạt động gắn kết nhân viên và xây dựng văn hóa doanh nghiệp', NULL, NULL, 'Hà Nội, Hồ Chí Minh', 'FULLTIME', 'MIDDLE', 'APPROVED', '2026-07-24', 0, 'https://vn.joboko.com/viec-lam-sales-consultant-chuyen-vien-tu-van-bds-cao-cap-xvi6543221', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200010, 'bất động sản', 'bat-dong-san', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300004, 200010, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300005, 100000, 1008, '[HN] Chuyên Viên Đào Tạo Nội Bộ & Truyền Thông Doanh Nghiệp | 15-20 Triệu', 'Đào tạo & phát triển năng lực nhân sự (70%): Lập và quản trị dự toán ngân sách và quản lý chi phí đào tạo Tham mưu cho Trưởng phòng xây dựng quy chế, quy trình đào tạo; quản lý tập trung và đánh giá công tác đào tạo trên toàn hệ thống Xây dựng kế hoạch đào tạo Năm, quý, tháng cho từng nhóm đối tượng Xây dựng và chuẩn hóa khung chương trình, hình thức, nội dung, tài liệu đào tạo phù hợp với nhu cầu Đào tạo & Phát triển nhân sự của Ban/Phòng/Bộ phận/Cá nhân theo từng giai đoạn Xây dựng và triển khai chương trình đào tạo Đội ngũ kế cận, đội ngũ giảng viên nội bộ Triển khai đánh giá & đào tạo theo khung năng lực Triển khai tổ chức khóa đào tạo nội bộ & bên ngoài đảm bảo tiến độ và chất lượng Đo lường hiệu quả đào tạo: khảo sát sau khóa học, bài test, hành vi thay đổi, ... Lập và quản trị dự toán ngân sách và quản lý chi phí đào tạo. Truyền thông nội bộ & Văn hóa doanh nghiệp (25%): Tham mưu cho Trưởng phòng về chiến lược truyền thông và trực tiếp xây dựng kế hoạch truyền thông nội bộ tháng, quý, năm. Quản lý vận hành các kênh truyền thông nội bộ: Email, facebook, bản tin nội bộ, zalo, phần mềm office, ... Viết, biên tập và đăng tải nội dung truyền thông trên các kênh truyền thông nội bộ Tổ chức chuỗi sự kiện trong năm: Sinh nhật công ty, 20/11, Thanks Party, 8.3, 20.10, 27.2, sinh nhật chủ tịch, .... Truyền thông tầm nhìn, sứ mệnh, giá trị văn hóa, chiến lược Kinh doanh, chiến lược chuyên môn, chiến lược trải nghiệm khách hàng, chiến lược trải nghiệm nhân viên, khung năng lực tới hệ thống đảm bảo thông tin nhất quán, xuyên suốt thúc đẩy hành vi và thói quen hình thành văn hóa. Thực hiện các công việc khác do Trưởng phòng giao (5%)', 'Trình độ học vấn tối thiểu: Đại học Yêu cầu từ 3 năm kinh nghiệm trở lên Chuyên ngành: Lao động xã hội, Sư phạm, Y tế, Kinh tế, Khoa học Xã hội Tin học văn phòng: Thành thạo Excel, Powerpoint, AI Ưu tiên có kinh nghiệm chuyên môn Y tế, Dược phẩm Năng lực chuyên môn: Coaching Training Điều phối tổ chức lớp học Đánh giá hiệu quả đào tạo Quản lý dự án Chủ động tích cực trong công việc Trung thực, trách nhiệm', 'Thu nhập: 15-20tr Các khoản thưởng đa dạng: Tháng lương thứ 13, thưởng doanh số kinh doanh. Được thăm khám sức khỏe miễn phí tổng quát 1 năm 1 lần tại hệ thống phòng khám đa khoa Vietlife. Mua các sản phẩm dược của Vietlife sản xuất với chính sách ưu đãi lên đến 50%. Tham dự các sự kiện lớn của công ty được tổ chức tại các khách sạn 5 sao trở lên. Tham gia BHXH, BHTN theo quy định của nhà nước', 15000000, 20000000, 'Hà Nội', 'FULLTIME', 'MIDDLE', 'APPROVED', '2026-07-17', 0, 'https://vn.joboko.com/viec-lam-chuyen-vien-dao-tao-xvi6508302', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200011, 'dược phẩm', 'duoc-pham', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300005, 200011, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200012, 'y tế', 'y-te', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300005, 200012, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300006, 100005, 1010, 'Chuyên Viên Thiết Kế Nội Thất Senior Concept - Hồ Chí Minh', 'DBPlus là đơn vị chuyên thiết kế và thi công nội thất trọn gói cho văn phòng, nhà hàng, khách sạn, resort và căn hộ cao cấp, hợp tác cùng các chủ đầu tư uy tín hàng đầu tại Việt Nam. Trụ sở tại TP.HCM: số 40, đường 62, phường Cát Lái, Hồ Chí Minh Văn phòng tại Hà Nội: A24 Lô Nhà Vườn, Khu đô thị mới Việt Hưng, Phường Việt Hưng, Hà Nội Vị trí: Chuyên viên Thiết kế Nội thất (Senior Concept) Địa điểm làm việc: Văn phòng Hồ Chí Minh MÔ TẢ CÔNG VIỆC: Phát triển ý tưởng thiết kế concept cho các dự án nội thất cao cấp (Office, Hospitality, Residential). Gặp gỡ khách hàng, trao đổi tư vấn nhận yêu cầu từ khách và khảo sát đo đạc hiện trạng công trình. Triển khai các giai đoạn thiết kế nội thất từ ý tưởng sơ phác đến hồ sơ thiết kế kỹ thuật thi công và sản xuất (bản vẽ cơ sở, bản vẽ thi công, spec vật liệu...). Phối hợp với các bộ phận liên quan để triển khai công trình theo đúng thiết kế. Cung cấp thông tin chi tiết về vật liệu, kích thước, cấu tạo... phục vụ công tác dự toán và báo giá. Thực hiện giám sát tác giả trong quá trình thi công nhằm đảm bảo công trình đúng thiết kế. Cập nhật xu hướng thiết kế nội thất mới để đáp ứng yêu cầu thẩm mỹ.', 'Trình độ học vấn: Tốt nghiệp Cao đẳng hoặc Đại học chuyên ngành Kiến trúc, Thiết kế nội thất hoặc các ngành khác có liên quan. Kinh nghiệm: Tối thiểu 2 năm kinh nghiệm trong lĩnh vực thiết kế nội thất Kỹ năng thiết kế: Thành thạo phần mềm thiết kế Kỹ năng giao tiếp: Có khả năng giao tiếp và trình bày ý tưởng rõ ràng, thuyết phục.', 'Thu nhập cạnh tranh (Lương + thưởng dự án) Môi trường làm việc chuyên nghiệp và cơ hội nghề nghiệp rõ ràng Lương tháng 13, thưởng cuối năm. Xét tăng lương định kỳ và đột xuất dựa trên hiệu quả làm việc. Thưởng các dịp Lễ/Tết trong năm (30/4, 1/5, 2/9, sinh nhật, tết dương) Thưởng tháng 13, thưởng hiệu quả công việc trong năm. Tham gia đầy đủ BHXH, BHYT, BHTN theo quy định và phúc lợi nội bộ theo chính sách công ty.', 20000000, 25000000, 'Hồ Chí Minh', 'FULLTIME', 'SENIOR', 'APPROVED', '2026-07-01', 0, 'https://vn.joboko.com/viec-lam-chuyen-vien-thiet-ke-noi-that-senior-concept-xvi6508507', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200013, 'nội thất', 'noi-that', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300006, 200013, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200014, 'kiến trúc', 'kien-truc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300006, 200014, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300007, 100006, 1011, '[Bình Dương] Tuần Tra Viên Công Trình Cầu Đường - Thu Nhập Đến 18 Triệu', 'Tuần tra kết cấu hạ tầng giao thông trong phạm vi công ty quản lý: kiểm tra hiện trạng các công trình cầu, đường dẫn vào cầu, đường dân sinh. Ghi nhận hình ảnh, phát hiện kịp thời các hư hỏng hoặc nguy cơ mất an toàn của công trình. Theo dõi, báo cáo các trường hợp lấn chiếm hành lang an toàn giao thông hoặc hoạt động thi công trong khu vực quản lý. Cập nhật thông tin hiện trường lên hệ thống phần mềm của Công ty. Phối hợp xử lý các vấn đề phát sinh nhằm đảm bảo công trình luôn vận hành an toàn và hiệu quả. Nơi làm việc: Khu vực tuần tra công trình cầu đường: tập trung tại các khu vực thuộc tỉnh Bình Dương cũ, cụ thể Tân Uyên, Thường Tân và Phước Hòa (khu vực phía giáp Đồng Nai) ​ Thời gian làm việc: Giờ hành chính: 7h30 đến 17h Thứ 2 đến thứ 7', 'Giới tính Nam; Tốt nghiệp Trung cấp/Cao đẳng chuyên ngành cầu đường, xây dựng công trình giao thông hoặc khối ngành kỹ thuật có liên quan; Bằng cấp tập trung ưu tiên: Cao đẳng/Trung cấp chuyên ngành cầu đường. Ưu tiên ứng viên có kinh nghiệm kiểm tra, duy tu sửa chữa công trình giao thông; Ưu tiên: các ứng viên cư trú tại khu vực Bình Dương (cũ); Thành thạo Word, Excel; Tính tình trung thực, chịu khó trong công việc; Có tinh thần hoà đồng, hợp tác.', 'Mức thu nhập/tháng: Từ 16 triệu đồng đến 18 triệu đồng/tháng (tuỳ theo năng lực và kinh nghiệm làm việc). Có các nguồn phụ cấp khác như: phụ cấp tiền giữa ca, phụ cấp khác để bồi dưỡng, v.v Các chế độ khác: Được cung cấp trang phục làm việc Đóng BHXH, BHYT, BHTN đầy đủ; tham quan nghỉ mát; khám sức khoẻ hàng năm; nghỉ phép theo luật lao động. Tiền lương tháng 13 theo hiệu quả công việc và tiền hường các ngày lễ, tết trong năm.', 16000000, 18000000, 'Bình Dương', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-13', 0, 'https://vn.joboko.com/viec-lam-tuan-tra-vien-xvi6533417', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200015, 'xây dựng', 'xay-dung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300007, 200015, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200016, 'cầu đường', 'cau-duong', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300007, 200016, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200017, 'giao thông', 'giao-thong', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300007, 200017, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200018, 'công trình', 'cong-trinh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300007, 200018, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300008, 100007, 1012, '[Quận 1] Nhân Viên Phục Vụ Nhà Hàng - Không Yêu Cầu Kinh Nghiệm', 'Chào đón và hướng dẫn khách vào bàn. Giới thiệu thực đơn, tư vấn món ăn và chương trình khuyến mãi. Ghi nhận order và chuyển thông tin đến các bộ phận liên quan. Phục vụ món ăn, thức uống theo đúng tiêu chuẩn nhà hàng. Hỗ trợ khách hàng trong suốt quá trình dùng bữa. Dọn dẹp, sắp xếp bàn ghế và vệ sinh khu vực làm việc. Phối hợp với các bộ phận khác để đảm bảo chất lượng dịch vụ. Thực hiện các công việc khác theo sự phân công của Quản lý.', 'Nam/Nữ từ 18 tuổi trở lên. Nhanh nhẹn, trung thực, có tinh thần trách nhiệm. Giao tiếp tốt, thái độ thân thiện và niềm nở. Có khả năng làm việc theo ca, cuối tuần và ngày lễ. Ưu tiên ứng viên có kinh nghiệm trong ngành F&B (chưa có kinh nghiệm sẽ được đào tạo).', 'Thu nhập cạnh tranh theo năng lực. Phụ cấp cơm ca. Thưởng doanh thu, thưởng hiệu quả công việc (nếu có). Được đào tạo nghiệp vụ miễn phí. Môi trường làm việc chuyên nghiệp, năng động. Cơ hội thăng tiến lên Tổ trưởng, Giám sát, Quản lý.', 28000, 30000, 'Hồ Chí Minh', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-16', 0, 'https://vn.joboko.com/viec-lam-nhan-vien-phuc-vu-nha-hang-kingbqq-alacas-buffet-xvi6507994', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200019, 'khách sạn', 'khach-san', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300008, 200019, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200020, 'nhà hàng', 'nha-hang', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300008, 200020, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300009, 100008, 1013, 'Nhân viên Điều hành tour - chuyên Khách sạn - Tiếng trung', 'Tìm kiếm, đàm phán, và ký kết hợp đồng với các đối tác khách sạn trong và ngoài nước.Quản lý hệ thống dữ liệu đối tác khách sạn (bao gồm thông tin, giá cả, điều kiện hủy/đổi, hình ảnh, chất lượng dịch vụ...).Phối hợp với phòng du lịch để tư vấn và lựa chọn khách sạn phù hợp theo nhu cầu khách hàng.Thực hiện đặt phòng khách sạn theo lịch trình tour đã chốt. Đảm bảo đặt đúng ngày, đúng dịch vụ, đúng yêu cầu của khách.Giải quyết các vấn đề phát sinh liên quan đến dịch vụ khách sạn trong quá trình tour diễn ra (thay đổi lịch trình, phàn nàn, khiếu nại, hoàn hủy...)Theo dõi và đối chiếu công nợ, thanh toán với đối tác khách sạn theo kỳ.Đề xuất các chương trình khuyến mãi, hợp tác, ưu đãi từ khách sạn để tăng tính cạnh tranh của tour.Cập nhật và phân tích xu hướng giá phòng khách sạn, mùa cao điểm - thấp điểm để tối ưu chi phí điều hành tour.Hỗ trợ các công việc điều hành khác khi cần (xe, vé, nhà hàng...).', 'Tốt nghiệp Cao đẳng/Đại học các ngành Du lịch, Khách sạn, Quản trị Kinh doanh hoặc liên quan.Tối thiểu 1 năm kinh nghiệm trong lĩnh vực điều hành tour, ưu tiên đã từng làm việc với mảng khách sạn.Ưu tiên thành thạo tiếng trung và tiếng anhKỹ năng giao tiếp, đàm phánAm hiểu thị trường khách sạn, đặc biệt là tại các điểm du lịch phổ biến.Cẩn thận, tỉ mỉ, có tinh thần trách nhiệm cao.Thành thạo tin học văn phòng.Trình độ vi tính: Thành thạo tin học văn phòng (Words, Excel, Power Point...)Chịu được áp lực cao trong công việc.Có khả năng làm việc độc lậpCó tính sáng tạo, đề cao tính tự chịu trách nhiệm', 'Thu nhập trên 15tr (bao gồm Lương cơ bản 10 - 12tr + phụ cấp + thưởng tour)Thử việc: 2 tháng (thời gian thử việc tính 85% lương cứng)Nhân viên chính thức:Sau thời gian thử việc được nghỉ lễ tết theo quy định chung của công tyĐược đóng BHXH theo quy định của Nhà nướcCơ hội đi khảo sát (famtour), nâng cao kiến thức sản phẩmMôi trường làm việc năng động, trẻ trung, có cơ hội thăng tiếnDu lịch, teambuilding hàng năm cùng công tyHưởng các chế độ đãi ngộ khác theo quy định của Công ty', NULL, NULL, 'Hà Nội', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-22', 0, 'https://vn.joboko.com/viec-lam-nhan-vien-dieu-hanh-tour-chuyen-khach-san-tieng-trung-xvi6541294', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200021, 'tiếng trung', 'tieng-trung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300009, 200021, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200022, 'du lịch', 'du-lich', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300009, 200022, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300009, 200020, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300009, 200006, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300010, 100009, 1014, '[HN] Nhân Viên Kỹ Thuật Điện - Thu Nhập Đến 15 Triệu, Giờ Hành Chính', 'Bảo dưỡng máy móc trang thiết bị theo lịch bảo dưỡng định kỳ. Tham gia lắp đặt, sửa chữa hệ thống điện, tham gia đấu nối điện với hệ thống máy móc khi có yêu cầu. Kiểm soát máy móc trang thiết bị theo bộ quy trình quản lý thiết bị. Vận hành máy, thiết bị sản xuất. Phối hợp cùng các thành viên trong nhóm để giải quyết các vấn đề trong quá trình thực hiện công việc. Thời gian làm việc khối văn phòng, kỹ thuật dịch vụ: Giờ làm việc quy định: 07 - 08 giờ/ngày, không quá 46 giờ/tuần. Cụ thể như sau: Giờ làm việc từ Thứ hai đến Thứ sáu: Buổi sáng: từ 08h00 đến 11 giờ 45. Buổi chiều: từ 13 giờ 30 đến 17 giờ 00. Giờ làm việc Thứ bảy: Buổi sáng: từ 08h10 đến 11 giờ 45. Buổi chiều: từ 13 giờ 30 đến 16 giờ 00 (Đối với tháng có yêu cầu làm việc cả ngày thứ 7).', 'Độ tuổi: từ 20 trở lên Trình độ: Cao đẳng, Đại học chuyên ngành về điện, cơ khí. Ưu tiên ứng viên có kinh nghiệm ở vị trí tương đương; biết đọc và làm việc sơ bộ với phần mềm CAD để lên bản vẽ hoàn công. Kỹ năng làm việc độc lập và phối hợp nhóm tốt Giới tính: Nam', 'Mức lương dự kiến: 10.000.000-15.000.000 vnđ (tùy theo năng lực, kinh nghiệm) Được đào tạo chuyên môn và theo yêu cầu công việc Được tham gia bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp theo quy định Làm việc giờ hành chính, được hưởng chế độ lương thưởng theo luật lao động và quy định.', NULL, NULL, 'Hà Nội', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-10', 0, 'https://vn.joboko.com/viec-lam-nhan-vien-ky-thuat-dien-xvi6529892', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200023, 'điện', 'dien', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300010, 200023, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200024, 'cơ khí', 'co-khi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300010, 200024, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300011, 100002, 1015, 'Chuyên viên kỹ thuật công nghệ - Sợi, Dệt, Nhuộm, May', 'Khảo sát và đánh giá kỹ thuật: Trực tiếp khảo sát, đánh giá và lập báo cáo định kỳ/đột xuất về hoạt động quản lý kỹ thuật (máy móc thiết bị, công nghệ, năng suất, chất lượng, định mức kinh tế kỹ thuật,...) tại các đơn vị có hoạt động sản xuất Sợi/Dệt/Nhuộm/May trực thuộc Tập đoàn.Nghiên cứu và cập nhật công nghệ: Nghiên cứu, cập nhật các xu hướng công nghệ, máy móc thiết bị tiên tiến trong ngành Sợi/Dệt/Nhuộm/May trên thế giới. Phân tích, đánh giá và so sánh với năng lực hiện tại của các doanh nghiệp trong Tập đoàn nhằm đề xuất các giải pháp cải tiến, nâng cấp trình độ công nghệ.Thẩm định dự án đầu tư: Tham gia lập, thẩm định và phối hợp triển khai các dự án đầu tư của Tập đoàn. Trực tiếp thẩm định tính khả thi của các hạng mục thiết bị, công nghệ thuộc các dự án sản xuất Sợi/Dệt/Nhuộm/May do Công ty mẹ và các Đơn vị thành viên đề xuất.Nghiên cứu và Phát triển : Phối hợp nghiên cứu phát triển các sản phẩm, mặt hàng và công nghệ mới. Hỗ trợ tổ chức, ứng dụng và thử nghiệm các giải pháp này vào thực tế sản xuất tại Tập đoàn và các Đơn vị thành viên.Các nhiệm vụ khác: Thực hiện các nhiệm vụ chuyên môn khác theo sự phân công của Lãnh đạo Ban Đầu tư và Phát triển.', 'Học vấn: Tốt nghiệp Đại học trở lên chuyên ngành Sợi/Dệt/Nhuộm/May, Quản lý công nghiệp, Kỹ thuật hệ thống công nghiệp hoặc các chuyên ngành kỹ thuật có liên quan.Kinh nghiệm: Có ít nhất 1 năm kinh nghiệm làm việc thực tế trong lĩnh vực sản xuất hoặc quản lý kỹ thuật ngành Dệt may.Ngoại ngữ: Giao tiếp tốt bằng Tiếng Anh hoặc Tiếng Trung; có khả năng đọc hiểu, biên/phiên dịch thành thạo các tài liệu kỹ thuật chuyên ngành.Kỹ năng tin học: Sử dụng thành thạo tin học văn phòng (Word, Excel, PowerPoint) và các phần mềm hỗ trợ công việc kỹ thuật/quản lý dự án.Kỹ năng mềm: Có tư duy phân tích tốt, chủ động trong công việc; có khả năng làm việc độc lập và kỹ năng phối hợp làm việc nhóm hiệu quả.', 'Thu nhập & Đãi ngộ:Thu nhập cạnh tranh: Mức lương thỏa thuận dựa trên năng lực, kinh nghiệm thực tế và giá trị đóng góp.Chính sách thưởng hấp dẫn: Bao gồm lương tháng 13, thưởng đánh giá hiệu quả công việc (KPIs) hàng tháng, cuối năm và các khoản thưởng đột xuất khi hoàn thành xuất sắc công việc.Đào tạo và Phát triển:Lộ trình thăng tiến minh bạch: Cơ hội rộng mở để phát triển chuyên sâu về các lĩnh vực trong ngành dệt may cũng như cơ hội lên các vị trí quản lý cấp trung và cấp cao dành cho nhân sự tâm huyết, có hiệu suất vượt trội và gắn bó lâu dài.Đào tạo chuyên sâu: Được tài trợ tham gia các chương trình đào tạo trong và ngoài nước nhằm cập nhật công nghệ mới, nâng cao nghiệp vụ quản lý dự án và năng lực chuyên môn.Phúc lợi & Chăm sóc:Phúc lợi toàn diện: Hưởng đầy đủ các chế độ BHXH, BHYT, BHTN theo luật.Chăm sóc đời sống: Các chế độ công đoàn chu đáo (thăm hỏi ốm đau, thai sản, hiếu hỉ...) và thường xuyên tham gia các hoạt động gắn kết tập thể (du lịch nghỉ mát thường niên, teambuilding, tiệc sinh nhật...).Môi trường & Điều kiện làm việc:Văn hóa doanh nghiệp: Môi trường làm việc chuyên nghiệp, văn minh, đề cao sự chủ động, tinh thần đổi mới sáng tạo và hiệu suất công việc.Trang thiết bị: Được cung cấp đầy đủ các công cụ, phần cứng/phần mềm hiện đại, tối ưu nhất để phục vụ cho công tác chuyên môn.', NULL, NULL, 'Hà Nội', 'FULLTIME', 'MIDDLE', 'APPROVED', '2026-07-21', 0, 'https://vn.joboko.com/viec-lam-chuyen-vien-ky-thuat-cong-nghe-soi-det-nhuom-may-xvi6540912', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200025, 'dệt may', 'det-may', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300011, 200025, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300011, 200006, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300011, 200021, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200026, 'kỹ thuật', 'ky-thuat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300011, 200026, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300012, 100000, 1016, '[TP.HCM] Điều Dưỡng Viên | Thu Nhập 10-15 Triệu', 'Tiếp đón, hướng dẫn và tư vấn sản phẩm dịch vụ, chăm sóc bệnh nhân trong buổi khám. Phụ việc cho bác sĩ thăm khám người bệnh. Thực hiện kỹ thuật chuyên môn điều dưỡng theo y lệnh: Tiêm thuốc, truyền dịch, thay băng, chăm sóc vết thương, theo dõi các chỉ số sinh tồn (nhiệt độ, huyết áp, mạch, nhịp thở),... Hướng dẫn bệnh nhân cách chăm sóc tại nhà, ăn uống, sinh hoạt, lịch tái khám, kênh chăm sóc/liên hệ hỗ trợ,... Chăm sóc bệnh nhân sau khám: hỏi thăm tình trạng bệnh nhân theo từng cấp độ, giai đoạn sau khám; nhắc lịch tái khám. Phối hợp triển khai hoạt động marketing, chăm sóc khách hàng/bác sĩ. Quản lý hồ sơ bệnh án, thuốc và vật tư tiêu hao.', 'Tốt nghiệp Điều dưỡng (cao đẳng trở lên). Có chứng chỉ hành nghề. Tối thiểu 1 năm kinh nghiệm điều dưỡng phòng khám/bệnh viện. Thành thạo kỹ thuật điều dưỡng, nắm vững quy trình chuyên môn. Có khả năng giao tiếp tốt và tinh thần trách nhiệm cao. Cẩn thận, tận tâm với người bệnh, trách nhiệm, chủ động, tinh thần học hỏi/đổi mới.', 'Thu nhập: 10-15tr/tháng. Lương tháng 13, Thưởng lễ, tết, thưởng hiệu quả công việc. Cơ hội thăng tiến và phát triển nghề nghiệp. Môi trường làm việc chuyên nghiệp, năng động và thân thiện. Được đào tạo nâng cao nghiệp vụ thường xuyên. Được thăm khám sức khỏe miễn phí tổng quát 1 năm 1 lần tại hệ thống phòng khám đa khoa Vietlife. Mua các sản phẩm dược của Vietlife sản xuất với chính sách ưu đãi lên đến 50% Tham dự các sự kiện lớn của công ty được tổ chức tại các khách sạn 5 sao trở lên', 10000000, 15000000, 'Hồ Chí Minh', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-17', 0, 'https://vn.joboko.com/viec-lam-dieu-duong-vien-xvi6539278', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300012, 200012, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200027, 'điều dưỡng', 'dieu-duong', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300012, 200027, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200028, 'phòng khám', 'phong-kham', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300012, 200028, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_posts (id, employer_id, category_id, title, description, requirements, benefits, salary_min, salary_max, location, job_type, level, status, deadline, view_count, source_url, created_at, updated_at)
VALUES (300013, 100010, 1017, '[HN/HCM] Nhân Viên Kỹ Thuật Thi Công Điện, Điện Nhẹ và IT | Không yêu cầu kinh nghiệm', 'Thực hiện các công việc thi công, nghiệm thu các công trình. Thực hiện các công việc liên quan đến hoạt động thi công công trình, và các công việc được giao khác. Làm các hệ thống về mạng, thiết bị IT cho văn phòng. Tham gia thi công các công trình Điện động lực, điện nhẹ (Camera, mạng, kiểm soát ra vào, truyền hình), điện lạnh, điện chiếu sáng, PCCC, điện... do Công ty đảm nhận. Ưu tiên ứng viên có kinh nghiệm, tâm huyết với nghề nghiệp, những người đã từng làm qua các công việc về xây lắp hệ thống Điện động lực, điện nhẹ (Camera, mạng, kiểm soát ra vào, truyền hình), điện lạnh, điện chiếu sáng PCCC, điều hòa thông gió...) Thời gian làm việc: Từ thứ 2 đến thứ 7 8h đến 17h hàng ngày', '1. Kiến thức Tốt nghiệp các trường trung cấp, cao đẳng và đại học các chuyên ngành: điện, hệ thống điện, điện công nghiệp... và các chuyên ngành liên quan. Có tuyển những bạn chưa có kinh nghiệm hoặc sinh viên mới ra trường có đào tạo 2. Kỹ năng Sử dụng thành thạo Tin học Văn phòng (Word, Excel...) Khả năng giao tiếp tốt, giải quyết vấn đề linh hoạt. Kỹ năng làm việc nhóm. Ưu tiên cho các bạn biết Auto CAD, 3D 3. Thái độ Cẩn thận, tỉ mỉ. Nhanh nhẹn, linh hoạt, nhiệt tình, Sáng tạo trong công việc Có khả năng chịu áp lực công việc. Có tinh thần trách nhiệm trong công việc. 4. Khác Giới tính nam Có thể làm việc ngoài giờ nếu công việc phát sinh', 'Mức lương: 8.000.000-15.000.000 (thỏa thuận theo năng lực và kinh nghiệm, trao đổi cụ thể khi phỏng vấn) Được hưởng lương tháng 13 và các chế độ theo quy định của luật lao động. Được hưởng chế độ thăm hỏi ốm đau, thai sản, hiếu hỉ theo quy định. Được nghỉ các ngày lễ lớn trong năm theo quy định của pháp luật. Được giam gia BHXH khi kí hợp đồng chính thức. Được mua bảo hiểm tai nạn khi làm việc Được tham gia bảo hiểm toàn diện về sức khỏe của BH Bảo Việt sau khi làm việc trên 1 năm. Công ty có tổ chức đi du lịch hằng năm cho nhân viên Có cơ hội đào tạo chuyên sâu. Có cơ hội thăng tiến trong công việc', NULL, NULL, 'Hà Nội, Hồ Chí Minh', 'FULLTIME', 'JUNIOR', 'APPROVED', '2026-07-03', 0, 'https://vn.joboko.com/viec-lam-nhan-vien-ky-thuat-thi-cong-dien-dien-nhe-va-it-xvi6515024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    employer_id = VALUES(employer_id),
    category_id = VALUES(category_id),
    title = VALUES(title),
    description = VALUES(description),
    requirements = VALUES(requirements),
    benefits = VALUES(benefits),
    salary_min = VALUES(salary_min),
    salary_max = VALUES(salary_max),
    location = VALUES(location),
    job_type = VALUES(job_type),
    level = VALUES(level),
    status = VALUES(status),
    deadline = VALUES(deadline),
    source_url = VALUES(source_url),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300013, 200023, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200029, 'điện tử', 'dien-tu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300013, 200029, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300013, 200026, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

INSERT INTO tags (id, name, normalized_name, created_at, updated_at)
VALUES (200030, 'viễn thông', 'vien-thong', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    normalized_name = VALUES(normalized_name),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_post_tags (job_post_id, tag_id, created_at)
VALUES (300013, 200030, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    created_at = job_post_tags.created_at;

COMMIT;
