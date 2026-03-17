import { useState, useEffect } from "react";

const STORAGE_KEY = "subscribers_data";

interface Entry {
  id: number;
  region: string;
  name: string;
  phone: string;
  agreed: string;
  rejectionReason: string;
  commitment: string;
  currentPrice: string;
  notes: string;
}

const emptyForm = (): Omit<Entry, "id"> => ({
  region: "نعلين",
  name: "",
  phone: "",
  agreed: "",
  rejectionReason: "",
  commitment: "",
  currentPrice: "",
  notes: "",
});

function loadEntries(): Entry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function saveEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function printSupervisor(entries: Entry[]): void {
  const cols: { key: keyof Entry; label: string }[] = [
    { key: "name", label: "اسم المشترك" },
    { key: "phone", label: "رقم التواصل" },
    { key: "agreed", label: "الموافقة على العرض" },
    { key: "rejectionReason", label: "أسباب الرفض" },
    { key: "commitment", label: "فترة الالتزام" },
    { key: "currentPrice", label: "السعر (شيكل)" },
  ];
  const rows = entries
    .map((e, i) => `<tr><td>${i + 1}</td>${cols.map(c => `<td>${e[c.key] || ""}</td>`).join("")}</tr>`)
    .join("");
  const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"/><title>تقرير المشرف</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Tajawal',sans-serif;padding:20px;color:#111;font-size:13px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;border-bottom:3px solid #1a3c6e;padding-bottom:12px}
    .title{font-size:20px;font-weight:900;color:#1a3c6e}
    table{width:100%;border-collapse:collapse}
    th{background:#1a3c6e;color:#fff;padding:9px 10px;text-align:right;font-weight:700;font-size:13px}
    td{padding:8px 10px;border-bottom:1px solid #dde;font-size:12px}
    tr:nth-child(even) td{background:#f4f7fb}
    td:first-child{text-align:center;color:#888;font-size:11px}
    .footer{margin-top:14px;font-size:11px;color:#999;text-align:center}
  </style></head><body>
  <div class="header">
    <div><div class="title">📋 تقرير المشتركين — نعلين</div>
    <div style="font-size:13px;color:#555;margin-top:4px">إجمالي: ${entries.length} مشترك</div></div>
    <div style="font-size:12px;color:#555;text-align:left">التاريخ: ${new Date().toLocaleDateString("ar-EG")}<br/>الوقت: ${new Date().toLocaleTimeString("ar-EG")}</div>
  </div>
  <table><thead><tr><th>#</th>${cols.map(c => `<th>${c.label}</th>`).join("")}</tr></thead>
  <tbody>${rows}</tbody></table>
  <div class="footer">هذا التقرير سري — للاستخدام الرسمي فقط</div>
  </body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

async function exportExcel(entries: Entry[], supervisorOnly: boolean): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — CDN import resolved at runtime
  // eslint-disable-next-line import/no-unresolved
  const XLSX = await import(/* @vite-ignore */ "https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
  const supCols: (keyof Entry)[] = ["name", "phone", "agreed", "rejectionReason", "commitment", "currentPrice"];
  const allCols: (keyof Entry)[] = ["region", "name", "phone", "agreed", "rejectionReason", "commitment", "currentPrice", "notes"];
  const labels: Record<keyof Entry, string> = {
    id: "#",
    region: "المنطقة",
    name: "اسم المشترك",
    phone: "رقم التواصل",
    agreed: "الموافقة على العرض",
    rejectionReason: "أسباب الرفض",
    commitment: "فترة الالتزام",
    currentPrice: "السعر (شيكل)",
    notes: "ملاحظات خاصة",
  };
  const cols = supervisorOnly ? supCols : allCols;
  const header = cols.map(c => labels[c]);
  const rows = entries.map((e, i) => [i + 1, ...cols.map(c => e[c] || "")]);
  const ws = (XLSX as any).utils.aoa_to_sheet([["#", ...header], ...rows]);
  ws["!cols"] = [{ wch: 4 }, ...cols.map(c => ({ wch: c === "notes" || c === "rejectionReason" ? 32 : 20 }))];
  const wb = (XLSX as any).utils.book_new();
  (XLSX as any).utils.book_append_sheet(wb, ws, "البيانات");
  (XLSX as any).writeFile(wb, supervisorOnly ? "تقرير_المشرف.xlsx" : "تقرير_كامل.xlsx");
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1.5px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "13px 14px",
  color: "#f0f4ff",
  fontSize: "15px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#7eb3ff",
  marginBottom: "6px",
  fontWeight: 700,
  letterSpacing: "0.5px",
};

function Field({ label, value, onChange, placeholder = "", type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {options.map(o => <option key={o} value={o}>{o || "— اختر —"}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
      />
    </div>
  );
}

function Tag({ icon, val, color }: { icon: string; val: string; color?: string }) {
  return (
    <span style={{
      background: color || "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "3px 10px",
      fontSize: "12px",
      color: "#cbd5e1",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
    }}>
      {icon} {val}
    </span>
  );
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries);
  const [form, setForm] = useState(emptyForm());
  const [tab, setTab] = useState<"form" | "list">("form");
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { saveEntries(entries); }, [entries]);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleSave = () => {
    if (!form.name.trim()) { showToast("⚠️ الرجاء إدخال اسم المشترك"); return; }
    setEntries(p => {
      const u = [...p, { ...form, id: Date.now() }];
      saveEntries(u);
      return u;
    });
    setForm(emptyForm());
    showToast("✅ تم حفظ المشترك بنجاح!");
  };

  const doDelete = () => {
    setEntries(p => {
      const u = p.filter(e => e.id !== deleteId);
      saveEntries(u);
      return u;
    });
    setDeleteId(null);
    showToast("🗑️ تم الحذف");
  };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0b1422", fontFamily: "'Tajawal','Segoe UI',sans-serif", color: "#e8f0ff", maxWidth: "480px", margin: "0 auto" }}>
      <style>{`
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)}
        input:focus,select:focus,textarea:focus{outline:none!important;border-color:#3b82f6!important;background:rgba(59,130,246,0.08)!important}
        select option{background:#1a2740;color:#e8f0ff}
        .btn{cursor:pointer;border:none;border-radius:12px;font-family:inherit;font-weight:700;transition:all 0.15s}
        .btn:active{transform:scale(0.96)}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)", background: toast.startsWith("✅") ? "#065f46" : toast.startsWith("🗑") ? "#374151" : "#7c2d12", color: "#fff", padding: "12px 24px", borderRadius: "40px", fontSize: "14px", fontWeight: 700, zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {/* Delete modal */}
      {deleteId !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#162035", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "300px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗑️</div>
            <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>حذف المشترك؟</div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "22px" }}>لا يمكن التراجع عن هذا الإجراء</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn" onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.07)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", fontSize: "14px" }}>إلغاء</button>
              <button className="btn" onClick={doDelete} style={{ flex: 1, padding: "12px", background: "rgba(239,68,68,0.85)", color: "#fff", fontSize: "14px" }}>حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#112240,#1a3a6e)", padding: "20px 18px 16px", borderBottom: "1px solid rgba(59,130,246,0.2)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: "20px", fontWeight: 900, color: "#fff" }}>📋 استمارة المشتركين</div>
        <div style={{ fontSize: "12px", color: "#64b5f6", marginTop: "3px" }}>نعلين — {entries.length} مشترك مسجّل</div>
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          {(["form", "list"] as const).map((key) => (
            <button key={key} className="btn" onClick={() => setTab(key)}
              style={{ flex: 1, padding: "10px", background: tab === key ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)", color: tab === key ? "#93c5fd" : "#94a3b8", border: `1px solid ${tab === key ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)"}`, fontSize: "13px" }}>
              {key === "form" ? "➕ استمارة" : "📋 السجل"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px" }}>

        {/* FORM */}
        {tab === "form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#7eb3ff", letterSpacing: "1px" }}>📍 معلومات أساسية</div>
              <Field label="المنطقة" value={form.region} onChange={v => set("region", v)} />
              <Field label="اسم المشترك *" value={form.name} onChange={v => set("name", v)} placeholder="الاسم الكامل" />
              <Field label="رقم التواصل" value={form.phone} onChange={v => set("phone", v)} placeholder="05XXXXXXXX" type="tel" />
            </div>

            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#6ee7b7", letterSpacing: "1px" }}>📊 تفاصيل العرض</div>
              <Select label="الموافقة على العرض" value={form.agreed} onChange={v => set("agreed", v)} options={["", "نعم", "لا", "مهتم - يحتاج متابعة"]} />
              <Field label="أسباب الرفض / الوضع الحالي" value={form.rejectionReason} onChange={v => set("rejectionReason", v)} placeholder="مثال: شريحة إسرائيلية..." />
              <Select label="فترة الالتزام" value={form.commitment} onChange={v => set("commitment", v)} options={["", "شهري", "3 أشهر", "6 أشهر", "سنة"]} />
              <Field label="السعر الحالي (شيكل)" value={form.currentPrice} onChange={v => set("currentPrice", v)} placeholder="مثال: 50" type="number" />
            </div>

            <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#fcd34d", letterSpacing: "1px", marginBottom: "14px" }}>🔒 ملاحظاتك الخاصة</div>
              <Textarea label="لن تظهر في تقرير المشرف أبداً" value={form.notes} onChange={v => set("notes", v)} placeholder="ملاحظاتك الشخصية عن الزيارة..." />
            </div>

            <button className="btn" onClick={handleSave} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", fontSize: "16px", fontWeight: 900, borderRadius: "14px", boxShadow: "0 6px 20px rgba(37,99,235,0.4)" }}>
              💾 حفظ المشترك
            </button>
          </div>
        )}

        {/* LIST */}
        {tab === "list" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, letterSpacing: "1px" }}>تصدير للمشرف</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn" onClick={() => printSupervisor(entries)} style={{ flex: 1, padding: "13px 8px", background: "linear-gradient(135deg,#1e3a5f,#1d4ed8)", color: "#fff", fontSize: "13px" }}>🖨️ طباعة</button>
                <button className="btn" onClick={() => exportExcel(entries, true)} style={{ flex: 1, padding: "13px 8px", background: "linear-gradient(135deg,#14532d,#166534)", color: "#fff", fontSize: "13px" }}>📥 Excel</button>
              </div>
              <button className="btn" onClick={() => exportExcel(entries, false)} style={{ width: "100%", padding: "11px", background: "rgba(255,255,255,0.05)", color: "#64748b", fontSize: "13px", border: "1px solid rgba(255,255,255,0.08)" }}>
                📥 تصدير كامل (لي فقط)
              </button>
            </div>

            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>لا توجد بيانات بعد</div>
                <div style={{ fontSize: "13px", marginTop: "6px" }}>أضف مشتركين من تبويب الاستمارة</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {entries.map((e, i) => (
                  <div key={e.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: 700, background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: "20px" }}>#{i + 1}</span>
                        <span style={{ fontSize: "15px", fontWeight: 800, color: "#e2e8f0" }}>{e.name}</span>
                      </div>
                      <button className="btn" onClick={() => setDeleteId(e.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "5px 12px", fontSize: "12px", borderRadius: "8px" }}>حذف</button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {e.phone && <Tag icon="📞" val={e.phone} />}
                      {e.agreed && <Tag icon="✅" val={e.agreed} color={e.agreed === "نعم" ? "rgba(6,95,70,0.6)" : e.agreed === "لا" ? "rgba(124,29,29,0.6)" : "rgba(30,58,95,0.6)"} />}
                      {e.currentPrice && <Tag icon="💰" val={e.currentPrice + " ₪"} />}
                      {e.commitment && <Tag icon="🗓️" val={e.commitment} />}
                    </div>
                    {e.rejectionReason && <div style={{ marginTop: "8px", fontSize: "12px", color: "#94a3b8" }}>📌 {e.rejectionReason}</div>}
                    {e.notes && <div style={{ marginTop: "8px", fontSize: "12px", color: "#f59e0b", background: "rgba(245,158,11,0.07)", padding: "7px 10px", borderRadius: "8px" }}>🔒 {e.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
