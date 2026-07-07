import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Code2,
  Factory,
  FlaskConical,
  GraduationCap,
  HandHelping,
  HeartPulse,
  Landmark,
  Megaphone,
  MonitorSmartphone,
  Palette,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Truck,
  Wrench,
} from "lucide-react";

function normalizeCategoryName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " va ")
    .replace(/[._]/g, " ")
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CATEGORY_ICON_RULES = [
  { match: ["it", "phan mem", "cong nghe thong tin", "lap trinh", "software"], icon: Code2 },
  { match: ["ngan hang", "tai chinh", "bao hiem", "chung khoan"], icon: Landmark },
  { match: ["ke toan", "kiem toan", "thue"], icon: Calculator },
  { match: ["giao duc", "dao tao", "gia su"], icon: GraduationCap },
  { match: ["bat dong san"], icon: Building2 },
  { match: ["thiet ke", "my thuat", "do hoa", "sang tao"], icon: Palette },
  { match: ["y te", "duoc", "suc khoe", "benh vien"], icon: HeartPulse },
  { match: ["marketing", "truyen thong", "quang cao", "thuong hieu"], icon: Megaphone },
  { match: ["ban hang", "kinh doanh", "phat trien thi truong"], icon: BadgeDollarSign },
  { match: ["thuong mai dien tu", "ecommerce", "ban le", "retail"], icon: ShoppingBag },
  { match: ["logistics", "van tai", "xuat nhap khau", "chuoi cung ung"], icon: Truck },
  { match: ["san xuat", "ky thuat", "co khi", "bao tri"], icon: Factory },
  { match: ["xay dung", "cong trinh", "giam sat"], icon: Wrench },
  { match: ["phap ly", "luat", "phap che"], icon: Scale },
  { match: ["nhan su", "hanh chinh", "tuyen dung"], icon: HandHelping },
  { match: ["duoc", "xet nghiem", "bac si"], icon: Stethoscope },
  { match: ["an toan", "bao mat", "kiem soat"], icon: ShieldCheck },
  { match: ["hoa hoc", "sinh hoc", "phong thi nghiem", "nghien cuu"], icon: FlaskConical },
  { match: ["cham soc khach hang", "tong dai", "ho tro"], icon: MonitorSmartphone },
];

function resolveCategoryIcon(categoryName) {
  const normalized = normalizeCategoryName(categoryName);
  const rule = CATEGORY_ICON_RULES.find(({ match }) => match.some((keyword) => normalized.includes(keyword)));
  return rule?.icon || BriefcaseBusiness;
}

export function CategoryIcon({ categoryName, className = "", ...props }) {
  const IconComponent = resolveCategoryIcon(categoryName);
  return <IconComponent aria-hidden="true" className={className} {...props} />;
}
