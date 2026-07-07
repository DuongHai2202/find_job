import { DataPanel, PageIntro } from "@/components/ui";

export function PhasePlaceholderPage({ area, title, description }) {
  return (
    <div className="stack">
      <PageIntro
        description="Trang này đã được gắn đúng vị trí trong app shell và sẽ được hoàn thiện ở phase chức năng tương ứng."
        meta={area}
        title={title}
      />
      <DataPanel title="Trạng thái hiện tại">
        <p>{description}</p>
        <div className="split-note">
          Phase foundation đã khóa design tokens, CSS architecture và app shell. Nội dung nghiệp vụ chi tiết sẽ được đưa vào ở phase workspace tương ứng.
        </div>
      </DataPanel>
    </div>
  );
}
