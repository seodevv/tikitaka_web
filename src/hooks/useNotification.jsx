import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  usePostSubscribeMutation,
  usePostUnSubscribeMutation,
} from '../features/alarm/alarmSlice';

const isSupported =
  'serviceWorker' in navigator &&
  'Notification' in window &&
  'PushManager' in window;

const useNotification = (creatorId) => {
  const [status, setStatus] = useState({
    support: false,
    subscription: null,
    registration: undefined,
  });
  const [permission, setPermission] = useState(undefined);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  const updateStatus = async (registration) => {
    if (!registration) return;
    const subscription = await registration.pushManager.getSubscription();
    setStatus({
      support: !!registration.pushManager,
      subscription: subscription,
      registration: registration,
    });
  };

  const [postSubscribe] = usePostSubscribeMutation();
  const subscribe = async () => {
    if (status.subscription) return;

    try {
      const {
        data: { result },
      } = await axios.get(`${process.env.SERVER_URL}/webpush/getKey`);

      const publicKey = urlB64ToUint8Array(result.key);
      const option = {
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      };

      const subscription = await status.registration.pushManager.subscribe(
        option
      );
      await postSubscribe({
        subscription: subscription,
        userId: creatorId,
      });
      setStatus((prev) => ({
        ...prev,
        subscription: subscription,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const [postUnSubscribe] = usePostUnSubscribeMutation();
  const unSubscribe = async () => {
    if (!status.subscription) return;

    try {
      await status.subscription.unsubscribe();
      await postUnSubscribe({
        endpoint: status.subscription.endpoint,
        userId: creatorId,
      });
      status.registration.unregister();
      setStatus((prev) => ({
        ...prev,
        subscription: null,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  const handleServiceWorker = async (permission) => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await updateStatus(registration);
    } else {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      await updateStatus(registration);
    }
    setPermission(permission);
  };

  const check = useRef(false);
  useEffect(() => {
    if (!creatorId) return;
    if (isSupported) {
      check.current = true;
      handleServiceWorker(Notification.permission);
    } else {
      setError('notSupported');
      setIsError(true);
    }
  }, [creatorId]);

  useEffect(() => {
    switch (permission) {
      case 'denied':
        setError('denied');
        setIsError(true);
        break;
      case 'granted':
        if (permission) subscribe();
        break;
      case 'default':
        Notification.requestPermission((permission) => {
          handleServiceWorker(permission);
        });
        break;
      default:
        break;
    }
  }, [permission]);

  return { status, error, isError, subscribe, unSubscribe };
};

export default useNotification;
