// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getHeaderName, setPlatformSpecificData } from "./userAgentPlatform";
import { SDK_VERSION } from "../constants";
function getUserAgentString(telemetryInfo) {
    const parts = [];
    for (const [key, value] of telemetryInfo) {
        const token = value ? `${key}/${value}` : key;
        parts.push(token);
    }
    return parts.join(" ");
}
/**
 * @internal
 */
export function getUserAgentHeaderName() {
    return getHeaderName();
}
/**
 * @internal
 */
export function getUserAgentValue(prefix) {
    const runtimeInfo = new Map();
    runtimeInfo.set("core-rest-pipeline", SDK_VERSION);
    setPlatformSpecificData(runtimeInfo);
    const defaultAgent = getUserAgentString(runtimeInfo);
    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
    return userAgentValue;
}
//# sourceMappingURL=userAgent.js.map