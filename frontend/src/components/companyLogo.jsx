import { useEffect, useMemo, useState } from "react";
import { Building2 } from "lucide-react";

import { getInitials, isMeaningfulValue } from "@/content/siteCopy";

export function CompanyLogo({ companyName, logoUrl, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  const normalizedLogoUrl = useMemo(() => {
    if (!isMeaningfulValue(logoUrl)) {
      return "";
    }

    return String(logoUrl).trim();
  }, [logoUrl]);

  useEffect(() => {
    setImageFailed(false);
  }, [normalizedLogoUrl]);

  const showImage = Boolean(normalizedLogoUrl) && !imageFailed;
  const classes = [className, "company-logo-shell", showImage ? "company-logo-shell--image" : ""].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {showImage ? (
        <img
          alt={companyName ? `Logo ${companyName}` : "Logo doanh nghiệp"}
          className="company-logo-shell__image"
          loading="lazy"
          onError={() => setImageFailed(true)}
          src={normalizedLogoUrl}
        />
      ) : (
        <span className="company-logo-shell__fallback">
          <Building2 className="company-logo-shell__fallback-icon" size={18} strokeWidth={1.8} />
          <span className="company-logo-shell__fallback-text">{getInitials(companyName)}</span>
        </span>
      )}
    </div>
  );
}
