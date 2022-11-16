// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as url from "url";
export function parseKeyvaultIdentifier(collection, identifier) {
    if (typeof collection !== "string" || !(collection = collection.trim())) {
        throw new Error("Invalid collection argument");
    }
    if (typeof identifier !== "string" || !(identifier = identifier.trim())) {
        throw new Error("Invalid identifier argument");
    }
    let baseUri;
    try {
        baseUri = url.parse(identifier, true, true);
    }
    catch (e) {
        throw new Error(`Invalid ${collection} identifier: ${identifier}. Not a valid URI`);
    }
    // Path is of the form '/collection/name[/version]'
    const segments = (baseUri.pathname || "").split("/");
    if (segments.length !== 3 && segments.length !== 4) {
        throw new Error(`Invalid ${collection} identifier: ${identifier}. Bad number of segments: ${segments.length}`);
    }
    if (collection !== segments[1]) {
        throw new Error(`Invalid ${collection} identifier: ${identifier}. segment [1] should be "${collection}", found "${segments[1]}"`);
    }
    const vaultUrl = `${baseUri.protocol}//${baseUri.host}`;
    const name = segments[2];
    const version = segments.length === 4 ? segments[3] : undefined;
    return {
        vaultUrl,
        name,
        version,
    };
}
//# sourceMappingURL=parseKeyvaultIdentifier.js.map