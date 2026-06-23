
## الهدف
تحويل صفحات HTML الثابتة الحالية إلى تطبيق React/TanStack Start كامل، بنفس التصميم الموجود في الملف الأصلي (Wavy Pro - ستائر)، مع لوحة تحكم React تعدّل المحتوى مباشرة على الصفحات.

## البنية الجديدة

### 1. الصفحات (React Routes)
استبدال كل ملفات `public/*.html` بصفحات TanStack:
- `src/routes/index.tsx` — الرئيسية (Hero, About, Services, Curtains, CTA)
- `src/routes/about.tsx` — من نحن
- `src/routes/services.tsx` — الخدمات
- `src/routes/services.consultation.tsx` — استشارات
- `src/routes/services.measurement.tsx` — مقايسة
- `src/routes/services.fabrication.tsx` — تفصيل
- `src/routes/services.installation.tsx` — تركيب
- `src/routes/services.maintenance.tsx` — صيانة
- `src/routes/works.tsx` — أعمالنا
- `src/routes/contact.tsx` — تواصل
- `src/routes/blog.tsx` — المدونة (قائمة المقالات)
- `src/routes/post.$slug.tsx` — مقالة مفردة

### 2. المكونات المشتركة
- `src/components/site/Header.tsx` — رأس الموقع (شعار + قائمة + هاتف)
- `src/components/site/Footer.tsx` — تذييل (روابط + سوشيال + معلومات تواصل)
- `src/components/site/Hero.tsx`, `ServiceCard.tsx`, `CurtainCard.tsx`, إلخ
- جميعها تقرأ من `useSiteContent()` (React Query) المرتبط بـ `/api/content`

### 3. نظام التصميم
- نقل ألوان/خطوط `shared.css` إلى `src/styles.css` كـ design tokens (oklch)
- خطوط عربية (Tajawal/Cairo) و RTL افتراضي
- ألوان: ذهبي على خلفية كريمية/داكنة بنفس روح التصميم الأصلي

### 4. لوحة التحكم (`/admin`)
- `src/routes/_authenticated/admin.tsx` (محمي بـ Supabase Auth)
- `src/routes/login.tsx` — تسجيل دخول
- أقسام لوحة التحكم:
  - **الإعدادات العامة**: اسم العلامة، الشعار، أرقام الهواتف، روابط السوشيال، الإيميل، العنوان
  - **القائمة الرئيسية**: تعديل عناصر التنقل
  - **القسم الترويسي (Hero)**: العناوين، الصور، أزرار الدعوة
  - **الخدمات**: عنوان كل خدمة + وصف + صورة
  - **أنواع الستائر**: قائمة قابلة للإضافة/الحذف
  - **من نحن**: نص + صور
  - **بيانات التواصل والـ SEO**
  - **المقالات (CRUD كامل)**: عنوان، slug، مقتطف، صورة غلاف، محتوى HTML (محرر بسيط)، نشر/إخفاء
  - **رفع الصور**: عبر `/api/upload` إلى Supabase Storage

### 5. ربط البيانات
- `site_content` (jsonb) يخزّن كل محتوى الموقع كهيكل واحد
- `useSiteContent()` hook: `useQuery` يقرأ من `/api/content`، يتم invalidate عند حفظ التعديلات
- كل صفحة عامة تستخدم نفس الـ hook → التعديل من اللوحة ينعكس فوراً على الصفحات
- المقالات من جدول `articles` (موجود مسبقاً)

### 6. التنظيف
- حذف كل ملفات `public/*.html` ما عدا الصور والأصول الثابتة في `public/assets/` و `public/uploads/`
- حذف `_index.html` و `admin.html` القديمة
- حذف `src/routes/api/index.html.ts` و الـ route الخاص بـ `/index.html`
- إبقاء API routes الحالية (`/api/content`, `/api/articles`, `/api/upload`)

### 7. التحقق
- تشغيل المعاينة، التنقل بين الصفحات
- تسجيل دخول إلى `/admin`، تعديل قسم (مثل رقم الهاتف أو عنوان Hero)، التحقق من ظهور التغيير في الصفحة الرئيسية فوراً
- إضافة/تعديل/حذف مقالة والتحقق من ظهورها في `/blog`

## ملاحظات تقنية
- المحرر النصي للمقالات: textarea بسيط لـ HTML (يمكن لاحقاً ترقيته إلى TipTap)
- صورة من اللوحة ترفع عبر `supabase.storage` مباشرة من المتصفح (أبسط من الـ API route)
- كل القراءات العامة عبر `supabase` بـ anon key (RLS تسمح بالقراءة العامة)
- الكتابة من اللوحة تتطلب جلسة Supabase Auth

## التسليم
بعد التطبيق ستحتاج إلى إنشاء حساب admin من Cloud → Users لتسجيل الدخول إلى `/admin`.
