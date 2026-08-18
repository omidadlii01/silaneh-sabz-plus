import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { apiRegisterPushToken, apiUnregisterPushToken } from '../api';

const LAST_TOKEN_KEY = 'silaneh_push_token';

/**
 * Requests notification permission and registers this device's FCM token
 * with the backend, so admin-sent push notifications (e.g. "new version
 * available") can reach it. No-op on web/PWA -- push only works in the
 * installed Android app.
 *
 * Re-runs when customerId changes so a token gets re-linked to whichever
 * customer is currently logged in on this device.
 */
export function usePushNotifications(customerId: string | undefined) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let registrationListener: { remove: () => void } | undefined;
    let errorListener: { remove: () => void } | undefined;

    (async () => {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');

        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive !== 'granted') return;

        registrationListener = await PushNotifications.addListener('registration', (token) => {
          localStorage.setItem(LAST_TOKEN_KEY, token.value);
          apiRegisterPushToken(token.value, customerId).catch(() => {});
        });
        errorListener = await PushNotifications.addListener('registrationError', () => {});

        await PushNotifications.register();
      } catch {
        // Plugin unavailable -- push notifications are a non-critical
        // enhancement, fail silently.
      }
    })();

    return () => {
      registrationListener?.remove();
      errorListener?.remove();
    };
  }, [customerId]);
}

/** Call on logout so this device stops receiving pushes meant for the account. */
export async function unregisterDevicePush() {
  const token = localStorage.getItem(LAST_TOKEN_KEY);
  if (!token) return;
  try {
    await apiUnregisterPushToken(token);
  } catch {
    // best-effort only
  }
}
