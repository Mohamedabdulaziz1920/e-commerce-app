import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { Database } from '@/lib/database.types'; // ✅ مسار ملف الأنواع المُولّد

/**
 * يُنشئ عميل Supabase لاستخدامه في مكوّنات الخادم
 * مع دعم تلقائي لقراءة/كتابة الكوكيز الخاصة بالجلسة.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // تُمرَّر جميع الكوكيز الحالية إلى Supabase لتوثيق الجلسة
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // يُحدِّث الكوكيز بعد عمليات Supabase (مثل تجديد الجلسة)
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* 
             * إذا استُدعيت setAll من Server Component (بدل Middleware)، 
             * قد يرمي next/headers خطأ منع الكتابة. 
             * يمكن تجاهل الخطأ إذا كان لديك Middleware يعالج تجديد الجلسة بدلاً من ذلك.
             */
          }
        },
      },
    }
  );
}
