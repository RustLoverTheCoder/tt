import { DEBUG, DEBUG_MORE, IS_TEST } from "../config";
import { formatShareText } from "./deeplink";
import {
  IS_ANDROID,
  IS_IOS,
  IS_SERVICE_WORKER_SUPPORTED,
} from "./windowEnvironment";
import { validateFiles } from "./files";
import { playNotifySoundDebounced } from "./notifications";
import { focusMessage, openChatWithDraft, showDialog } from "../global/actions";
import ServiceWorker from "../serviceWorker?worker&inline";

type WorkerAction = {
  type: string;
  payload: Record<string, any>;
};

function handleWorkerMessage(e: MessageEvent) {
  const action: WorkerAction = e.data;
  if (DEBUG_MORE) {
    // eslint-disable-next-line no-console
    console.log("[SW] Message from worker", action);
  }
  if (!action.type) return;
  const payload = action.payload;
  switch (action.type) {
    case "focusMessage":
      if (focusMessage) {
        focusMessage(payload as any);
      }
      break;
    case "playNotificationSound":
      playNotifySoundDebounced(action.payload.id);
      break;
    case "share":
      openChatWithDraft({
        text: formatShareText(payload.url, payload.text, payload.title),
        files: validateFiles(payload.files),
      });
      break;
  }
}

function subscribeToWorker(worker: any) {
  worker.removeEventListener("message", handleWorkerMessage);
  worker.addEventListener("message", handleWorkerMessage);

  worker.postMessage({
    type: "clientReady",
  });
}

if (IS_SERVICE_WORKER_SUPPORTED) {
  try {
    const worker = new ServiceWorker();
    subscribeToWorker(worker);
  } catch (err) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error("[SW] ServiceWorker registration failed: ", err);
    }
  }
}
