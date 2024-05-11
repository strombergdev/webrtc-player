var $a1w4g$events = require("events");
var $a1w4g$eyevinncsaimanager = require("@eyevinn/csai-manager");
var $a1w4g$eyevinnwhppclient = require("@eyevinn/whpp-client");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "WebRTCPlayer", () => $8c8737df5845fd96$export$f6039712bf1ca949);
$parcel$export(module.exports, "ListAvailableAdapters", () => $4366558ee7129abf$export$62ed887aeb7fab64);

class $d580fda374b2d4e1$export$1bee3ffe1758e87d {
    client = undefined;
    localPeer = undefined;
    debug = false;
    constructor(peer, channelUrl, onError){
        this.channelUrl = channelUrl;
        this.resetPeer(peer);
    }
    enableDebug() {
        this.debug = true;
    }
    resetPeer(newPeer) {
        this.localPeer = newPeer;
    }
    getPeer() {
        return this.localPeer;
    }
    async connect(opts) {
        if (this.localPeer) {
            this.client = new (0, $a1w4g$eyevinnwhppclient.WHPPClient)(this.localPeer, this.channelUrl, {
                debug: this.debug
            });
            await this.client.connect();
        }
    }
    async disconnect() {
        return;
    }
    log(...args) {
        if (this.debug) console.log("WebRTC-player", ...args);
    }
    error(...args) {
        console.error("WebRTC-player", ...args);
    }
}


const $9c9759905f118312$var$DEFAULT_CONNECT_TIMEOUT = 2000;
class $9c9759905f118312$export$5463baa67f138efa {
    waitingForCandidates = false;
    resourceUrl = undefined;
    constructor(peer, channelUrl, onError){
        this.channelUrl = channelUrl;
        this.debug = true;
        this.resetPeer(peer);
    }
    enableDebug() {
        this.debug = true;
    }
    resetPeer(newPeer) {
        this.localPeer = newPeer;
        this.localPeer.onicegatheringstatechange = this.onIceGatheringStateChange.bind(this);
        this.localPeer.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
        this.localPeer.onicecandidateerror = this.onIceCandidateError.bind(this);
        this.localPeer.onicecandidate = this.onIceCandidate.bind(this);
    }
    getPeer() {
        return this.localPeer;
    }
    async connect(opts) {
        if (!this.localPeer) {
            this.log("Local RTC peer not initialized");
            return;
        }
        this.localPeer.addTransceiver("video", {
            direction: "recvonly"
        });
        this.localPeer.addTransceiver("audio", {
            direction: "recvonly"
        });
        const offer = await this.localPeer.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });
        this.localPeer.setLocalDescription(offer);
        this.waitingForCandidates = true;
        this.iceGatheringTimeout = setTimeout(this.onIceGatheringTimeout.bind(this), opts && opts.timeout || $9c9759905f118312$var$DEFAULT_CONNECT_TIMEOUT);
    }
    async disconnect() {
        return;
    }
    log(...args) {
        if (this.debug) console.log("WebRTC-player", ...args);
    }
    error(...args) {
        console.error("WebRTC-player", ...args);
    }
    onIceGatheringStateChange(event) {
        if (!this.localPeer) {
            this.log("Local RTC peer not initialized");
            return;
        }
        this.log("IceGatheringState", this.localPeer.iceGatheringState);
        if (this.localPeer.iceGatheringState !== "complete" || !this.waitingForCandidates) return;
        this.onDoneWaitingForCandidates();
    }
    onIceConnectionStateChange() {
        if (!this.localPeer) {
            this.log("Local RTC peer not initialized");
            return;
        }
        this.log("IceConnectionState", this.localPeer.iceConnectionState);
        if (this.localPeer.iceConnectionState === "failed") this.localPeer.close();
    }
    async onIceCandidate(event) {
        if (event.type !== "icecandidate") return;
        const candidateEvent = event;
        const candidate = candidateEvent.candidate;
        if (!candidate) return;
        this.log("IceCandidate", candidate.candidate);
    }
    onIceCandidateError(e) {
        this.log("IceCandidateError", e);
    }
    onIceGatheringTimeout() {
        this.log("IceGatheringTimeout");
        if (!this.waitingForCandidates) return;
        this.onDoneWaitingForCandidates();
    }
    async onDoneWaitingForCandidates() {
        if (!this.localPeer) {
            this.log("Local RTC peer not initialized");
            return;
        }
        this.waitingForCandidates = false;
        clearTimeout(this.iceGatheringTimeout);
        const response = await fetch(this.channelUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sdp: this.localPeer.localDescription?.sdp
            })
        });
        if (response.ok) {
            const { sdp: sdp  } = await response.json();
            this.localPeer.setRemoteDescription({
                type: "answer",
                sdp: sdp
            });
        }
    }
}


const $4c7e7e20a6e4dde3$var$DEFAULT_CONNECT_TIMEOUT = 2000;
let $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84;
(function(WHEPType) {
    WHEPType[WHEPType["Client"] = 0] = "Client";
    WHEPType[WHEPType["Server"] = 1] = "Server";
})($4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84 || ($4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84 = {}));
class $4c7e7e20a6e4dde3$export$e35e1b35ea68c1 {
    debug = false;
    waitingForCandidates = false;
    resource = null;
    constructor(peer, channelUrl, onError, mediaConstraints, authKey){
        this.mediaConstraints = mediaConstraints;
        this.channelUrl = channelUrl;
        if (typeof this.channelUrl === "string") throw new Error(`channelUrl parameter expected to be an URL not a string`);
        this.whepType = $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Client;
        this.authKey = authKey;
        this.onErrorHandler = onError;
        this.audio = !this.mediaConstraints.videoOnly;
        this.video = !this.mediaConstraints.audioOnly;
        this.resetPeer(peer);
    }
    enableDebug() {
        this.debug = true;
    }
    resetPeer(newPeer) {
        this.localPeer = newPeer;
        this.localPeer.onicegatheringstatechange = this.onIceGatheringStateChange.bind(this);
        this.localPeer.onicecandidate = this.onIceCandidate.bind(this);
    }
    getPeer() {
        return this.localPeer;
    }
    async connect(opts) {
        try {
            await this.initSdpExchange();
        } catch (error) {
            console.error(error.toString());
            this.onErrorHandler("connecterror");
        }
    }
    async disconnect() {
        if (this.resource) {
            this.log(`Disconnecting by removing resource ${this.resource}`);
            const headers = {};
            this.authKey && (headers["Authorization"] = this.authKey);
            const response = await fetch(this.resource, {
                method: "DELETE",
                headers: headers
            });
            if (response.ok) this.log(`Successfully removed resource`);
        }
    }
    async initSdpExchange() {
        clearTimeout(this.iceGatheringTimeout);
        if (this.localPeer && this.whepType === $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Client) {
            if (this.video) this.localPeer.addTransceiver("video", {
                direction: "recvonly"
            });
            if (this.audio) this.localPeer.addTransceiver("audio", {
                direction: "recvonly"
            });
            const offer = await this.localPeer.createOffer();
            // To add NACK in offer we have to add it manually see https://bugs.chromium.org/p/webrtc/issues/detail?id=4543 for details
            if (offer.sdp) {
                const opusCodecId = offer.sdp.match(/a=rtpmap:(\d+) opus\/48000\/2/);
                if (opusCodecId !== null) offer.sdp = offer.sdp.replace("opus/48000/2\r\n", "opus/48000/2\r\na=rtcp-fb:" + opusCodecId[1] + " nack\r\n");
            }
            await this.localPeer.setLocalDescription(offer);
            this.waitingForCandidates = true;
            this.iceGatheringTimeout = setTimeout(this.onIceGatheringTimeout.bind(this), $4c7e7e20a6e4dde3$var$DEFAULT_CONNECT_TIMEOUT);
        } else if (this.localPeer) {
            const offer = await this.requestOffer();
            await this.localPeer.setRemoteDescription({
                type: "offer",
                sdp: offer
            });
            const answer = await this.localPeer.createAnswer();
            try {
                await this.localPeer.setLocalDescription(answer);
                this.waitingForCandidates = true;
                this.iceGatheringTimeout = setTimeout(this.onIceGatheringTimeout.bind(this), $4c7e7e20a6e4dde3$var$DEFAULT_CONNECT_TIMEOUT);
            } catch (error) {
                this.log(answer.sdp);
                throw error;
            }
        }
    }
    async onIceCandidate(event) {
        if (event.type !== "icecandidate") return;
        const candidateEvent = event;
        const candidate = candidateEvent.candidate;
        if (!candidate) return;
        this.log(candidate.candidate);
    }
    onIceGatheringStateChange(event) {
        if (this.localPeer) {
            this.log("IceGatheringState", this.localPeer.iceGatheringState);
            if (this.localPeer.iceGatheringState !== "complete" || !this.waitingForCandidates) return;
            this.onDoneWaitingForCandidates();
        }
    }
    onIceGatheringTimeout() {
        this.log("IceGatheringTimeout");
        if (!this.waitingForCandidates) return;
        this.onDoneWaitingForCandidates();
    }
    async onDoneWaitingForCandidates() {
        this.waitingForCandidates = false;
        clearTimeout(this.iceGatheringTimeout);
        if (this.whepType === $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Client) await this.sendOffer();
        else await this.sendAnswer();
    }
    getResouceUrlFromHeaders(headers) {
        if (headers.get("Location") && headers.get("Location")?.match(/^\//)) {
            const resourceUrl = new URL(headers.get("Location"), this.channelUrl.origin);
            return resourceUrl.toString();
        } else return headers.get("Location");
    }
    async requestOffer() {
        if (this.whepType === $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Server) {
            this.log(`Requesting offer from: ${this.channelUrl}`);
            const headers = {
                "Content-Type": "application/sdp"
            };
            this.authKey && (headers["Authorization"] = this.authKey);
            const response = await fetch(this.channelUrl.toString(), {
                method: "POST",
                headers: headers,
                body: ""
            });
            if (response.ok) {
                this.resource = this.getResouceUrlFromHeaders(response.headers);
                this.log("WHEP Resource", this.resource);
                const offer = await response.text();
                this.log("Received offer", offer);
                return offer;
            } else {
                const serverMessage = await response.text();
                throw new Error(serverMessage);
            }
        }
    }
    async sendAnswer() {
        if (!this.localPeer) {
            this.log("Local RTC peer not initialized");
            return;
        }
        if (this.whepType === $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Server && this.resource) {
            const answer = this.localPeer.localDescription;
            if (answer) {
                const headers = {
                    "Content-Type": "application/sdp"
                };
                this.authKey && (headers["Authorization"] = this.authKey);
                const response = await fetch(this.resource, {
                    method: "PATCH",
                    headers: headers,
                    body: answer.sdp
                });
                if (!response.ok) this.error(`sendAnswer response: ${response.status}`);
            }
        }
    }
    async sendOffer() {
        if (!this.localPeer) {
            this.log("Local RTC peer not initialized");
            return;
        }
        const offer = this.localPeer.localDescription;
        if (this.whepType === $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Client && offer) {
            this.log(`Sending offer to ${this.channelUrl}`);
            const headers = {
                "Content-Type": "application/sdp"
            };
            this.authKey && (headers["Authorization"] = this.authKey);
            const response = await fetch(this.channelUrl.toString(), {
                method: "POST",
                headers: headers,
                body: offer.sdp
            });
            if (response.ok) {
                this.resource = this.getResouceUrlFromHeaders(response.headers);
                this.log("WHEP Resource", this.resource);
                const answer = await response.text();
                await this.localPeer.setRemoteDescription({
                    type: "answer",
                    sdp: answer
                });
            } else if (response.status === 400) {
                this.log(`server does not support client-offer, need to reconnect`);
                this.whepType = $4c7e7e20a6e4dde3$export$2351e2e8d1fcfd84.Server;
                this.onErrorHandler("reconnectneeded");
            } else if (response.status === 406 && this.audio && !this.mediaConstraints.audioOnly && !this.mediaConstraints.videoOnly) {
                this.log(`maybe server does not support audio. Let's retry without audio`);
                this.audio = false;
                this.video = true;
                this.onErrorHandler("reconnectneeded");
            } else if (response.status === 406 && this.video && !this.mediaConstraints.audioOnly && !this.mediaConstraints.videoOnly) {
                this.log(`maybe server does not support video. Let's retry without video`);
                this.audio = true;
                this.video = false;
                this.onErrorHandler("reconnectneeded");
            } else {
                this.error(`sendAnswer response: ${response.status}`);
                this.onErrorHandler("connectionfailed");
            }
        }
    }
    log(...args) {
        if (this.debug) console.log("WebRTC-player", ...args);
    }
    error(...args) {
        console.error("WebRTC-player", ...args);
    }
}


const $4366558ee7129abf$var$WHPPAdapterFactory = (peer, channelUrl, onError, mediaConstraints, authKey)=>{
    return new (0, $d580fda374b2d4e1$export$1bee3ffe1758e87d)(peer, channelUrl, onError);
};
const $4366558ee7129abf$var$EyevinnAdapterFactory = (peer, channelUrl, onError, mediaConstraints, authKey)=>{
    return new (0, $9c9759905f118312$export$5463baa67f138efa)(peer, channelUrl, onError);
};
const $4366558ee7129abf$var$WHEPAdapterFactory = (peer, channelUrl, onError, mediaConstraints, authKey)=>{
    return new (0, $4c7e7e20a6e4dde3$export$e35e1b35ea68c1)(peer, channelUrl, onError, mediaConstraints, authKey);
};
const $4366558ee7129abf$var$adapters = {
    "se.eyevinn.whpp": $4366558ee7129abf$var$WHPPAdapterFactory,
    "se.eyevinn.webrtc": $4366558ee7129abf$var$EyevinnAdapterFactory,
    whep: $4366558ee7129abf$var$WHEPAdapterFactory
};
function $4366558ee7129abf$export$4f24674036ad9ae3(type, peer, channelUrl, onError, mediaConstraints, authKey) {
    return $4366558ee7129abf$var$adapters[type](peer, channelUrl, onError, mediaConstraints, authKey);
}
function $4366558ee7129abf$export$62ed887aeb7fab64() {
    return Object.keys($4366558ee7129abf$var$adapters);
}





let $8c8737df5845fd96$var$Message;
(function(Message) {
    Message["NO_MEDIA"] = "no-media";
    Message["MEDIA_RECOVERED"] = "media-recovered";
    Message["PEER_CONNECTION_FAILED"] = "peer-connection-failed";
    Message["PEER_CONNECTION_CONNECTED"] = "peer-connection-connected";
    Message["INITIAL_CONNECTION_FAILED"] = "initial-connection-failed";
    Message["CONNECT_ERROR"] = "connect-error";
})($8c8737df5845fd96$var$Message || ($8c8737df5845fd96$var$Message = {}));
const $8c8737df5845fd96$var$MediaConstraintsDefaults = {
    audioOnly: false,
    videoOnly: false
};
const $8c8737df5845fd96$var$RECONNECT_ATTEMPTS = 2;
class $8c8737df5845fd96$export$f6039712bf1ca949 extends (0, $a1w4g$events.EventEmitter) {
    peer = {};
    adapterFactory = undefined;
    channelUrl = {};
    authKey = undefined;
    reconnectAttemptsLeft = $8c8737df5845fd96$var$RECONNECT_ATTEMPTS;
    adapter = {};
    statsTypeFilter = undefined;
    msStatsInterval = 5000;
    mediaTimeoutOccured = false;
    mediaTimeoutThreshold = 30000;
    timeoutThresholdCounter = 0;
    bytesReceived = 0;
    constructor(opts){
        super();
        this.mediaConstraints = {
            ...$8c8737df5845fd96$var$MediaConstraintsDefaults,
            ...opts.mediaConstraints
        };
        this.videoElement = opts.video;
        this.adapterType = opts.type;
        this.adapterFactory = opts.adapterFactory;
        this.statsTypeFilter = opts.statsTypeFilter;
        this.mediaTimeoutThreshold = opts.timeoutThreshold ?? this.mediaTimeoutThreshold;
        this.iceServers = [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ];
        if (opts.iceServers) this.iceServers = opts.iceServers;
        this.debug = !!opts.debug;
        if (opts.vmapUrl) {
            this.csaiManager = new (0, $a1w4g$eyevinncsaimanager.CSAIManager)({
                contentVideoElement: this.videoElement,
                vmapUrl: opts.vmapUrl,
                isLive: true,
                autoplay: true
            });
            this.videoElement.addEventListener("ended", ()=>{
                if (this.csaiManager) this.csaiManager.destroy();
            });
        }
    }
    async load(channelUrl, authKey) {
        this.channelUrl = channelUrl;
        this.authKey = authKey;
        this.connect();
    }
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    log(...args) {
        if (this.debug) console.log("WebRTC-player", ...args);
    }
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    error(...args) {
        console.error("WebRTC-player", ...args);
    }
    async onConnectionStateChange() {
        if (this.peer.connectionState === "failed") {
            this.emit($8c8737df5845fd96$var$Message.PEER_CONNECTION_FAILED);
            this.peer && this.peer.close();
            if (this.reconnectAttemptsLeft <= 0) {
                this.error("Connection failed, reconnecting failed");
                return;
            }
            this.log(`Connection failed, recreating peer connection, attempts left ${this.reconnectAttemptsLeft}`);
            await this.connect();
            this.reconnectAttemptsLeft--;
        } else if (this.peer.connectionState === "connected") {
            this.log("Connected");
            this.emit($8c8737df5845fd96$var$Message.PEER_CONNECTION_CONNECTED);
            this.reconnectAttemptsLeft = $8c8737df5845fd96$var$RECONNECT_ATTEMPTS;
        }
    }
    onErrorHandler(error) {
        this.log(`onError=${error}`);
        switch(error){
            case "reconnectneeded":
                this.peer && this.peer.close();
                this.videoElement.srcObject = null;
                this.setupPeer();
                this.adapter.resetPeer(this.peer);
                this.adapter.connect();
                break;
            case "connectionfailed":
                this.peer && this.peer.close();
                this.videoElement.srcObject = null;
                this.emit($8c8737df5845fd96$var$Message.INITIAL_CONNECTION_FAILED);
                break;
            case "connecterror":
                this.peer && this.peer.close();
                this.adapter.resetPeer(this.peer);
                this.emit($8c8737df5845fd96$var$Message.CONNECT_ERROR);
                break;
        }
    }
    async onConnectionStats() {
        if (this.peer && this.statsTypeFilter) {
            let bytesReceivedBlock = 0;
            const stats = await this.peer.getStats(null);
            stats.forEach((report)=>{
                if (report.type.match(this.statsTypeFilter)) this.emit(`stats:${report.type}`, report);
                //inbound-rtp attribute bytesReceived from stats report will contain the total number of bytes received for this SSRC.
                //In this case there are several SSRCs. They are all added together in each onConnectionStats iteration and compared to their value during the previous iteration.
                if (report.type.match("inbound-rtp")) bytesReceivedBlock += report.bytesReceived;
            });
            if (bytesReceivedBlock <= this.bytesReceived) {
                this.timeoutThresholdCounter += this.msStatsInterval;
                if (this.mediaTimeoutOccured === false && this.timeoutThresholdCounter >= this.mediaTimeoutThreshold) {
                    this.emit($8c8737df5845fd96$var$Message.NO_MEDIA);
                    this.mediaTimeoutOccured = true;
                }
            } else {
                this.bytesReceived = bytesReceivedBlock;
                this.timeoutThresholdCounter = 0;
                if (this.mediaTimeoutOccured == true) {
                    this.emit($8c8737df5845fd96$var$Message.MEDIA_RECOVERED);
                    this.mediaTimeoutOccured = false;
                }
            }
        }
    }
    setupPeer() {
        this.peer = new RTCPeerConnection({
            iceServers: this.iceServers
        });
        this.peer.onconnectionstatechange = this.onConnectionStateChange.bind(this);
        this.peer.ontrack = this.onTrack.bind(this);
    }
    onTrack(event) {
        for (const stream of event.streams){
            if (stream.id === "feedbackvideomslabel") continue;
            console.log("Set video element remote stream to " + stream.id, " audio " + stream.getAudioTracks().length + " video " + stream.getVideoTracks().length);
            // Create a new MediaStream if we don't have one
            if (!this.videoElement.srcObject) this.videoElement.srcObject = new MediaStream();
            // We might have one stream of both audio and video, or separate streams for audio and video
            for (const track of stream.getTracks())this.videoElement.srcObject.addTrack(track);
        }
    }
    async connect() {
        this.setupPeer();
        if (this.adapterType !== "custom") this.adapter = (0, $4366558ee7129abf$export$4f24674036ad9ae3)(this.adapterType, this.peer, this.channelUrl, this.onErrorHandler.bind(this), this.mediaConstraints, this.authKey);
        else if (this.adapterFactory) this.adapter = this.adapterFactory(this.peer, this.channelUrl, this.onErrorHandler.bind(this), this.mediaConstraints, this.authKey);
        if (!this.adapter) throw new Error(`Failed to create adapter (${this.adapterType})`);
        if (this.debug) this.adapter.enableDebug();
        this.statsInterval = setInterval(this.onConnectionStats.bind(this), this.msStatsInterval);
        try {
            await this.adapter.connect();
        } catch (error) {
            console.error(error);
            this.stop();
        }
    }
    mute() {
        this.videoElement.muted = true;
    }
    unmute() {
        this.videoElement.muted = false;
    }
    async unload() {
        await this.adapter.disconnect();
        this.stop();
    }
    stop() {
        clearInterval(this.statsInterval);
        this.peer.close();
        this.videoElement.srcObject = null;
        this.videoElement.load();
    }
    destroy() {
        this.stop();
        this.removeAllListeners();
    }
}


//# sourceMappingURL=main.js.map
