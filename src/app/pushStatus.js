export const isSupported =
  'serviceWorker' in navigator &&
  'Notification' in window &&
  'PushManager' in window;

export const pushStatus = {
  pushSupport: false,
  pushSubscription: null,
  serviceWorkerRegistration: undefined,
  notificationPermission: undefined,
};

export const updatePushStatus = async (registration) => {
  pushStatus.pushSupport = !!registration?.pushManager;
  pushStatus.pushSubscription =
    await registration?.pushManager?.getSubscription();
  pushStatus.serviceWorkerRegistration = registration;
  pushStatus.notificationPermission = Notification.permission;
  console.log('set', pushStatus);
};
