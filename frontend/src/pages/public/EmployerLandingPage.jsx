import { Link } from "react-router-dom";

import { employerValuePoints } from "@/content/siteCopy";

export function EmployerLandingPage() {
  return (
    <>
      <section className="portal-page-hero portal-page-hero--light">
        <div className="portal-page-hero__inner">
          <div className="portal-page-hero__copy">
            <span className="portal-page-hero__eyebrow">
              Giải pháp tuyển dụng
            </span>
            <h1>
              Thu hút đúng ứng viên hơn ngay từ cách doanh nghiệp xuất hiện.
            </h1>
            <p>
              Không cần phô trương quá nhiều. Chỉ cần một hồ sơ đủ rõ, một tin
              tuyển dụng đủ thuyết phục và một trải nghiệm đủ gọn để người phù
              hợp muốn chủ động bước tới.
            </p>
          </div>

          <div className="portal-employer-hero-actions">
            <Link
              className="button button--primary"
              to="/register?role=EMPLOYER"
            >
              Đăng ký nhà tuyển dụng
            </Link>
            <Link className="button button--secondary" to="/jobs">
              Xem ứng viên đang thấy gì
            </Link>
          </div>
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-employer-overview">
          <article className="portal-employer-overview__copy">
            <div className="portal-section__header">
              <div>
                <h2 className="portal-section__title">
                  Tuyển dụng dễ thở hơn khi mọi thứ đi đúng mạch
                </h2>
                <p className="portal-section__subtitle">
                  Từ lúc tạo hồ sơ công ty đến khi đọc CV đầu tiên, doanh nghiệp
                  có thể giữ một trải nghiệm rõ ràng, gọn gàng và đủ chuyên
                  nghiệp để không bỏ lỡ người phù hợp.
                </p>
              </div>
            </div>

            <div className="portal-employer-overview__list">
              {employerValuePoints.map((point) => (
                <div key={point.title}>
                  <strong>{point.title}</strong>
                  <span>{point.description}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="portal-employer-overview__panel">
            <div className="portal-employer-metric">
              <strong>Ít lọc nhiễu hơn</strong>
              <span>
                Tin đăng rõ ý giúp ứng viên tự đánh giá sớm mức độ phù hợp trước
                khi gửi hồ sơ.
              </span>
            </div>
            <div className="portal-employer-metric">
              <strong>Dễ tạo thiện cảm hơn</strong>
              <span>
                Một hồ sơ doanh nghiệp được chăm chút luôn khiến ứng viên nghiêm
                túc ở lại lâu hơn để tìm hiểu.
              </span>
            </div>
            <div className="portal-employer-metric">
              <strong>Đỡ rối khi vận hành</strong>
              <span>
                Thông tin được giữ liền mạch giữa trang public và khu quản lý,
                giúp đội tuyển dụng đỡ mất công rà soát lại nhiều nơi.
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">
              Những gì doanh nghiệp nhận lại!
            </h2>
            <p className="portal-section__subtitle">
              Không phải một danh sách tính năng dài, mà là những lợi ích giúp
              tuyển dụng gọn hơn và có cơ hội gặp đúng người hơn.
            </p>
          </div>
        </div>

        <div className="portal-employer-grid">
          <article className="portal-employer-feature">
            <strong>Thuyết phục ứng viên tốt hơn</strong>
            <span>
              Cấu trúc nội dung rõ ràng giúp ứng viên nhanh hiểu điều quan trọng
              và dễ quyết định bấm xem tiếp.
            </span>
          </article>
          <article className="portal-employer-feature">
            <strong>Theo dõi ứng viên chuyên nghiệp hơn</strong>
            <span>
              Nhìn nhanh vị trí đang mở, hồ sơ mới và các điểm cần ưu tiên mà
              không phải chuyển qua quá nhiều màn hình.
            </span>
          </article>
          <article className="portal-employer-feature">
            <strong>Gây dựng niềm tin sớm hơn</strong>
            <span>
              Khi doanh nghiệp nói rõ mình là ai và đang tìm ai, ứng viên phù
              hợp cũng dễ chủ động hơn khi ứng tuyển.
            </span>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="portal-employer-band portal-employer-band--warm">
          <div className="portal-employer-band__copy">
            <span className="portal-employer-band__eyebrow">
              Bắt đầu tuyển dụng
            </span>
            <h2>
              Chỉ cần bắt đầu đúng cách, phần còn lại sẽ bớt nặng hơn rất nhiều.
            </h2>
            <p className="portal-employer-band__lead">
              Tạo tài khoản doanh nghiệp, hoàn thiện hồ sơ từng bước và xuất
              hiện trước ứng viên theo cách khiến họ muốn tin, muốn đọc và muốn
              phản hồi.
            </p>
          </div>

          <div className="portal-employer-band__panel">
            <div className="portal-employer-band__list">
              <div>
                <strong>Tạo tài khoản nhanh</strong>
                <span>
                  Bắt đầu với thông tin cơ bản rồi hoàn thiện dần khi nhu cầu
                  tuyển dụng rõ hơn.
                </span>
              </div>
              <div>
                <strong>Làm hồ sơ công ty đáng tin</strong>
                <span>
                  Một vài chi tiết đúng chỗ có thể khiến ứng viên cảm thấy đây
                  là nơi rất đáng để cân nhắc.
                </span>
              </div>
              <div>
                <strong>Đăng vị trí đầu tiên</strong>
                <span>
                  Để cơ hội của bạn đến gần hơn với những người đang thực sự tìm
                  một nơi phù hợp.
                </span>
              </div>
            </div>

            <Link
              className="button button--primary"
              to="/register?role=EMPLOYER"
            >
              Tạo tài khoản tuyển dụng
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
