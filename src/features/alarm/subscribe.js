import { pushStatus } from '../../app/pushStatus';
import axios from 'axios';

export const subscribe = () => {
  if (!pushStatus.pushSupport) {
    return;
  }

  Notification.requestPermission().then((permission) => {
    pushStatus.notificationPermission = permission;

    if (permission !== 'granted') {
      return;
    }

    if (pushStatus.pushSubscription) {
      console.log('Unsubscribe');
      pushUnsubscribe();
    } else {
      console.log('subscribe');
      pushSubscribe();
    }
  });
};

const pushSubscribe = () => {
  const publicKey = urlB64ToUint8Array(
    'BMyKSzrkrIztIMzoI9wu30Skobzi5V1DWbz9lMUtxm8rV3TFXjeFfXWeeiX0XZ2k1JdzQ7EF_fSiZ53VSGKxISI'
  );
  const option = {
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  };

  navigator.serviceWorker.ready.then((registration) => {
    registration.pushManager
      .subscribe(option)
      .then((subscription) => {
        // 구독 요청 성공 시 받는 PushSubscription객체
        postSubscribe(subscription); // 서버에게 전달
        // 클라이언트에서 푸시 관련 상태를 별도의 객체(pushStatus)를 만들어 관리했다.
        pushStatus.pushSubscription = subscription;
      })
      .catch(() => {
        pushStatus.pushSubscription = null;
      });
  });
};

const pushUnsubscribe = () => {
  if (!pushStatus.pushSubscription) {
    return;
  }

  pushStatus.pushSubscription.unsubscribe().then((result) => {
    if (result && pushStatus.pushSubscription) {
      postUnsubscribe({
        endpoint: pushStatus.pushSubscription.endpoint,
      });
      pushStatus.pushSubscription = null;
    }
  });
};

const postSubscribe = async (subscription) => {
  return axios.post(`${process.env.SERVER_URL}/webpush/subscribe`, {
    subscription,
    userId: 1,
  });
};

// 위 코드의 postUnsubscribe(서버 DB에서 해당 endpoint가 있는 구독정보를 삭제한다)
const postUnsubscribe = async ({ endpoint }) => {
  return axios.post(`${process.env.SERVER_URL}/webpush/unSubscribe`, {
    endpoint,
    userId: 1,
  });
};

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
