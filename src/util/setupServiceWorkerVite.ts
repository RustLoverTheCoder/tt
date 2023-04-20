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
import Worker from "../serviceWorker?worker&inline";

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

class ServiceWorker {
  worker: any;
  constructor() {
    if (IS_SERVICE_WORKER_SUPPORTED) {
      try {
        this.worker = new Worker();
        this.worker.removeEventListener("message", handleWorkerMessage);
        this.worker.addEventListener("message", handleWorkerMessage);
        this.worker.postMessage({
          type: "clientReady",
        });
      } catch (err) {
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.error("[SW] ServiceWorker registration failed: ", err);
        }
        if (!IS_IOS && !IS_ANDROID && !IS_TEST) {
          showDialog?.({
            data: { message: "SERVICE_WORKER_DISABLED", hasErrorKey: true },
          });
        }
      }
    }
  }
  postMessage(message: any) {
    this.worker.postMessage(message);
  }
  terminate() {
    this.worker.terminate();
  }
}

export default new ServiceWorker();
