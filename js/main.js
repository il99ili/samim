/* =====================================================
   ملف الجافاسكريبت الرئيسي — main.js
   كل الوظائف التفاعلية موجودة هنا
   =====================================================

   ملاحظة مهمة للمطوّر:
   هذا الملف يحتوي على وظائف "وهمية" (Mock Functions)
   تشتغل بدون قاعدة بيانات حقيقية.
   عند ربط الـ Backend، استبدل كل دالة فيها API call
   بدلاً من البيانات الثابتة.
   ===================================================== */

/* =====================================================
   1. التنقل بين الواجهات الثلاث
   (الرئيسية / لوحة العميل / لوحة الإدارة)
   ===================================================== */

/**
 * التبديل بين الصفحات
 * @param {string} viewName - اسم الصفحة: 'landing' أو 'client' أو 'admin'
 *
 * ⚡ في المشروع الحقيقي:
 * استبدل هذه الدالة بـ Router حقيقي (مثل React Router أو Vue Router)
 * أو بـ PHP/Laravel routes أو Next.js pages
 */
function switchView(viewName) {
  // أخفِ كل الصفحات
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // أخفِ كل أزرار التبديل
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));

  // أظهر الصفحة المطلوبة
  const targetView = document.getElementById('view-' + viewName);
  if (targetView) targetView.classList.add('active');

  // فعّل الزر المناسب
  const targetBtn = document.getElementById('vb-' + viewName);
  if (targetBtn) targetBtn.classList.add('active');

  // ارجع للأعلى
  window.scrollTo(0, 0);
}

/* =====================================================
   2. التبويبات في لوحة الإدارة
   (الطلبات / المواعيد / العقود / التنبيهات / الدفع)
   ===================================================== */

/**
 * التبديل بين تبويبات الإدارة
 * @param {string} tabName - اسم التبويب
 * @param {HTMLElement} clickedBtn - الزر الذي ضُغط عليه
 */
function switchTab(tabName, clickedBtn) {
  // أخفِ كل التبويبات
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // أزل التحديد من كل الأزرار
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // أظهر التبويب المطلوب
  const targetPanel = document.getElementById('tab-' + tabName);
  if (targetPanel) targetPanel.classList.add('active');

  // فعّل الزر المضغوط
  if (clickedBtn) clickedBtn.classList.add('active');
}

/* =====================================================
   3. الشات / المحادثة
   ===================================================== */

/**
 * إرسال رسالة في الشات
 * @param {KeyboardEvent|MouseEvent} event - الحدث (ضغطة زر أو كيبورد)
 *
 * ⚡ في المشروع الحقيقي:
 * اربط هذه الدالة بـ WebSocket أو Firebase Realtime Database
 * أو بـ API endpoint مثل: POST /api/messages
 * ثم اعرض الرسالة فقط بعد تأكيد الخادم
 */
function sendMsg(event) {
  // شغّل فقط عند الضغط على Enter أو النقر على زر الإرسال
  if (event.key && event.key !== 'Enter') return;

  const input   = document.getElementById('chatInput');
  const msgList = document.getElementById('chatMessages');
  const text    = input.value.trim();

  // لا ترسل رسالة فارغة
  if (!text) return;

  // ── جهّز الوقت الحالي ──
  const now    = new Date();
  const hour   = now.getHours();
  const min    = String(now.getMinutes()).padStart(2, '0');
  const period = hour >= 12 ? 'م' : 'ص';
  const time   = `${hour}:${min} ${period}`;

  // ── أنشئ فقاعة الرسالة ──
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg mine';
  msgDiv.innerHTML = `
    <div class="msg-avatar client">م</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  // أضف الرسالة للقائمة
  msgList.appendChild(msgDiv);

  // ادفع للأسفل تلقائياً
  msgList.scrollTop = msgList.scrollHeight;

  // امسح الحقل
  input.value = '';

  // ── رد تلقائي وهمي (احذفه عند الربط بالـ Backend) ──
  // في الحقيقة: الرد يجي من الـ WebSocket أو polling
  setTimeout(() => simulateReply(msgList), 1500);
}

/**
 * رد تلقائي وهمي (للعرض فقط)
 * احذف هذه الدالة كاملة عند الربط بالخادم
 */
function simulateReply(msgList) {
  const replies = [
    'شكراً، وصلني! سأتابع معك قريباً.',
    'فاهم، سأعدّل وأرسل لك نسخة محدّثة.',
    'تمام، جارٍ العمل على ذلك الآن ✓',
    'حسناً، سأرفع الملف قبل نهاية اليوم.',
  ];
  const randomReply = replies[Math.floor(Math.random() * replies.length)];

  const replyDiv = document.createElement('div');
  replyDiv.className = 'msg theirs';
  replyDiv.innerHTML = `
    <div class="msg-avatar staff">أ</div>
    <div>
      <div class="msg-bubble">${randomReply}</div>
      <div class="msg-time">الآن</div>
    </div>
  `;
  msgList.appendChild(replyDiv);
  msgList.scrollTop = msgList.scrollHeight;
}

/**
 * منع XSS — لا تعرض النص مباشرة في HTML بدون تنظيف
 * @param {string} text - النص المدخل من المستخدم
 * @returns {string} - نص آمن
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

/* =====================================================
   4. التقويم
   ===================================================== */

/**
 * بناء التقويم ديناميكياً
 *
 * ⚡ في المشروع الحقيقي:
 * اجلب المواعيد من الـ API: GET /api/appointments?month=6&year=2025
 * ثم مرّر مصفوفة الأيام لهذه الدالة
 */
function buildCalendar() {
  const calDays = document.getElementById('calDays');
  if (!calDays) return; // التقويم مش موجود في هذه الصفحة

  // ── أيام فيها مواعيد (من الـ API في المستقبل) ──
  // عدّل هذه المصفوفة أو اجلبها من قاعدة البيانات
  const appointmentDays = [3, 7, 10, 14, 18, 25, 27];
  const today = 27; // اليوم الحالي — في الحقيقة: new Date().getDate()

  // امسح التقويم قبل إعادة البناء
  calDays.innerHTML = '';

  // ── أيام يونيو 2025 (30 يوم) ──
  // في المستقبل: احسب هذا ديناميكياً بدالة
  for (let day = 1; day <= 30; day++) {
    const dayEl = document.createElement('div');

    // حدّد الكلاسات المناسبة
    let classes = 'cal-day';
    if (day === today)                    classes += ' today';
    if (appointmentDays.includes(day))    classes += ' has-event';

    dayEl.className   = classes;
    dayEl.textContent = day;

    // عند الضغط على يوم
    dayEl.addEventListener('click', () => {
      // أزل التحديد من كل الأيام
      document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
      dayEl.classList.add('selected');

      // ── في المستقبل: اجلب مواعيد هذا اليوم ──
      // fetchAppointments(day, 6, 2025);
    });

    calDays.appendChild(dayEl);
  }
}

/* =====================================================
   5. فلترة جدول الطلبات
   ===================================================== */

/**
 * بحث في الجدول بالنص
 * @param {string} searchText - النص المكتوب في حقل البحث
 *
 * ⚡ في المشروع الحقيقي:
 * أرسل البحث للـ API: GET /api/orders?search=نور
 * وأعد رسم الجدول بالنتائج — لا تعتمد على فلترة الـ DOM
 */
function filterTable(searchText) {
  const rows = document.querySelectorAll('#ordersTable tbody tr');
  const term = searchText.toLowerCase().trim();

  rows.forEach(row => {
    // ابحث في كل محتوى الصف
    const rowText = row.textContent.toLowerCase();
    row.style.display = rowText.includes(term) ? '' : 'none';
  });
}

/**
 * فلترة الجدول بالحالة
 * @param {string} status - الحالة المختارة من القائمة
 */
function filterStatus(status) {
  const rows = document.querySelectorAll('#ordersTable tbody tr');

  rows.forEach(row => {
    const showRow = !status || row.textContent.includes(status);
    row.style.display = showRow ? '' : 'none';
  });
}

/* =====================================================
   6. أزرار الاعتماد (الموافقة / الرفض)
   ===================================================== */

/**
 * اعتماد مرحلة أو ملف
 * @param {HTMLElement} btn - الزر الذي ضُغط عليه
 *
 * ⚡ في المشروع الحقيقي:
 * أرسل للـ API: POST /api/approvals/:id/approve
 * ثم حدّث الواجهة بعد التأكيد
 */
function approveItem(btn) {
  const item = btn.closest('.approval-item');
  if (!item) return;

  // أظهر حالة النجاح
  item.style.opacity = '0.5';
  item.style.borderColor = 'var(--success)';

  // في الواقع: أرسل للـ API ثم أزل العنصر
  setTimeout(() => {
    item.remove();
    updateApprovalBadge(); // حدّث عداد الإشعارات
  }, 600);
}

/**
 * رفض أو طلب تعديل
 * @param {HTMLElement} btn - الزر الذي ضُغط عليه
 */
function rejectItem(btn) {
  const item = btn.closest('.approval-item');
  if (!item) return;

  // في الواقع: افتح نافذة تعليق ثم أرسل للـ API
  const comment = prompt('اكتب ملاحظاتك للمصمم:');
  if (comment) {
    item.style.borderColor = 'var(--danger)';
    // API call: POST /api/approvals/:id/reject { comment }
    setTimeout(() => item.remove(), 600);
  }
}

/**
 * تحديث عداد الإشعارات في السايدبار
 */
function updateApprovalBadge() {
  const remaining = document.querySelectorAll('.approval-item').length;
  const badge = document.querySelector('.nav-badge');
  if (badge) {
    badge.textContent = remaining;
    if (remaining === 0) badge.style.display = 'none';
  }
}

/* =====================================================
   7. خيارات طريقة الدفع
   ===================================================== */

/**
 * تحديد طريقة الدفع المختارة
 * يعمل بدون jQuery بشكل مباشر
 */
function initPaymentOptions() {
  document.querySelectorAll('.pm-option').forEach(option => {
    option.addEventListener('click', () => {
      // أزل التحديد من كل الخيارات
      document.querySelectorAll('.pm-option').forEach(o => o.classList.remove('selected'));
      // حدّد المختار
      option.classList.add('selected');
      // فعّل الـ radio button
      const radio = option.querySelector('input[type=radio]');
      if (radio) radio.checked = true;
    });
  });
}

/* =====================================================
   8. مفاتيح التشغيل/إيقاف (Toggles)
   ===================================================== */

/**
 * تبديل حالة مفتاح التشغيل
 * @param {HTMLElement} toggle - عنصر المفتاح
 *
 * ⚡ في المشروع الحقيقي:
 * احفظ الحالة في قاعدة البيانات:
 * PATCH /api/settings/notifications { sms: true, email: false }
 */
function initToggles() {
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');

      // في الحقيقة: احفظ الإعداد
      const isOn = toggle.classList.contains('on');
      console.log(`إعداد التنبيه: ${isOn ? 'مشغّل' : 'موقوف'}`);
      // API call: PATCH /api/settings { ... }
    });
  });
}

/* =====================================================
   9. تهيئة المنصة عند تحميل الصفحة
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── بنِ التقويم ──
  buildCalendar();

  // ── هيّئ خيارات الدفع ──
  initPaymentOptions();

  // ── هيّئ مفاتيح التشغيل ──
  initToggles();

  console.log('✅ المنصة جاهزة!');
});

/* =====================================================
   ═══════════════════════════════════════════════════
   دليل الربط بالـ Backend
   ═══════════════════════════════════════════════════

   1. قاعدة البيانات المقترحة:
   ──────────────────────────
   • MySQL أو PostgreSQL للبيانات الأساسية
   • Redis للجلسات والتخزين المؤقت (cache)
   • Firebase أو Supabase لو تبغى بداية سريعة

   2. الجداول الأساسية المقترحة:
   ──────────────────────────
   ┌──────────┬────────────────────────────────────┐
   │  جدول    │  الحقول الأساسية                   │
   ├──────────┼────────────────────────────────────┤
   │ users    │ id, name, email, role, phone        │
   │ orders   │ id, client_id, type, status, notes  │
   │ messages │ id, order_id, sender_id, body, time │
   │ versions │ id, order_id, version_num, file_url │
   │ approvals│ id, order_id, file_url, status      │
   │ contracts│ id, client_id, type, signed_at      │
   │ bookings │ id, client_id, date, time, type     │
   │ payments │ id, order_id, amount, method, status│
   └──────────┴────────────────────────────────────┘

   3. الـ API Endpoints الأساسية:
   ──────────────────────────
   GET    /api/orders              ← جلب كل الطلبات
   POST   /api/orders              ← إنشاء طلب جديد
   PATCH  /api/orders/:id          ← تعديل طلب
   GET    /api/orders/:id/messages ← رسائل الطلب
   POST   /api/messages            ← إرسال رسالة
   GET    /api/appointments        ← المواعيد
   POST   /api/approvals/:id/approve  ← اعتماد
   POST   /api/approvals/:id/reject   ← رفض

   4. الإشعارات (SMS/Email):
   ──────────────────────────
   • SMS: Twilio أو Unifonic (للسعودية) أو Taqnyat
   • Email: SendGrid أو Mailgun أو Amazon SES
   • كل إشعار: event يطلق من الـ backend بعد كل عملية

   5. التوقيع الإلكتروني:
   ──────────────────────────
   • DocuSign (الأكثر انتشاراً)
   • Adobe Sign
   • أو Pandadoc

   6. بوابة الدفع:
   ──────────────────────────
   • HyperPay ← يدعم مدى + بطاقات + Apple Pay
   • Tap Payments ← خيار جيد للسعودية
   • Tamara API ← للتقسيط (3-4 أقساط)
   • Tabby API  ← للتقسيط أيضاً

   7. التخزين السحابي للملفات:
   ──────────────────────────
   • Amazon S3 أو Cloudflare R2
   • أو Supabase Storage لو تستخدم Supabase

   ═══════════════════════════════════════════════════
===================================================== */
