import { ZoomMtg } from '@zoomus/websdk';

// Load Zoom Web SDK assets
ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.3/lib', '/av');

// Preload WASM and prepare SDK
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// Load language files
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

export { ZoomMtg };
