import { EventEmitter } from "events";
interface AdapterConnectOptions {
    timeout: number;
}
interface Adapter {
    enableDebug(): void;
    getPeer(): RTCPeerConnection | undefined;
    resetPeer(newPeer: RTCPeerConnection): void;
    connect(opts?: AdapterConnectOptions): Promise<void>;
    disconnect(): Promise<void>;
}
interface AdapterFactoryFunction {
    (peer: RTCPeerConnection, channelUrl: URL, onError: (error: string) => void, mediaConstraints: MediaConstraints, authKey: string | undefined): Adapter;
}
export function ListAvailableAdapters(): string[];
export interface MediaConstraints {
    audioOnly?: boolean;
    videoOnly?: boolean;
}
interface WebRTCPlayerOptions {
    video: HTMLVideoElement;
    type: string;
    adapterFactory?: AdapterFactoryFunction;
    iceServers?: RTCIceServer[];
    debug?: boolean;
    vmapUrl?: string;
    statsTypeFilter?: string;
    detectTimeout?: boolean;
    timeoutThreshold?: number;
    mediaConstraints?: MediaConstraints;
}
export class WebRTCPlayer extends EventEmitter {
    constructor(opts: WebRTCPlayerOptions);
    load(channelUrl: URL, authKey?: string | undefined): Promise<void>;
    mute(): void;
    unmute(): void;
    unload(): Promise<void>;
    stop(): void;
    destroy(): void;
}

//# sourceMappingURL=types.d.ts.map
