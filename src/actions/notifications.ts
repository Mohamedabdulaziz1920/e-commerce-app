'use server';

import { createClient } from '@/supabase/server';

/* ---------------------------------------------------------
 * Helpers
 * ------------------------------------------------------- */

/**
 * يرسل إشعار Push عبر خدمة Expo.
 */
async function sendPushNotification({
  expoPushToken,
  title,
  body,
}: {
  expoPushToken: string;
  title: string;
  body: string;
}) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

/* ---------------------------------------------------------
 * Data access
 * ------------------------------------------------------- */

/**
 * يجلب توكن Expo للمستخدم.
 * الجدول: `expo_notification_tokens`
 *  - user_id (uuid)  → مفتاح أساسي ومفتاح أجنبي إلى auth.users(id)
 *  - token   (text)
 */
export const getUserNotificationToken = async (
  userId: string,
): Promise<string | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('expo_notification_tokens')
    .select('token')
    .eq('user_id', userId)
    .maybeSingle(); // لا يخفق إن لم يوجد صفّ

  if (error) throw new Error(error.message);

  return data?.token ?? null;
};

/* ---------------------------------------------------------
 * Public API
 * ------------------------------------------------------- */

/**
 * يرسل إشعارًا للمستخدم في حال وجود توكن مسجَّل.
 *
 * @param userId UUID المستخدم من جدول auth.users
 * @param status نص حالة الطلب (مثلاً: "shipped", "processing")
 */
export const sendNotification = async (
  userId: string,
  status: string,
): Promise<void> => {
  const token = await getUserNotificationToken(userId);

  // إذا لم يكن لدى المستخدم توكن لا نفعل شيئًا
  if (!token) return;

  await sendPushNotification({
    expoPushToken: token,
    title: 'Your Order Status',
    body: `Your order is now ${status}`,
  });
};
