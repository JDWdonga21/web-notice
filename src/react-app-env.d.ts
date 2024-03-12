// react-app-env.d.ts 또는 다른 .d.ts 파일 내
interface Window {
  ReactNativeWebView?: {
    postMessage(message: string): void;
  };
}
