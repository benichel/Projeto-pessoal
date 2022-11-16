/** @license ms-rest-js
  * Copyright (c) Microsoft Corporation. All rights reserved.
  * Licensed under the MIT License. See License.txt and ThirdPartyNotices.txt in the project root for license information.
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.msRest = {}));
}(this, (function (exports) { 'use strict';

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    /**
     * A collection of HttpHeaders that can be sent with a HTTP request.
     */
    function getHeaderKey(headerName) {
        return headerName.toLowerCase();
    }
    function isHttpHeadersLike(object) {
        if (!object || typeof object !== "object") {
            return false;
        }
        if (typeof object.rawHeaders === "function" &&
            typeof object.clone === "function" &&
            typeof object.get === "function" &&
            typeof object.set === "function" &&
            typeof object.contains === "function" &&
            typeof object.remove === "function" &&
            typeof object.headersArray === "function" &&
            typeof object.headerValues === "function" &&
            typeof object.headerNames === "function" &&
            typeof object.toJson === "function") {
            return true;
        }
        return false;
    }
    /**
     * A collection of HTTP header key/value pairs.
     */
    var HttpHeaders = /** @class */ (function () {
        function HttpHeaders(rawHeaders) {
            this._headersMap = {};
            if (rawHeaders) {
                for (var headerName in rawHeaders) {
                    this.set(headerName, rawHeaders[headerName]);
                }
            }
        }
        /**
         * Set a header in this collection with the provided name and value. The name is
         * case-insensitive.
         * @param headerName The name of the header to set. This value is case-insensitive.
         * @param headerValue The value of the header to set.
         */
        HttpHeaders.prototype.set = function (headerName, headerValue) {
            this._headersMap[getHeaderKey(headerName)] = {
                name: headerName,
                value: headerValue.toString(),
            };
        };
        /**
         * Get the header value for the provided header name, or undefined if no header exists in this
         * collection with the provided name.
         * @param headerName The name of the header.
         */
        HttpHeaders.prototype.get = function (headerName) {
            var header = this._headersMap[getHeaderKey(headerName)];
            return !header ? undefined : header.value;
        };
        /**
         * Get whether or not this header collection contains a header entry for the provided header name.
         */
        HttpHeaders.prototype.contains = function (headerName) {
            return !!this._headersMap[getHeaderKey(headerName)];
        };
        /**
         * Remove the header with the provided headerName. Return whether or not the header existed and
         * was removed.
         * @param headerName The name of the header to remove.
         */
        HttpHeaders.prototype.remove = function (headerName) {
            var result = this.contains(headerName);
            delete this._headersMap[getHeaderKey(headerName)];
            return result;
        };
        /**
         * Get the headers that are contained this collection as an object.
         */
        HttpHeaders.prototype.rawHeaders = function () {
            var result = {};
            for (var headerKey in this._headersMap) {
                var header = this._headersMap[headerKey];
                result[header.name.toLowerCase()] = header.value;
            }
            return result;
        };
        /**
         * Get the headers that are contained in this collection as an array.
         */
        HttpHeaders.prototype.headersArray = function () {
            var headers = [];
            for (var headerKey in this._headersMap) {
                headers.push(this._headersMap[headerKey]);
            }
            return headers;
        };
        /**
         * Get the header names that are contained in this collection.
         */
        HttpHeaders.prototype.headerNames = function () {
            var headerNames = [];
            var headers = this.headersArray();
            for (var i = 0; i < headers.length; ++i) {
                headerNames.push(headers[i].name);
            }
            return headerNames;
        };
        /**
         * Get the header names that are contained in this collection.
         */
        HttpHeaders.prototype.headerValues = function () {
            var headerValues = [];
            var headers = this.headersArray();
            for (var i = 0; i < headers.length; ++i) {
                headerValues.push(headers[i].value);
            }
            return headerValues;
        };
        /**
         * Get the JSON object representation of this HTTP header collection.
         */
        HttpHeaders.prototype.toJson = function () {
            return this.rawHeaders();
        };
        /**
         * Get the string representation of this HTTP header collection.
         */
        HttpHeaders.prototype.toString = function () {
            return JSON.stringify(this.toJson());
        };
        /**
         * Create a deep clone/copy of this HttpHeaders collection.
         */
        HttpHeaders.prototype.clone = function () {
            return new HttpHeaders(this.rawHeaders());
        };
        return HttpHeaders;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    /**
     * Encodes a string in base64 format.
     * @param value the string to encode
     */
    function encodeString(value) {
        return btoa(value);
    }
    /**
     * Encodes a byte array in base64 format.
     * @param value the Uint8Aray to encode
     */
    function encodeByteArray(value) {
        var str = "";
        for (var i = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i]);
        }
        return btoa(str);
    }
    /**
     * Decodes a base64 string into a byte array.
     * @param value the base64 string to decode
     */
    function decodeString(value) {
        var byteString = atob(value);
        var arr = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            arr[i] = byteString.charCodeAt(i);
        }
        return arr;
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    var Constants = {
        /**
         * The ms-rest version
         * @const
         * @type {string}
         */
        msRestVersion: "2.6.2",
        /**
         * Specifies HTTP.
         *
         * @const
         * @type {string}
         */
        HTTP: "http:",
        /**
         * Specifies HTTPS.
         *
         * @const
         * @type {string}
         */
        HTTPS: "https:",
        /**
         * Specifies HTTP Proxy.
         *
         * @const
         * @type {string}
         */
        HTTP_PROXY: "HTTP_PROXY",
        /**
         * Specifies HTTPS Proxy.
         *
         * @const
         * @type {string}
         */
        HTTPS_PROXY: "HTTPS_PROXY",
        /**
         * Specifies NO Proxy.
         */
        NO_PROXY: "NO_PROXY",
        /**
         * Specifies ALL Proxy.
         */
        ALL_PROXY: "ALL_PROXY",
        HttpConstants: {
            /**
             * Http Verbs
             *
             * @const
             * @enum {string}
             */
            HttpVerbs: {
                PUT: "PUT",
                GET: "GET",
                DELETE: "DELETE",
                POST: "POST",
                MERGE: "MERGE",
                HEAD: "HEAD",
                PATCH: "PATCH",
            },
            StatusCodes: {
                TooManyRequests: 429,
            },
        },
        /**
         * Defines constants for use with HTTP headers.
         */
        HeaderConstants: {
            /**
             * The Authorization header.
             *
             * @const
             * @type {string}
             */
            AUTHORIZATION: "authorization",
            AUTHORIZATION_SCHEME: "Bearer",
            /**
             * The Retry-After response-header field can be used with a 503 (Service
             * Unavailable) or 349 (Too Many Requests) responses to indicate how long
             * the service is expected to be unavailable to the requesting client.
             *
             * @const
             * @type {string}
             */
            RETRY_AFTER: "Retry-After",
            /**
             * The UserAgent header.
             *
             * @const
             * @type {string}
             */
            USER_AGENT: "User-Agent",
        },
    };

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * A constant that indicates whether the environment is node.js or browser based.
     */
    var isNode = typeof process !== "undefined" &&
        !!process.version &&
        !!process.versions &&
        !!process.versions.node;
    /**
     * Encodes an URI.
     *
     * @param {string} uri The URI to be encoded.
     * @return {string} The encoded URI.
     */
    function encodeUri(uri) {
        return encodeURIComponent(uri)
            .replace(/!/g, "%21")
            .replace(/"/g, "%27")
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\*/g, "%2A");
    }
    /**
     * Returns a stripped version of the Http Response which only contains body,
     * headers and the status.
     *
     * @param {HttpOperationResponse} response The Http Response
     *
     * @return {object} The stripped version of Http Response.
     */
    function stripResponse(response) {
        var strippedResponse = {};
        strippedResponse.body = response.bodyAsText;
        strippedResponse.headers = response.headers;
        strippedResponse.status = response.status;
        return strippedResponse;
    }
    /**
     * Returns a stripped version of the Http Request that does not contain the
     * Authorization header.
     *
     * @param {WebResource} request The Http Request object
     *
     * @return {WebResource} The stripped version of Http Request.
     */
    function stripRequest(request) {
        var strippedRequest = request.clone();
        if (strippedRequest.headers) {
            strippedRequest.headers.remove("authorization");
        }
        return strippedRequest;
    }
    /**
     * Validates the given uuid as a string
     *
     * @param {string} uuid The uuid as a string that needs to be validated
     *
     * @return {boolean} True if the uuid is valid; false otherwise.
     */
    function isValidUuid(uuid) {
        var validUuidRegex = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$", "ig");
        return validUuidRegex.test(uuid);
    }
    /**
     * Generated UUID
     *
     * @return {string} RFC4122 v4 UUID.
     */
    function generateUuid() {
        return v4();
    }
    /**
     * Executes an array of promises sequentially. Inspiration of this method is here:
     * https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html. An awesome blog on promises!
     *
     * @param {Array} promiseFactories An array of promise factories(A function that return a promise)
     *
     * @param {any} [kickstart] Input to the first promise that is used to kickstart the promise chain.
     * If not provided then the promise chain starts with undefined.
     *
     * @return A chain of resolved or rejected promises
     */
    function executePromisesSequentially(promiseFactories, kickstart) {
        var result = Promise.resolve(kickstart);
        promiseFactories.forEach(function (promiseFactory) {
            result = result.then(promiseFactory);
        });
        return result;
    }
    /**
     * A wrapper for setTimeout that resolves a promise after t milliseconds.
     * @param {number} t The number of milliseconds to be delayed.
     * @param {T} value The value to be resolved with after a timeout of t milliseconds.
     * @returns {Promise<T>} Resolved promise
     */
    function delay(t, value) {
        return new Promise(function (resolve) { return setTimeout(function () { return resolve(value); }, t); });
    }
    /**
     * Converts a Promise to a callback.
     * @param {Promise<any>} promise The Promise to be converted to a callback
     * @returns {Function} A function that takes the callback (cb: Function): void
     * @deprecated generated code should instead depend on responseToBody
     */
    function promiseToCallback(promise) {
        if (typeof promise.then !== "function") {
            throw new Error("The provided input is not a Promise.");
        }
        return function (cb) {
            promise.then(function (data) {
                cb(undefined, data);
            }, function (err) {
                cb(err);
            });
        };
    }
    /**
     * Converts a Promise to a service callback.
     * @param {Promise<HttpOperationResponse>} promise - The Promise of HttpOperationResponse to be converted to a service callback
     * @returns {Function} A function that takes the service callback (cb: ServiceCallback<T>): void
     */
    function promiseToServiceCallback(promise) {
        if (typeof promise.then !== "function") {
            throw new Error("The provided input is not a Promise.");
        }
        return function (cb) {
            promise.then(function (data) {
                process.nextTick(cb, undefined, data.parsedBody, data.request, data);
            }, function (err) {
                process.nextTick(cb, err);
            });
        };
    }
    function prepareXMLRootList(obj, elementName) {
        var _a;
        if (!Array.isArray(obj)) {
            obj = [obj];
        }
        return _a = {}, _a[elementName] = obj, _a;
    }
    /**
     * Applies the properties on the prototype of sourceCtors to the prototype of targetCtor
     * @param {object} targetCtor The target object on which the properties need to be applied.
     * @param {Array<object>} sourceCtors An array of source objects from which the properties need to be taken.
     */
    function applyMixins(targetCtor, sourceCtors) {
        sourceCtors.forEach(function (sourceCtors) {
            Object.getOwnPropertyNames(sourceCtors.prototype).forEach(function (name) {
                targetCtor.prototype[name] = sourceCtors.prototype[name];
            });
        });
    }
    var validateISODuration = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    /**
     * Indicates whether the given string is in ISO 8601 format.
     * @param {string} value The value to be validated for ISO 8601 duration format.
     * @return {boolean} `true` if valid, `false` otherwise.
     */
    function isDuration(value) {
        return validateISODuration.test(value);
    }
    /**
     * Replace all of the instances of searchValue in value with the provided replaceValue.
     * @param {string | undefined} value The value to search and replace in.
     * @param {string} searchValue The value to search for in the value argument.
     * @param {string} replaceValue The value to replace searchValue with in the value argument.
     * @returns {string | undefined} The value where each instance of searchValue was replaced with replacedValue.
     */
    function replaceAll(value, searchValue, replaceValue) {
        return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
    }
    /**
     * Determines whether the given enity is a basic/primitive type
     * (string, number, boolean, null, undefined).
     * @param value Any entity
     * @return boolean - true is it is primitive type, false otherwise.
     */
    function isPrimitiveType(value) {
        return (typeof value !== "object" && typeof value !== "function") || value === null;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var Serializer = /** @class */ (function () {
        function Serializer(modelMappers, isXML) {
            if (modelMappers === void 0) { modelMappers = {}; }
            this.modelMappers = modelMappers;
            this.isXML = isXML;
        }
        Serializer.prototype.validateConstraints = function (mapper, value, objectName) {
            var failValidation = function (constraintName, constraintValue) {
                throw new Error("\"" + objectName + "\" with value \"" + value + "\" should satisfy the constraint \"" + constraintName + "\": " + constraintValue + ".");
            };
            if (mapper.constraints && value != undefined) {
                var _a = mapper.constraints, ExclusiveMaximum = _a.ExclusiveMaximum, ExclusiveMinimum = _a.ExclusiveMinimum, InclusiveMaximum = _a.InclusiveMaximum, InclusiveMinimum = _a.InclusiveMinimum, MaxItems = _a.MaxItems, MaxLength = _a.MaxLength, MinItems = _a.MinItems, MinLength = _a.MinLength, MultipleOf = _a.MultipleOf, Pattern = _a.Pattern, UniqueItems = _a.UniqueItems;
                if (ExclusiveMaximum != undefined && value >= ExclusiveMaximum) {
                    failValidation("ExclusiveMaximum", ExclusiveMaximum);
                }
                if (ExclusiveMinimum != undefined && value <= ExclusiveMinimum) {
                    failValidation("ExclusiveMinimum", ExclusiveMinimum);
                }
                if (InclusiveMaximum != undefined && value > InclusiveMaximum) {
                    failValidation("InclusiveMaximum", InclusiveMaximum);
                }
                if (InclusiveMinimum != undefined && value < InclusiveMinimum) {
                    failValidation("InclusiveMinimum", InclusiveMinimum);
                }
                if (MaxItems != undefined && value.length > MaxItems) {
                    failValidation("MaxItems", MaxItems);
                }
                if (MaxLength != undefined && value.length > MaxLength) {
                    failValidation("MaxLength", MaxLength);
                }
                if (MinItems != undefined && value.length < MinItems) {
                    failValidation("MinItems", MinItems);
                }
                if (MinLength != undefined && value.length < MinLength) {
                    failValidation("MinLength", MinLength);
                }
                if (MultipleOf != undefined && value % MultipleOf !== 0) {
                    failValidation("MultipleOf", MultipleOf);
                }
                if (Pattern) {
                    var pattern = typeof Pattern === "string" ? new RegExp(Pattern) : Pattern;
                    if (typeof value !== "string" || value.match(pattern) === null) {
                        failValidation("Pattern", Pattern);
                    }
                }
                if (UniqueItems &&
                    value.some(function (item, i, ar) { return ar.indexOf(item) !== i; })) {
                    failValidation("UniqueItems", UniqueItems);
                }
            }
        };
        /**
         * Serialize the given object based on its metadata defined in the mapper
         *
         * @param {Mapper} mapper The mapper which defines the metadata of the serializable object
         *
         * @param {object|string|Array|number|boolean|Date|stream} object A valid Javascript object to be serialized
         *
         * @param {string} objectName Name of the serialized object
         *
         * @returns {object|string|Array|number|boolean|Date|stream} A valid serialized Javascript object
         */
        Serializer.prototype.serialize = function (mapper, object, objectName) {
            var payload = {};
            var mapperType = mapper.type.name;
            if (!objectName) {
                objectName = mapper.serializedName;
            }
            if (mapperType.match(/^Sequence$/gi) !== null) {
                payload = [];
            }
            if (mapper.isConstant) {
                object = mapper.defaultValue;
            }
            // This table of allowed values should help explain
            // the mapper.required and mapper.nullable properties.
            // X means "neither undefined or null are allowed".
            //           || required
            //           || true      | false
            //  nullable || ==========================
            //      true || null      | undefined/null
            //     false || X         | undefined
            // undefined || X         | undefined/null
            var required = mapper.required, nullable = mapper.nullable;
            if (required && nullable && object === undefined) {
                throw new Error(objectName + " cannot be undefined.");
            }
            if (required && !nullable && object == undefined) {
                throw new Error(objectName + " cannot be null or undefined.");
            }
            if (!required && nullable === false && object === null) {
                throw new Error(objectName + " cannot be null.");
            }
            if (object == undefined) {
                payload = object;
            }
            else {
                // Validate Constraints if any
                this.validateConstraints(mapper, object, objectName);
                if (mapperType.match(/^any$/gi) !== null) {
                    payload = object;
                }
                else if (mapperType.match(/^(Number|String|Boolean|Object|Stream|Uuid)$/gi) !== null) {
                    payload = serializeBasicTypes(mapperType, objectName, object);
                }
                else if (mapperType.match(/^Enum$/gi) !== null) {
                    var enumMapper = mapper;
                    payload = serializeEnumType(objectName, enumMapper.type.allowedValues, object);
                }
                else if (mapperType.match(/^(Date|DateTime|TimeSpan|DateTimeRfc1123|UnixTime)$/gi) !== null) {
                    payload = serializeDateTypes(mapperType, object, objectName);
                }
                else if (mapperType.match(/^ByteArray$/gi) !== null) {
                    payload = serializeByteArrayType(objectName, object);
                }
                else if (mapperType.match(/^Base64Url$/gi) !== null) {
                    payload = serializeBase64UrlType(objectName, object);
                }
                else if (mapperType.match(/^Sequence$/gi) !== null) {
                    payload = serializeSequenceType(this, mapper, object, objectName);
                }
                else if (mapperType.match(/^Dictionary$/gi) !== null) {
                    payload = serializeDictionaryType(this, mapper, object, objectName);
                }
                else if (mapperType.match(/^Composite$/gi) !== null) {
                    payload = serializeCompositeType(this, mapper, object, objectName);
                }
            }
            return payload;
        };
        /**
         * Deserialize the given object based on its metadata defined in the mapper
         *
         * @param {object} mapper The mapper which defines the metadata of the serializable object
         *
         * @param {object|string|Array|number|boolean|Date|stream} responseBody A valid Javascript entity to be deserialized
         *
         * @param {string} objectName Name of the deserialized object
         *
         * @returns {object|string|Array|number|boolean|Date|stream} A valid deserialized Javascript object
         */
        Serializer.prototype.deserialize = function (mapper, responseBody, objectName) {
            if (responseBody == undefined) {
                if (this.isXML && mapper.type.name === "Sequence" && !mapper.xmlIsWrapped) {
                    // Edge case for empty XML non-wrapped lists. xml2js can't distinguish
                    // between the list being empty versus being missing,
                    // so let's do the more user-friendly thing and return an empty list.
                    responseBody = [];
                }
                // specifically check for undefined as default value can be a falsey value `0, "", false, null`
                if (mapper.defaultValue !== undefined) {
                    responseBody = mapper.defaultValue;
                }
                return responseBody;
            }
            var payload;
            var mapperType = mapper.type.name;
            if (!objectName) {
                objectName = mapper.serializedName;
            }
            if (mapperType.match(/^Composite$/gi) !== null) {
                payload = deserializeCompositeType(this, mapper, responseBody, objectName);
            }
            else {
                if (this.isXML) {
                    /**
                     * If the mapper specifies this as a non-composite type value but the responseBody contains
                     * both header ("$") and body ("_") properties, then just reduce the responseBody value to
                     * the body ("_") property.
                     */
                    if (responseBody["$"] != undefined && responseBody["_"] != undefined) {
                        responseBody = responseBody["_"];
                    }
                }
                if (mapperType.match(/^Number$/gi) !== null) {
                    payload = parseFloat(responseBody);
                    if (isNaN(payload)) {
                        payload = responseBody;
                    }
                }
                else if (mapperType.match(/^Boolean$/gi) !== null) {
                    if (responseBody === "true") {
                        payload = true;
                    }
                    else if (responseBody === "false") {
                        payload = false;
                    }
                    else {
                        payload = responseBody;
                    }
                }
                else if (mapperType.match(/^(String|Enum|Object|Stream|Uuid|TimeSpan|any)$/gi) !== null) {
                    payload = responseBody;
                }
                else if (mapperType.match(/^(Date|DateTime|DateTimeRfc1123)$/gi) !== null) {
                    payload = new Date(responseBody);
                }
                else if (mapperType.match(/^UnixTime$/gi) !== null) {
                    payload = unixTimeToDate(responseBody);
                }
                else if (mapperType.match(/^ByteArray$/gi) !== null) {
                    payload = decodeString(responseBody);
                }
                else if (mapperType.match(/^Base64Url$/gi) !== null) {
                    payload = base64UrlToByteArray(responseBody);
                }
                else if (mapperType.match(/^Sequence$/gi) !== null) {
                    payload = deserializeSequenceType(this, mapper, responseBody, objectName);
                }
                else if (mapperType.match(/^Dictionary$/gi) !== null) {
                    payload = deserializeDictionaryType(this, mapper, responseBody, objectName);
                }
            }
            if (mapper.isConstant) {
                payload = mapper.defaultValue;
            }
            return payload;
        };
        return Serializer;
    }());
    function trimEnd(str, ch) {
        var len = str.length;
        while (len - 1 >= 0 && str[len - 1] === ch) {
            --len;
        }
        return str.substr(0, len);
    }
    function bufferToBase64Url(buffer) {
        if (!buffer) {
            return undefined;
        }
        if (!(buffer instanceof Uint8Array)) {
            throw new Error("Please provide an input of type Uint8Array for converting to Base64Url.");
        }
        // Uint8Array to Base64.
        var str = encodeByteArray(buffer);
        // Base64 to Base64Url.
        return trimEnd(str, "=").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function base64UrlToByteArray(str) {
        if (!str) {
            return undefined;
        }
        if (str && typeof str.valueOf() !== "string") {
            throw new Error("Please provide an input of type string for converting to Uint8Array");
        }
        // Base64Url to Base64.
        str = str.replace(/\-/g, "+").replace(/\_/g, "/");
        // Base64 to Uint8Array.
        return decodeString(str);
    }
    function splitSerializeName(prop) {
        var classes = [];
        var partialclass = "";
        if (prop) {
            var subwords = prop.split(".");
            for (var _i = 0, subwords_1 = subwords; _i < subwords_1.length; _i++) {
                var item = subwords_1[_i];
                if (item.charAt(item.length - 1) === "\\") {
                    partialclass += item.substr(0, item.length - 1) + ".";
                }
                else {
                    partialclass += item;
                    classes.push(partialclass);
                    partialclass = "";
                }
            }
        }
        return classes;
    }
    function dateToUnixTime(d) {
        if (!d) {
            return undefined;
        }
        if (typeof d.valueOf() === "string") {
            d = new Date(d);
        }
        return Math.floor(d.getTime() / 1000);
    }
    function unixTimeToDate(n) {
        if (!n) {
            return undefined;
        }
        return new Date(n * 1000);
    }
    function serializeBasicTypes(typeName, objectName, value) {
        if (value !== null && value !== undefined) {
            if (typeName.match(/^Number$/gi) !== null) {
                if (typeof value !== "number") {
                    throw new Error(objectName + " with value " + value + " must be of type number.");
                }
            }
            else if (typeName.match(/^String$/gi) !== null) {
                if (typeof value.valueOf() !== "string") {
                    throw new Error(objectName + " with value \"" + value + "\" must be of type string.");
                }
            }
            else if (typeName.match(/^Uuid$/gi) !== null) {
                if (!(typeof value.valueOf() === "string" && isValidUuid(value))) {
                    throw new Error(objectName + " with value \"" + value + "\" must be of type string and a valid uuid.");
                }
            }
            else if (typeName.match(/^Boolean$/gi) !== null) {
                if (typeof value !== "boolean") {
                    throw new Error(objectName + " with value " + value + " must be of type boolean.");
                }
            }
            else if (typeName.match(/^Stream$/gi) !== null) {
                var objectType = typeof value;
                if (objectType !== "string" &&
                    objectType !== "function" &&
                    !(value instanceof ArrayBuffer) &&
                    !ArrayBuffer.isView(value) &&
                    !(typeof Blob === "function" && value instanceof Blob)) {
                    throw new Error(objectName + " must be a string, Blob, ArrayBuffer, ArrayBufferView, or a function returning NodeJS.ReadableStream.");
                }
            }
        }
        return value;
    }
    function serializeEnumType(objectName, allowedValues, value) {
        if (!allowedValues) {
            throw new Error("Please provide a set of allowedValues to validate " + objectName + " as an Enum Type.");
        }
        var isPresent = allowedValues.some(function (item) {
            if (typeof item.valueOf() === "string") {
                return item.toLowerCase() === value.toLowerCase();
            }
            return item === value;
        });
        if (!isPresent) {
            throw new Error(value + " is not a valid value for " + objectName + ". The valid values are: " + JSON.stringify(allowedValues) + ".");
        }
        return value;
    }
    function serializeByteArrayType(objectName, value) {
        if (value != undefined) {
            if (!(value instanceof Uint8Array)) {
                throw new Error(objectName + " must be of type Uint8Array.");
            }
            value = encodeByteArray(value);
        }
        return value;
    }
    function serializeBase64UrlType(objectName, value) {
        if (value != undefined) {
            if (!(value instanceof Uint8Array)) {
                throw new Error(objectName + " must be of type Uint8Array.");
            }
            value = bufferToBase64Url(value);
        }
        return value;
    }
    function serializeDateTypes(typeName, value, objectName) {
        if (value != undefined) {
            if (typeName.match(/^Date$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in ISO8601 format.");
                }
                value =
                    value instanceof Date
                        ? value.toISOString().substring(0, 10)
                        : new Date(value).toISOString().substring(0, 10);
            }
            else if (typeName.match(/^DateTime$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in ISO8601 format.");
                }
                value = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
            }
            else if (typeName.match(/^DateTimeRfc1123$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in RFC-1123 format.");
                }
                value = value instanceof Date ? value.toUTCString() : new Date(value).toUTCString();
            }
            else if (typeName.match(/^UnixTime$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in RFC-1123/ISO8601 format " +
                        "for it to be serialized in UnixTime/Epoch format.");
                }
                value = dateToUnixTime(value);
            }
            else if (typeName.match(/^TimeSpan$/gi) !== null) {
                if (!isDuration(value)) {
                    throw new Error(objectName + " must be a string in ISO 8601 format. Instead was \"" + value + "\".");
                }
                value = value;
            }
        }
        return value;
    }
    function serializeSequenceType(serializer, mapper, object, objectName) {
        if (!Array.isArray(object)) {
            throw new Error(objectName + " must be of type Array.");
        }
        var elementType = mapper.type.element;
        if (!elementType || typeof elementType !== "object") {
            throw new Error("element\" metadata for an Array must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName + "."));
        }
        var tempArray = [];
        for (var i = 0; i < object.length; i++) {
            tempArray[i] = serializer.serialize(elementType, object[i], objectName);
        }
        return tempArray;
    }
    function serializeDictionaryType(serializer, mapper, object, objectName) {
        if (typeof object !== "object") {
            throw new Error(objectName + " must be of type object.");
        }
        var valueType = mapper.type.value;
        if (!valueType || typeof valueType !== "object") {
            throw new Error("\"value\" metadata for a Dictionary must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName + "."));
        }
        var tempDictionary = {};
        for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
            var key = _a[_i];
            tempDictionary[key] = serializer.serialize(valueType, object[key], objectName + "." + key);
        }
        return tempDictionary;
    }
    /**
     * Resolves a composite mapper's modelProperties.
     * @param serializer the serializer containing the entire set of mappers
     * @param mapper the composite mapper to resolve
     */
    function resolveModelProperties(serializer, mapper, objectName) {
        var modelProps = mapper.type.modelProperties;
        if (!modelProps) {
            var className = mapper.type.className;
            if (!className) {
                throw new Error("Class name for model \"" + objectName + "\" is not provided in the mapper \"" + JSON.stringify(mapper, undefined, 2) + "\".");
            }
            var modelMapper = serializer.modelMappers[className];
            if (!modelMapper) {
                throw new Error("mapper() cannot be null or undefined for model \"" + className + "\".");
            }
            modelProps = modelMapper.type.modelProperties;
            if (!modelProps) {
                throw new Error("modelProperties cannot be null or undefined in the " +
                    ("mapper \"" + JSON.stringify(modelMapper) + "\" of type \"" + className + "\" for object \"" + objectName + "\"."));
            }
        }
        return modelProps;
    }
    function serializeCompositeType(serializer, mapper, object, objectName) {
        var _a;
        if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
            mapper = getPolymorphicMapper(serializer, mapper, object, "clientName");
        }
        if (object != undefined) {
            var payload = {};
            var modelProps = resolveModelProperties(serializer, mapper, objectName);
            for (var _i = 0, _b = Object.keys(modelProps); _i < _b.length; _i++) {
                var key = _b[_i];
                var propertyMapper = modelProps[key];
                if (propertyMapper.readOnly) {
                    continue;
                }
                var propName = void 0;
                var parentObject = payload;
                if (serializer.isXML) {
                    if (propertyMapper.xmlIsWrapped) {
                        propName = propertyMapper.xmlName;
                    }
                    else {
                        propName = propertyMapper.xmlElementName || propertyMapper.xmlName;
                    }
                }
                else {
                    var paths = splitSerializeName(propertyMapper.serializedName);
                    propName = paths.pop();
                    for (var _c = 0, paths_1 = paths; _c < paths_1.length; _c++) {
                        var pathName = paths_1[_c];
                        var childObject = parentObject[pathName];
                        if (childObject == undefined && object[key] != undefined) {
                            parentObject[pathName] = {};
                        }
                        parentObject = parentObject[pathName];
                    }
                }
                if (parentObject != undefined) {
                    var propertyObjectName = propertyMapper.serializedName !== ""
                        ? objectName + "." + propertyMapper.serializedName
                        : objectName;
                    var toSerialize = object[key];
                    var polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
                    if (polymorphicDiscriminator &&
                        polymorphicDiscriminator.clientName === key &&
                        toSerialize == undefined) {
                        toSerialize = mapper.serializedName;
                    }
                    var serializedValue = serializer.serialize(propertyMapper, toSerialize, propertyObjectName);
                    if (serializedValue !== undefined && propName != undefined) {
                        if (propertyMapper.xmlIsAttribute) {
                            // $ is the key attributes are kept under in xml2js.
                            // This keeps things simple while preventing name collision
                            // with names in user documents.
                            parentObject.$ = parentObject.$ || {};
                            parentObject.$[propName] = serializedValue;
                        }
                        else if (propertyMapper.xmlIsWrapped) {
                            parentObject[propName] = (_a = {}, _a[propertyMapper.xmlElementName] = serializedValue, _a);
                        }
                        else {
                            parentObject[propName] = serializedValue;
                        }
                    }
                }
            }
            var additionalPropertiesMapper = mapper.type.additionalProperties;
            if (additionalPropertiesMapper) {
                var propNames = Object.keys(modelProps);
                var _loop_1 = function (clientPropName) {
                    var isAdditionalProperty = propNames.every(function (pn) { return pn !== clientPropName; });
                    if (isAdditionalProperty) {
                        payload[clientPropName] = serializer.serialize(additionalPropertiesMapper, object[clientPropName], objectName + '["' + clientPropName + '"]');
                    }
                };
                for (var clientPropName in object) {
                    _loop_1(clientPropName);
                }
            }
            return payload;
        }
        return object;
    }
    function isSpecialXmlProperty(propertyName) {
        return ["$", "_"].includes(propertyName);
    }
    function deserializeCompositeType(serializer, mapper, responseBody, objectName) {
        if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
            mapper = getPolymorphicMapper(serializer, mapper, responseBody, "serializedName");
        }
        var modelProps = resolveModelProperties(serializer, mapper, objectName);
        var instance = {};
        var handledPropertyNames = [];
        for (var _i = 0, _a = Object.keys(modelProps); _i < _a.length; _i++) {
            var key = _a[_i];
            var propertyMapper = modelProps[key];
            var paths = splitSerializeName(modelProps[key].serializedName);
            handledPropertyNames.push(paths[0]);
            var serializedName = propertyMapper.serializedName, xmlName = propertyMapper.xmlName, xmlElementName = propertyMapper.xmlElementName;
            var propertyObjectName = objectName;
            if (serializedName !== "" && serializedName !== undefined) {
                propertyObjectName = objectName + "." + serializedName;
            }
            var headerCollectionPrefix = propertyMapper.headerCollectionPrefix;
            if (headerCollectionPrefix) {
                var dictionary = {};
                for (var _b = 0, _c = Object.keys(responseBody); _b < _c.length; _b++) {
                    var headerKey = _c[_b];
                    if (headerKey.startsWith(headerCollectionPrefix)) {
                        dictionary[headerKey.substring(headerCollectionPrefix.length)] = serializer.deserialize(propertyMapper.type.value, responseBody[headerKey], propertyObjectName);
                    }
                    handledPropertyNames.push(headerKey);
                }
                instance[key] = dictionary;
            }
            else if (serializer.isXML) {
                if (propertyMapper.xmlIsAttribute && responseBody.$) {
                    instance[key] = serializer.deserialize(propertyMapper, responseBody.$[xmlName], propertyObjectName);
                }
                else {
                    var propertyName = xmlElementName || xmlName || serializedName;
                    var unwrappedProperty = responseBody[propertyName];
                    if (propertyMapper.xmlIsWrapped) {
                        unwrappedProperty = responseBody[xmlName];
                        unwrappedProperty = unwrappedProperty && unwrappedProperty[xmlElementName];
                        var isEmptyWrappedList = unwrappedProperty === undefined;
                        if (isEmptyWrappedList) {
                            unwrappedProperty = [];
                        }
                    }
                    instance[key] = serializer.deserialize(propertyMapper, unwrappedProperty, propertyObjectName);
                }
            }
            else {
                // deserialize the property if it is present in the provided responseBody instance
                var propertyInstance = void 0;
                var res = responseBody;
                // traversing the object step by step.
                for (var _d = 0, paths_2 = paths; _d < paths_2.length; _d++) {
                    var item = paths_2[_d];
                    if (!res)
                        break;
                    res = res[item];
                }
                propertyInstance = res;
                var polymorphicDiscriminator = mapper.type.polymorphicDiscriminator;
                // checking that the model property name (key)(ex: "fishtype") and the
                // clientName of the polymorphicDiscriminator {metadata} (ex: "fishtype")
                // instead of the serializedName of the polymorphicDiscriminator (ex: "fish.type")
                // is a better approach. The generator is not consistent with escaping '\.' in the
                // serializedName of the property (ex: "fish\.type") that is marked as polymorphic discriminator
                // and the serializedName of the metadata polymorphicDiscriminator (ex: "fish.type"). However,
                // the clientName transformation of the polymorphicDiscriminator (ex: "fishtype") and
                // the transformation of model property name (ex: "fishtype") is done consistently.
                // Hence, it is a safer bet to rely on the clientName of the polymorphicDiscriminator.
                if (polymorphicDiscriminator &&
                    key === polymorphicDiscriminator.clientName &&
                    propertyInstance == undefined) {
                    propertyInstance = mapper.serializedName;
                }
                var serializedValue = void 0;
                // paging
                if (Array.isArray(responseBody[key]) && modelProps[key].serializedName === "") {
                    propertyInstance = responseBody[key];
                    var arrayInstance = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName);
                    // Copy over any properties that have already been added into the instance, where they do
                    // not exist on the newly de-serialized array
                    for (var _e = 0, _f = Object.entries(instance); _e < _f.length; _e++) {
                        var _g = _f[_e], key_1 = _g[0], value = _g[1];
                        if (!arrayInstance.hasOwnProperty(key_1)) {
                            arrayInstance[key_1] = value;
                        }
                    }
                    instance = arrayInstance;
                }
                else if (propertyInstance !== undefined || propertyMapper.defaultValue !== undefined) {
                    serializedValue = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName);
                    instance[key] = serializedValue;
                }
            }
        }
        var additionalPropertiesMapper = mapper.type.additionalProperties;
        if (additionalPropertiesMapper) {
            var isAdditionalProperty = function (responsePropName) {
                for (var clientPropName in modelProps) {
                    var paths = splitSerializeName(modelProps[clientPropName].serializedName);
                    if (paths[0] === responsePropName) {
                        return false;
                    }
                }
                return true;
            };
            for (var responsePropName in responseBody) {
                if (isAdditionalProperty(responsePropName)) {
                    instance[responsePropName] = serializer.deserialize(additionalPropertiesMapper, responseBody[responsePropName], objectName + '["' + responsePropName + '"]');
                }
            }
        }
        else if (responseBody) {
            for (var _h = 0, _j = Object.keys(responseBody); _h < _j.length; _h++) {
                var key = _j[_h];
                if (instance[key] === undefined &&
                    !handledPropertyNames.includes(key) &&
                    !isSpecialXmlProperty(key)) {
                    instance[key] = responseBody[key];
                }
            }
        }
        return instance;
    }
    function deserializeDictionaryType(serializer, mapper, responseBody, objectName) {
        /*jshint validthis: true */
        var value = mapper.type.value;
        if (!value || typeof value !== "object") {
            throw new Error("\"value\" metadata for a Dictionary must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName));
        }
        if (responseBody) {
            var tempDictionary = {};
            for (var _i = 0, _a = Object.keys(responseBody); _i < _a.length; _i++) {
                var key = _a[_i];
                tempDictionary[key] = serializer.deserialize(value, responseBody[key], objectName);
            }
            return tempDictionary;
        }
        return responseBody;
    }
    function deserializeSequenceType(serializer, mapper, responseBody, objectName) {
        /*jshint validthis: true */
        var element = mapper.type.element;
        if (!element || typeof element !== "object") {
            throw new Error("element\" metadata for an Array must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName));
        }
        if (responseBody) {
            if (!Array.isArray(responseBody)) {
                // xml2js will interpret a single element array as just the element, so force it to be an array
                responseBody = [responseBody];
            }
            var tempArray = [];
            for (var i = 0; i < responseBody.length; i++) {
                tempArray[i] = serializer.deserialize(element, responseBody[i], objectName + "[" + i + "]");
            }
            return tempArray;
        }
        return responseBody;
    }
    function getPolymorphicMapper(serializer, mapper, object, polymorphicPropertyName) {
        var polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
        if (polymorphicDiscriminator) {
            var discriminatorName = polymorphicDiscriminator[polymorphicPropertyName];
            if (discriminatorName != undefined) {
                var discriminatorValue = object[discriminatorName];
                if (discriminatorValue != undefined) {
                    var typeName = mapper.type.uberParent || mapper.type.className;
                    var indexDiscriminator = discriminatorValue === typeName
                        ? discriminatorValue
                        : typeName + "." + discriminatorValue;
                    var polymorphicMapper = serializer.modelMappers.discriminators[indexDiscriminator];
                    if (polymorphicMapper) {
                        mapper = polymorphicMapper;
                    }
                }
            }
        }
        return mapper;
    }
    function getPolymorphicDiscriminatorRecursively(serializer, mapper) {
        return (mapper.type.polymorphicDiscriminator ||
            getPolymorphicDiscriminatorSafely(serializer, mapper.type.uberParent) ||
            getPolymorphicDiscriminatorSafely(serializer, mapper.type.className));
    }
    function getPolymorphicDiscriminatorSafely(serializer, typeName) {
        return (typeName &&
            serializer.modelMappers[typeName] &&
            serializer.modelMappers[typeName].type.polymorphicDiscriminator);
    }
    // TODO: why is this here?
    function serializeObject(toSerialize) {
        if (toSerialize == undefined)
            return undefined;
        if (toSerialize instanceof Uint8Array) {
            toSerialize = encodeByteArray(toSerialize);
            return toSerialize;
        }
        else if (toSerialize instanceof Date) {
            return toSerialize.toISOString();
        }
        else if (Array.isArray(toSerialize)) {
            var array = [];
            for (var i = 0; i < toSerialize.length; i++) {
                array.push(serializeObject(toSerialize[i]));
            }
            return array;
        }
        else if (typeof toSerialize === "object") {
            var dictionary = {};
            for (var property in toSerialize) {
                dictionary[property] = serializeObject(toSerialize[property]);
            }
            return dictionary;
        }
        return toSerialize;
    }
    /**
     * Utility function to create a K:V from a list of strings
     */
    function strEnum(o) {
        var result = {};
        for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
            var key = o_1[_i];
            result[key] = key;
        }
        return result;
    }
    var MapperType = strEnum([
        "Base64Url",
        "Boolean",
        "ByteArray",
        "Composite",
        "Date",
        "DateTime",
        "DateTimeRfc1123",
        "Dictionary",
        "Enum",
        "Number",
        "Object",
        "Sequence",
        "String",
        "Stream",
        "TimeSpan",
        "UnixTime",
    ]);

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function isWebResourceLike(object) {
        if (typeof object !== "object") {
            return false;
        }
        if (typeof object.url === "string" &&
            typeof object.method === "string" &&
            typeof object.headers === "object" &&
            isHttpHeadersLike(object.headers) &&
            typeof object.validateRequestProperties === "function" &&
            typeof object.prepare === "function" &&
            typeof object.clone === "function") {
            return true;
        }
        return false;
    }
    /**
     * Creates a new WebResource object.
     *
     * This class provides an abstraction over a REST call by being library / implementation agnostic and wrapping the necessary
     * properties to initiate a request.
     *
     * @constructor
     */
    var WebResource = /** @class */ (function () {
        function WebResource(url, method, body, query, headers, streamResponseBody, withCredentials, abortSignal, timeout, onUploadProgress, onDownloadProgress, proxySettings, keepAlive, agentSettings, redirectLimit) {
            this.streamResponseBody = streamResponseBody;
            this.url = url || "";
            this.method = method || "GET";
            this.headers = isHttpHeadersLike(headers) ? headers : new HttpHeaders(headers);
            this.body = body;
            this.query = query;
            this.formData = undefined;
            this.withCredentials = withCredentials || false;
            this.abortSignal = abortSignal;
            this.timeout = timeout || 0;
            this.onUploadProgress = onUploadProgress;
            this.onDownloadProgress = onDownloadProgress;
            this.proxySettings = proxySettings;
            this.keepAlive = keepAlive;
            this.agentSettings = agentSettings;
            this.redirectLimit = redirectLimit;
        }
        /**
         * Validates that the required properties such as method, url, headers["Content-Type"],
         * headers["accept-language"] are defined. It will throw an error if one of the above
         * mentioned properties are not defined.
         */
        WebResource.prototype.validateRequestProperties = function () {
            if (!this.method) {
                throw new Error("WebResource.method is required.");
            }
            if (!this.url) {
                throw new Error("WebResource.url is required.");
            }
        };
        /**
         * Prepares the request.
         * @param {RequestPrepareOptions} options Options to provide for preparing the request.
         * @returns {WebResource} Returns the prepared WebResource (HTTP Request) object that needs to be given to the request pipeline.
         */
        WebResource.prototype.prepare = function (options) {
            if (!options) {
                throw new Error("options object is required");
            }
            if (options.method == undefined || typeof options.method.valueOf() !== "string") {
                throw new Error("options.method must be a string.");
            }
            if (options.url && options.pathTemplate) {
                throw new Error("options.url and options.pathTemplate are mutually exclusive. Please provide exactly one of them.");
            }
            if ((options.pathTemplate == undefined || typeof options.pathTemplate.valueOf() !== "string") &&
                (options.url == undefined || typeof options.url.valueOf() !== "string")) {
                throw new Error("Please provide exactly one of options.pathTemplate or options.url.");
            }
            // set the url if it is provided.
            if (options.url) {
                if (typeof options.url !== "string") {
                    throw new Error('options.url must be of type "string".');
                }
                this.url = options.url;
            }
            // set the method
            if (options.method) {
                var validMethods = ["GET", "PUT", "HEAD", "DELETE", "OPTIONS", "POST", "PATCH", "TRACE"];
                if (validMethods.indexOf(options.method.toUpperCase()) === -1) {
                    throw new Error('The provided method "' +
                        options.method +
                        '" is invalid. Supported HTTP methods are: ' +
                        JSON.stringify(validMethods));
                }
            }
            this.method = options.method.toUpperCase();
            // construct the url if path template is provided
            if (options.pathTemplate) {
                var pathTemplate_1 = options.pathTemplate, pathParameters_1 = options.pathParameters;
                if (typeof pathTemplate_1 !== "string") {
                    throw new Error('options.pathTemplate must be of type "string".');
                }
                if (!options.baseUrl) {
                    options.baseUrl = "https://management.azure.com";
                }
                var baseUrl = options.baseUrl;
                var url_1 = baseUrl +
                    (baseUrl.endsWith("/") ? "" : "/") +
                    (pathTemplate_1.startsWith("/") ? pathTemplate_1.slice(1) : pathTemplate_1);
                var segments = url_1.match(/({\w*\s*\w*})/gi);
                if (segments && segments.length) {
                    if (!pathParameters_1) {
                        throw new Error("pathTemplate: " + pathTemplate_1 + " has been provided. Hence, options.pathParameters must also be provided.");
                    }
                    segments.forEach(function (item) {
                        var pathParamName = item.slice(1, -1);
                        var pathParam = pathParameters_1[pathParamName];
                        if (pathParam === null ||
                            pathParam === undefined ||
                            !(typeof pathParam === "string" || typeof pathParam === "object")) {
                            throw new Error("pathTemplate: " + pathTemplate_1 + " contains the path parameter " + pathParamName +
                                (" however, it is not present in " + pathParameters_1 + " - " + JSON.stringify(pathParameters_1, undefined, 2) + ".") +
                                ("The value of the path parameter can either be a \"string\" of the form { " + pathParamName + ": \"some sample value\" } or ") +
                                ("it can be an \"object\" of the form { \"" + pathParamName + "\": { value: \"some sample value\", skipUrlEncoding: true } }."));
                        }
                        if (typeof pathParam.valueOf() === "string") {
                            url_1 = url_1.replace(item, encodeURIComponent(pathParam));
                        }
                        if (typeof pathParam.valueOf() === "object") {
                            if (!pathParam.value) {
                                throw new Error("options.pathParameters[" + pathParamName + "] is of type \"object\" but it does not contain a \"value\" property.");
                            }
                            if (pathParam.skipUrlEncoding) {
                                url_1 = url_1.replace(item, pathParam.value);
                            }
                            else {
                                url_1 = url_1.replace(item, encodeURIComponent(pathParam.value));
                            }
                        }
                    });
                }
                this.url = url_1;
            }
            // append query parameters to the url if they are provided. They can be provided with pathTemplate or url option.
            if (options.queryParameters) {
                var queryParameters = options.queryParameters;
                if (typeof queryParameters !== "object") {
                    throw new Error("options.queryParameters must be of type object. It should be a JSON object " +
                        "of \"query-parameter-name\" as the key and the \"query-parameter-value\" as the value. " +
                        "The \"query-parameter-value\" may be fo type \"string\" or an \"object\" of the form { value: \"query-parameter-value\", skipUrlEncoding: true }.");
                }
                // append question mark if it is not present in the url
                if (this.url && this.url.indexOf("?") === -1) {
                    this.url += "?";
                }
                // construct queryString
                var queryParams = [];
                // We need to populate this.query as a dictionary if the request is being used for Sway's validateRequest().
                this.query = {};
                for (var queryParamName in queryParameters) {
                    var queryParam = queryParameters[queryParamName];
                    if (queryParam) {
                        if (typeof queryParam === "string") {
                            queryParams.push(queryParamName + "=" + encodeURIComponent(queryParam));
                            this.query[queryParamName] = encodeURIComponent(queryParam);
                        }
                        else if (typeof queryParam === "object") {
                            if (!queryParam.value) {
                                throw new Error("options.queryParameters[" + queryParamName + "] is of type \"object\" but it does not contain a \"value\" property.");
                            }
                            if (queryParam.skipUrlEncoding) {
                                queryParams.push(queryParamName + "=" + queryParam.value);
                                this.query[queryParamName] = queryParam.value;
                            }
                            else {
                                queryParams.push(queryParamName + "=" + encodeURIComponent(queryParam.value));
                                this.query[queryParamName] = encodeURIComponent(queryParam.value);
                            }
                        }
                    }
                } // end-of-for
                // append the queryString
                this.url += queryParams.join("&");
            }
            // add headers to the request if they are provided
            if (options.headers) {
                var headers = options.headers;
                for (var _i = 0, _a = Object.keys(options.headers); _i < _a.length; _i++) {
                    var headerName = _a[_i];
                    this.headers.set(headerName, headers[headerName]);
                }
            }
            // ensure accept-language is set correctly
            if (!this.headers.get("accept-language")) {
                this.headers.set("accept-language", "en-US");
            }
            // ensure the request-id is set correctly
            if (!this.headers.get("x-ms-client-request-id") && !options.disableClientRequestId) {
                this.headers.set("x-ms-client-request-id", generateUuid());
            }
            // default
            if (!this.headers.get("Content-Type")) {
                this.headers.set("Content-Type", "application/json; charset=utf-8");
            }
            // set the request body. request.js automatically sets the Content-Length request header, so we need not set it explicilty
            this.body = options.body;
            if (options.body != undefined) {
                // body as a stream special case. set the body as-is and check for some special request headers specific to sending a stream.
                if (options.bodyIsStream) {
                    if (!this.headers.get("Transfer-Encoding")) {
                        this.headers.set("Transfer-Encoding", "chunked");
                    }
                    if (this.headers.get("Content-Type") !== "application/octet-stream") {
                        this.headers.set("Content-Type", "application/octet-stream");
                    }
                }
                else {
                    if (options.serializationMapper) {
                        this.body = new Serializer(options.mappers).serialize(options.serializationMapper, options.body, "requestBody");
                    }
                    if (!options.disableJsonStringifyOnBody) {
                        this.body = JSON.stringify(options.body);
                    }
                }
            }
            this.abortSignal = options.abortSignal;
            this.onDownloadProgress = options.onDownloadProgress;
            this.onUploadProgress = options.onUploadProgress;
            this.redirectLimit = options.redirectLimit;
            this.streamResponseBody = options.streamResponseBody;
            return this;
        };
        /**
         * Clone this WebResource HTTP request object.
         * @returns {WebResource} The clone of this WebResource HTTP request object.
         */
        WebResource.prototype.clone = function () {
            var result = new WebResource(this.url, this.method, this.body, this.query, this.headers && this.headers.clone(), this.streamResponseBody, this.withCredentials, this.abortSignal, this.timeout, this.onUploadProgress, this.onDownloadProgress, this.proxySettings, this.keepAlive, this.agentSettings, this.redirectLimit);
            if (this.formData) {
                result.formData = this.formData;
            }
            if (this.operationSpec) {
                result.operationSpec = this.operationSpec;
            }
            if (this.shouldDeserialize) {
                result.shouldDeserialize = this.shouldDeserialize;
            }
            if (this.operationResponseGetter) {
                result.operationResponseGetter = this.operationResponseGetter;
            }
            return result;
        };
        return WebResource;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var RestError = /** @class */ (function (_super) {
        __extends(RestError, _super);
        function RestError(message, code, statusCode, request, response, body) {
            var _this = _super.call(this, message) || this;
            _this.code = code;
            _this.statusCode = statusCode;
            _this.request = request;
            _this.response = response;
            _this.body = body;
            Object.setPrototypeOf(_this, RestError.prototype);
            return _this;
        }
        RestError.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
        RestError.REQUEST_ABORTED_ERROR = "REQUEST_ABORTED_ERROR";
        RestError.PARSE_ERROR = "PARSE_ERROR";
        return RestError;
    }(Error));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * A HttpClient implementation that uses XMLHttpRequest to send HTTP requests.
     */
    var XhrHttpClient = /** @class */ (function () {
        function XhrHttpClient() {
        }
        XhrHttpClient.prototype.sendRequest = function (request) {
            var xhr = new XMLHttpRequest();
            if (request.agentSettings) {
                throw new Error("HTTP agent settings not supported in browser environment");
            }
            if (request.proxySettings) {
                throw new Error("HTTP proxy is not supported in browser environment");
            }
            var abortSignal = request.abortSignal;
            if (abortSignal) {
                var listener_1 = function () {
                    xhr.abort();
                };
                abortSignal.addEventListener("abort", listener_1);
                xhr.addEventListener("readystatechange", function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        abortSignal.removeEventListener("abort", listener_1);
                    }
                });
            }
            addProgressListener(xhr.upload, request.onUploadProgress);
            addProgressListener(xhr, request.onDownloadProgress);
            if (request.formData) {
                var formData = request.formData;
                var requestForm_1 = new FormData();
                var appendFormValue = function (key, value) {
                    if (value && value.hasOwnProperty("value") && value.hasOwnProperty("options")) {
                        requestForm_1.append(key, value.value, value.options);
                    }
                    else {
                        requestForm_1.append(key, value);
                    }
                };
                for (var _i = 0, _a = Object.keys(formData); _i < _a.length; _i++) {
                    var formKey = _a[_i];
                    var formValue = formData[formKey];
                    if (Array.isArray(formValue)) {
                        for (var j = 0; j < formValue.length; j++) {
                            appendFormValue(formKey, formValue[j]);
                        }
                    }
                    else {
                        appendFormValue(formKey, formValue);
                    }
                }
                request.body = requestForm_1;
                request.formData = undefined;
                var contentType = request.headers.get("Content-Type");
                if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
                    // browser will automatically apply a suitable content-type header
                    request.headers.remove("Content-Type");
                }
            }
            xhr.open(request.method, request.url);
            xhr.timeout = request.timeout;
            xhr.withCredentials = request.withCredentials;
            for (var _b = 0, _c = request.headers.headersArray(); _b < _c.length; _b++) {
                var header = _c[_b];
                xhr.setRequestHeader(header.name, header.value);
            }
            xhr.responseType = request.streamResponseBody ? "blob" : "text";
            // tslint:disable-next-line:no-null-keyword
            xhr.send(request.body === undefined ? null : request.body);
            if (request.streamResponseBody) {
                return new Promise(function (resolve, reject) {
                    xhr.addEventListener("readystatechange", function () {
                        // Resolve as soon as headers are loaded
                        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                            var blobBody = new Promise(function (resolve, reject) {
                                xhr.addEventListener("load", function () {
                                    resolve(xhr.response);
                                });
                                rejectOnTerminalEvent(request, xhr, reject);
                            });
                            resolve({
                                request: request,
                                status: xhr.status,
                                headers: parseHeaders(xhr),
                                blobBody: blobBody,
                            });
                        }
                    });
                    rejectOnTerminalEvent(request, xhr, reject);
                });
            }
            else {
                return new Promise(function (resolve, reject) {
                    xhr.addEventListener("load", function () {
                        return resolve({
                            request: request,
                            status: xhr.status,
                            headers: parseHeaders(xhr),
                            bodyAsText: xhr.responseText,
                        });
                    });
                    rejectOnTerminalEvent(request, xhr, reject);
                });
            }
        };
        return XhrHttpClient;
    }());
    function addProgressListener(xhr, listener) {
        if (listener) {
            xhr.addEventListener("progress", function (rawEvent) {
                return listener({
                    loadedBytes: rawEvent.loaded,
                });
            });
        }
    }
    // exported locally for testing
    function parseHeaders(xhr) {
        var responseHeaders = new HttpHeaders();
        var headerLines = xhr
            .getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/);
        for (var _i = 0, headerLines_1 = headerLines; _i < headerLines_1.length; _i++) {
            var line = headerLines_1[_i];
            var index = line.indexOf(":");
            var headerName = line.slice(0, index);
            var headerValue = line.slice(index + 2);
            responseHeaders.set(headerName, headerValue);
        }
        return responseHeaders;
    }
    function rejectOnTerminalEvent(request, xhr, reject) {
        xhr.addEventListener("error", function () {
            return reject(new RestError("Failed to send request to " + request.url, RestError.REQUEST_SEND_ERROR, undefined, request));
        });
        xhr.addEventListener("abort", function () {
            return reject(new RestError("The request was aborted", RestError.REQUEST_ABORTED_ERROR, undefined, request));
        });
        xhr.addEventListener("timeout", function () {
            return reject(new RestError("timeout of " + xhr.timeout + "ms exceeded", RestError.REQUEST_SEND_ERROR, undefined, request));
        });
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    (function (HttpPipelineLogLevel) {
        /**
         * A log level that indicates that no logs will be logged.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["OFF"] = 0] = "OFF";
        /**
         * An error log.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["ERROR"] = 1] = "ERROR";
        /**
         * A warning log.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["WARNING"] = 2] = "WARNING";
        /**
         * An information log.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["INFO"] = 3] = "INFO";
    })(exports.HttpPipelineLogLevel || (exports.HttpPipelineLogLevel = {}));

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * Tests an object to determine whether it implements TokenCredential.
     *
     * @param credential - The assumed TokenCredential to be tested.
     */
    function isTokenCredential(credential) {
        // Check for an object with a 'getToken' function and possibly with
        // a 'signRequest' function.  We do this check to make sure that
        // a ServiceClientCredentials implementor (like TokenClientCredentials
        // in ms-rest-nodeauth) doesn't get mistaken for a TokenCredential if
        // it doesn't actually implement TokenCredential also.
        const castCredential = credential;
        return (castCredential &&
            typeof castCredential.getToken === "function" &&
            (castCredential.signRequest === undefined || castCredential.getToken.length > 0));
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    /**
     * Get the path to this parameter's value as a dotted string (a.b.c).
     * @param parameter The parameter to get the path string for.
     * @returns The path to this parameter's value as a dotted string.
     */
    function getPathStringFromParameter(parameter) {
        return getPathStringFromParameterPath(parameter.parameterPath, parameter.mapper);
    }
    function getPathStringFromParameterPath(parameterPath, mapper) {
        var result;
        if (typeof parameterPath === "string") {
            result = parameterPath;
        }
        else if (Array.isArray(parameterPath)) {
            result = parameterPath.join(".");
        }
        else {
            result = mapper.serializedName;
        }
        return result;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function isStreamOperation(operationSpec) {
        var result = false;
        for (var statusCode in operationSpec.responses) {
            var operationResponse = operationSpec.responses[statusCode];
            if (operationResponse.bodyMapper &&
                operationResponse.bodyMapper.type.name === MapperType.Stream) {
                result = true;
                break;
            }
        }
        return result;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    var _a, _b;
    var parser = new DOMParser();
    // Policy to make our code Trusted Types compliant.
    //   https://github.com/w3c/webappsec-trusted-types
    // We are calling DOMParser.parseFromString() to parse XML payload from Azure services.
    // The parsed DOM object is not exposed to outside. Scripts are disabled when parsing
    // according to the spec.  There are no HTML/XSS security concerns on the usage of
    // parseFromString() here.
    var ttPolicy;
    if (typeof self.trustedTypes !== "undefined") {
        ttPolicy = self.trustedTypes.createPolicy("@azure/ms-rest-js#xml.browser", {
            createHTML: function (s) { return s; },
        });
    }
    function parseXML(str) {
        var _a;
        try {
            var dom = parser.parseFromString(((_a = ttPolicy === null || ttPolicy === void 0 ? void 0 : ttPolicy.createHTML(str)) !== null && _a !== void 0 ? _a : str), "application/xml");
            throwIfError(dom);
            var obj = domToObject(dom.childNodes[0]);
            return Promise.resolve(obj);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    var errorNS = "";
    try {
        var invalidXML = ((_a = ttPolicy === null || ttPolicy === void 0 ? void 0 : ttPolicy.createHTML("INVALID")) !== null && _a !== void 0 ? _a : "INVALID");
        errorNS = (_b = parser.parseFromString(invalidXML, "text/xml").getElementsByTagName("parsererror")[0]
            .namespaceURI) !== null && _b !== void 0 ? _b : "";
    }
    catch (ignored) {
        // Most browsers will return a document containing <parsererror>, but IE will throw.
    }
    function throwIfError(dom) {
        if (errorNS) {
            var parserErrors = dom.getElementsByTagNameNS(errorNS, "parsererror");
            if (parserErrors.length) {
                throw new Error(parserErrors.item(0).innerHTML);
            }
        }
    }
    function isElement(node) {
        return !!node.attributes;
    }
    /**
     * Get the Element-typed version of the provided Node if the provided node is an element with
     * attributes. If it isn't, then undefined is returned.
     */
    function asElementWithAttributes(node) {
        return isElement(node) && node.hasAttributes() ? node : undefined;
    }
    function domToObject(node) {
        var result = {};
        var childNodeCount = node.childNodes.length;
        var firstChildNode = node.childNodes[0];
        var onlyChildTextValue = (firstChildNode &&
            childNodeCount === 1 &&
            firstChildNode.nodeType === Node.TEXT_NODE &&
            firstChildNode.nodeValue) ||
            undefined;
        var elementWithAttributes = asElementWithAttributes(node);
        if (elementWithAttributes) {
            result["$"] = {};
            for (var i = 0; i < elementWithAttributes.attributes.length; i++) {
                var attr = elementWithAttributes.attributes[i];
                result["$"][attr.nodeName] = attr.nodeValue;
            }
            if (onlyChildTextValue) {
                result["_"] = onlyChildTextValue;
            }
        }
        else if (childNodeCount === 0) {
            result = "";
        }
        else if (onlyChildTextValue) {
            result = onlyChildTextValue;
        }
        if (!onlyChildTextValue) {
            for (var i = 0; i < childNodeCount; i++) {
                var child = node.childNodes[i];
                // Ignore leading/trailing whitespace nodes
                if (child.nodeType !== Node.TEXT_NODE) {
                    var childObject = domToObject(child);
                    if (!result[child.nodeName]) {
                        result[child.nodeName] = childObject;
                    }
                    else if (Array.isArray(result[child.nodeName])) {
                        result[child.nodeName].push(childObject);
                    }
                    else {
                        result[child.nodeName] = [result[child.nodeName], childObject];
                    }
                }
            }
        }
        return result;
    }
    // tslint:disable-next-line:no-null-keyword
    var doc = document.implementation.createDocument(null, null, null);
    var serializer = new XMLSerializer();
    function stringifyXML(obj, opts) {
        var rootName = (opts && opts.rootName) || "root";
        var dom = buildNode(obj, rootName)[0];
        return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + serializer.serializeToString(dom));
    }
    function buildAttributes(attrs) {
        var result = [];
        for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
            var key = _a[_i];
            var attr = doc.createAttribute(key);
            attr.value = attrs[key].toString();
            result.push(attr);
        }
        return result;
    }
    function buildNode(obj, elementName) {
        if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
            var elem = doc.createElement(elementName);
            elem.textContent = obj.toString();
            return [elem];
        }
        else if (Array.isArray(obj)) {
            var result = [];
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var arrayElem = obj_1[_i];
                for (var _a = 0, _b = buildNode(arrayElem, elementName); _a < _b.length; _a++) {
                    var child = _b[_a];
                    result.push(child);
                }
            }
            return result;
        }
        else if (typeof obj === "object") {
            var elem = doc.createElement(elementName);
            for (var _c = 0, _d = Object.keys(obj); _c < _d.length; _c++) {
                var key = _d[_c];
                if (key === "$") {
                    for (var _e = 0, _f = buildAttributes(obj[key]); _e < _f.length; _e++) {
                        var attr = _f[_e];
                        elem.attributes.setNamedItem(attr);
                    }
                }
                else {
                    for (var _g = 0, _h = buildNode(obj[key], key); _g < _h.length; _g++) {
                        var child = _h[_g];
                        elem.appendChild(child);
                    }
                }
            }
            return [elem];
        }
        else {
            throw new Error("Illegal value passed to buildObject: " + obj);
        }
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var BaseRequestPolicy = /** @class */ (function () {
        function BaseRequestPolicy(_nextPolicy, _options) {
            this._nextPolicy = _nextPolicy;
            this._options = _options;
        }
        /**
         * Get whether or not a log with the provided log level should be logged.
         * @param logLevel The log level of the log that will be logged.
         * @returns Whether or not a log with the provided log level should be logged.
         */
        BaseRequestPolicy.prototype.shouldLog = function (logLevel) {
            return this._options.shouldLog(logLevel);
        };
        /**
         * Attempt to log the provided message to the provided logger. If no logger was provided or if
         * the log level does not meat the logger's threshold, then nothing will be logged.
         * @param logLevel The log level of this log.
         * @param message The message of this log.
         */
        BaseRequestPolicy.prototype.log = function (logLevel, message) {
            this._options.log(logLevel, message);
        };
        return BaseRequestPolicy;
    }());
    /**
     * Optional properties that can be used when creating a RequestPolicy.
     */
    var RequestPolicyOptions = /** @class */ (function () {
        function RequestPolicyOptions(_logger) {
            this._logger = _logger;
        }
        /**
         * Get whether or not a log with the provided log level should be logged.
         * @param logLevel The log level of the log that will be logged.
         * @returns Whether or not a log with the provided log level should be logged.
         */
        RequestPolicyOptions.prototype.shouldLog = function (logLevel) {
            return (!!this._logger &&
                logLevel !== exports.HttpPipelineLogLevel.OFF &&
                logLevel <= this._logger.minimumLogLevel);
        };
        /**
         * Attempt to log the provided message to the provided logger. If no logger was provided or if
         * the log level does not meat the logger's threshold, then nothing will be logged.
         * @param logLevel The log level of this log.
         * @param message The message of this log.
         */
        RequestPolicyOptions.prototype.log = function (logLevel, message) {
            if (this._logger && this.shouldLog(logLevel)) {
                this._logger.log(logLevel, message);
            }
        };
        return RequestPolicyOptions;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Create a new serialization RequestPolicyCreator that will serialized HTTP request bodies as they
     * pass through the HTTP pipeline.
     */
    function deserializationPolicy(deserializationContentTypes) {
        return {
            create: function (nextPolicy, options) {
                return new DeserializationPolicy(nextPolicy, deserializationContentTypes, options);
            },
        };
    }
    var defaultJsonContentTypes = ["application/json", "text/json"];
    var defaultXmlContentTypes = ["application/xml", "application/atom+xml"];
    /**
     * A RequestPolicy that will deserialize HTTP response bodies and headers as they pass through the
     * HTTP pipeline.
     */
    var DeserializationPolicy = /** @class */ (function (_super) {
        __extends(DeserializationPolicy, _super);
        function DeserializationPolicy(nextPolicy, deserializationContentTypes, options) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.jsonContentTypes =
                (deserializationContentTypes && deserializationContentTypes.json) || defaultJsonContentTypes;
            _this.xmlContentTypes =
                (deserializationContentTypes && deserializationContentTypes.xml) || defaultXmlContentTypes;
            return _this;
        }
        DeserializationPolicy.prototype.sendRequest = function (request) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._nextPolicy
                            .sendRequest(request)
                            .then(function (response) {
                            return deserializeResponseBody(_this.jsonContentTypes, _this.xmlContentTypes, response);
                        })];
                });
            });
        };
        return DeserializationPolicy;
    }(BaseRequestPolicy));
    function getOperationResponse(parsedResponse) {
        var result;
        var request = parsedResponse.request;
        var operationSpec = request.operationSpec;
        if (operationSpec) {
            var operationResponseGetter = request.operationResponseGetter;
            if (!operationResponseGetter) {
                result = operationSpec.responses[parsedResponse.status];
            }
            else {
                result = operationResponseGetter(operationSpec, parsedResponse);
            }
        }
        return result;
    }
    function shouldDeserializeResponse(parsedResponse) {
        var shouldDeserialize = parsedResponse.request.shouldDeserialize;
        var result;
        if (shouldDeserialize === undefined) {
            result = true;
        }
        else if (typeof shouldDeserialize === "boolean") {
            result = shouldDeserialize;
        }
        else {
            result = shouldDeserialize(parsedResponse);
        }
        return result;
    }
    function deserializeResponseBody(jsonContentTypes, xmlContentTypes, response) {
        return parse(jsonContentTypes, xmlContentTypes, response).then(function (parsedResponse) {
            var shouldDeserialize = shouldDeserializeResponse(parsedResponse);
            if (shouldDeserialize) {
                var operationSpec = parsedResponse.request.operationSpec;
                if (operationSpec && operationSpec.responses) {
                    var statusCode = parsedResponse.status;
                    var expectedStatusCodes = Object.keys(operationSpec.responses);
                    var hasNoExpectedStatusCodes = expectedStatusCodes.length === 0 ||
                        (expectedStatusCodes.length === 1 && expectedStatusCodes[0] === "default");
                    var responseSpec = getOperationResponse(parsedResponse);
                    var isExpectedStatusCode = hasNoExpectedStatusCodes
                        ? 200 <= statusCode && statusCode < 300
                        : !!responseSpec;
                    if (!isExpectedStatusCode) {
                        var defaultResponseSpec = operationSpec.responses.default;
                        if (defaultResponseSpec) {
                            var initialErrorMessage = isStreamOperation(operationSpec)
                                ? "Unexpected status code: " + statusCode
                                : parsedResponse.bodyAsText;
                            var error = new RestError(initialErrorMessage);
                            error.statusCode = statusCode;
                            error.request = stripRequest(parsedResponse.request);
                            error.response = stripResponse(parsedResponse);
                            var parsedErrorResponse = parsedResponse.parsedBody;
                            try {
                                if (parsedErrorResponse) {
                                    var defaultResponseBodyMapper = defaultResponseSpec.bodyMapper;
                                    if (defaultResponseBodyMapper &&
                                        defaultResponseBodyMapper.serializedName === "CloudError") {
                                        if (parsedErrorResponse.error) {
                                            parsedErrorResponse = parsedErrorResponse.error;
                                        }
                                        if (parsedErrorResponse.code) {
                                            error.code = parsedErrorResponse.code;
                                        }
                                        if (parsedErrorResponse.message) {
                                            error.message = parsedErrorResponse.message;
                                        }
                                    }
                                    else {
                                        var internalError = parsedErrorResponse;
                                        if (parsedErrorResponse.error) {
                                            internalError = parsedErrorResponse.error;
                                        }
                                        error.code = internalError.code;
                                        if (internalError.message) {
                                            error.message = internalError.message;
                                        }
                                    }
                                    if (defaultResponseBodyMapper) {
                                        var valueToDeserialize = parsedErrorResponse;
                                        if (operationSpec.isXML &&
                                            defaultResponseBodyMapper.type.name === MapperType.Sequence) {
                                            valueToDeserialize =
                                                typeof parsedErrorResponse === "object"
                                                    ? parsedErrorResponse[defaultResponseBodyMapper.xmlElementName]
                                                    : [];
                                        }
                                        error.body = operationSpec.serializer.deserialize(defaultResponseBodyMapper, valueToDeserialize, "error.body");
                                    }
                                }
                            }
                            catch (defaultError) {
                                error.message = "Error \"" + defaultError.message + "\" occurred in deserializing the responseBody - \"" + parsedResponse.bodyAsText + "\" for the default response.";
                            }
                            return Promise.reject(error);
                        }
                    }
                    else if (responseSpec) {
                        if (responseSpec.bodyMapper) {
                            var valueToDeserialize = parsedResponse.parsedBody;
                            if (operationSpec.isXML && responseSpec.bodyMapper.type.name === MapperType.Sequence) {
                                valueToDeserialize =
                                    typeof valueToDeserialize === "object"
                                        ? valueToDeserialize[responseSpec.bodyMapper.xmlElementName]
                                        : [];
                            }
                            try {
                                parsedResponse.parsedBody = operationSpec.serializer.deserialize(responseSpec.bodyMapper, valueToDeserialize, "operationRes.parsedBody");
                            }
                            catch (error) {
                                var restError = new RestError("Error " + error + " occurred in deserializing the responseBody - " + parsedResponse.bodyAsText);
                                restError.request = stripRequest(parsedResponse.request);
                                restError.response = stripResponse(parsedResponse);
                                return Promise.reject(restError);
                            }
                        }
                        else if (operationSpec.httpMethod === "HEAD") {
                            // head methods never have a body, but we return a boolean to indicate presence/absence of the resource
                            parsedResponse.parsedBody = response.status >= 200 && response.status < 300;
                        }
                        if (responseSpec.headersMapper) {
                            parsedResponse.parsedHeaders = operationSpec.serializer.deserialize(responseSpec.headersMapper, parsedResponse.headers.rawHeaders(), "operationRes.parsedHeaders");
                        }
                    }
                }
            }
            return Promise.resolve(parsedResponse);
        });
    }
    function parse(jsonContentTypes, xmlContentTypes, operationResponse) {
        var errorHandler = function (err) {
            var msg = "Error \"" + err + "\" occurred while parsing the response body - " + operationResponse.bodyAsText + ".";
            var errCode = err.code || RestError.PARSE_ERROR;
            var e = new RestError(msg, errCode, operationResponse.status, operationResponse.request, operationResponse, operationResponse.bodyAsText);
            return Promise.reject(e);
        };
        if (!operationResponse.request.streamResponseBody && operationResponse.bodyAsText) {
            var text_1 = operationResponse.bodyAsText;
            var contentType = operationResponse.headers.get("Content-Type") || "";
            var contentComponents = !contentType
                ? []
                : contentType.split(";").map(function (component) { return component.toLowerCase(); });
            if (contentComponents.length === 0 ||
                contentComponents.some(function (component) { return jsonContentTypes.indexOf(component) !== -1; })) {
                return new Promise(function (resolve) {
                    operationResponse.parsedBody = JSON.parse(text_1);
                    resolve(operationResponse);
                }).catch(errorHandler);
            }
            else if (contentComponents.some(function (component) { return xmlContentTypes.indexOf(component) !== -1; })) {
                return parseXML(text_1)
                    .then(function (body) {
                    operationResponse.parsedBody = body;
                    return operationResponse;
                })
                    .catch(errorHandler);
            }
        }
        return Promise.resolve(operationResponse);
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function exponentialRetryPolicy(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
        return {
            create: function (nextPolicy, options) {
                return new ExponentialRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval);
            },
        };
    }
    var DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
    var DEFAULT_CLIENT_RETRY_COUNT = 3;
    var DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
    var DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
    /**
     * @class
     * Instantiates a new "ExponentialRetryPolicyFilter" instance.
     */
    var ExponentialRetryPolicy = /** @class */ (function (_super) {
        __extends(ExponentialRetryPolicy, _super);
        /**
         * @constructor
         * @param {RequestPolicy} nextPolicy The next RequestPolicy in the pipeline chain.
         * @param {RequestPolicyOptionsLike} options The options for this RequestPolicy.
         * @param {number} [retryCount]        The client retry count.
         * @param {number} [retryInterval]     The client retry interval, in milliseconds.
         * @param {number} [minRetryInterval]  The minimum retry interval, in milliseconds.
         * @param {number} [maxRetryInterval]  The maximum retry interval, in milliseconds.
         */
        function ExponentialRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
            var _this = _super.call(this, nextPolicy, options) || this;
            function isNumber(n) {
                return typeof n === "number";
            }
            _this.retryCount = isNumber(retryCount) ? retryCount : DEFAULT_CLIENT_RETRY_COUNT;
            _this.retryInterval = isNumber(retryInterval) ? retryInterval : DEFAULT_CLIENT_RETRY_INTERVAL;
            _this.minRetryInterval = isNumber(minRetryInterval)
                ? minRetryInterval
                : DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
            _this.maxRetryInterval = isNumber(maxRetryInterval)
                ? maxRetryInterval
                : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
            return _this;
        }
        ExponentialRetryPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request.clone())
                .then(function (response) { return retry(_this, request, response); })
                .catch(function (error) { return retry(_this, request, error.response, undefined, error); });
        };
        return ExponentialRetryPolicy;
    }(BaseRequestPolicy));
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param {ExponentialRetryPolicy} policy The ExponentialRetryPolicy that this function is being called against.
     * @param {number} statusCode The HTTP status code.
     * @param {RetryData} retryData  The retry data.
     * @return {boolean} True if the operation qualifies for a retry; false otherwise.
     */
    function shouldRetry(policy, statusCode, retryData) {
        if (statusCode == undefined ||
            (statusCode < 500 && statusCode !== 408) ||
            statusCode === 501 ||
            statusCode === 505) {
            return false;
        }
        var currentCount;
        if (!retryData) {
            throw new Error("retryData for the ExponentialRetryPolicyFilter cannot be null.");
        }
        else {
            currentCount = retryData && retryData.retryCount;
        }
        return currentCount < policy.retryCount;
    }
    /**
     * Updates the retry data for the next attempt.
     *
     * @param {ExponentialRetryPolicy} policy The ExponentialRetryPolicy that this function is being called against.
     * @param {RetryData} retryData  The retry data.
     * @param {RetryError} [err] The operation"s error, if any.
     */
    function updateRetryData(policy, retryData, err) {
        if (!retryData) {
            retryData = {
                retryCount: 0,
                retryInterval: 0,
            };
        }
        if (err) {
            if (retryData.error) {
                err.innerError = retryData.error;
            }
            retryData.error = err;
        }
        // Adjust retry count
        retryData.retryCount++;
        // Adjust retry interval
        var incrementDelta = Math.pow(2, retryData.retryCount) - 1;
        var boundedRandDelta = policy.retryInterval * 0.8 +
            Math.floor(Math.random() * (policy.retryInterval * 1.2 - policy.retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;
        retryData.retryInterval = Math.min(policy.minRetryInterval + incrementDelta, policy.maxRetryInterval);
        return retryData;
    }
    function retry(policy, request, response, retryData, requestError) {
        retryData = updateRetryData(policy, retryData, requestError);
        var isAborted = request.abortSignal && request.abortSignal.aborted;
        if (!isAborted && shouldRetry(policy, response && response.status, retryData)) {
            return delay(retryData.retryInterval)
                .then(function () { return policy._nextPolicy.sendRequest(request.clone()); })
                .then(function (res) { return retry(policy, request, res, retryData, undefined); })
                .catch(function (err) { return retry(policy, request, response, retryData, err); });
        }
        else if (isAborted || requestError || !response) {
            // If the operation failed in the end, return all errors instead of just the last one
            var err = retryData.error ||
                new RestError("Failed to send the request.", RestError.REQUEST_SEND_ERROR, response && response.status, response && response.request, response);
            return Promise.reject(err);
        }
        else {
            return Promise.resolve(response);
        }
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function generateClientRequestIdPolicy(requestIdHeaderName) {
        if (requestIdHeaderName === void 0) { requestIdHeaderName = "x-ms-client-request-id"; }
        return {
            create: function (nextPolicy, options) {
                return new GenerateClientRequestIdPolicy(nextPolicy, options, requestIdHeaderName);
            },
        };
    }
    var GenerateClientRequestIdPolicy = /** @class */ (function (_super) {
        __extends(GenerateClientRequestIdPolicy, _super);
        function GenerateClientRequestIdPolicy(nextPolicy, options, _requestIdHeaderName) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this._requestIdHeaderName = _requestIdHeaderName;
            return _this;
        }
        GenerateClientRequestIdPolicy.prototype.sendRequest = function (request) {
            if (!request.headers.contains(this._requestIdHeaderName)) {
                request.headers.set(this._requestIdHeaderName, generateUuid());
            }
            return this._nextPolicy.sendRequest(request);
        };
        return GenerateClientRequestIdPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    function getDefaultUserAgentKey() {
        return "x-ms-command-name";
    }
    function getPlatformSpecificData() {
        var navigator = self.navigator;
        var osInfo = {
            key: "OS",
            value: (navigator.oscpu || navigator.platform).replace(" ", ""),
        };
        return [osInfo];
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function getRuntimeInfo() {
        var msRestRuntime = {
            key: "ms-rest-js",
            value: Constants.msRestVersion,
        };
        return [msRestRuntime];
    }
    function getUserAgentString(telemetryInfo, keySeparator, valueSeparator) {
        if (keySeparator === void 0) { keySeparator = " "; }
        if (valueSeparator === void 0) { valueSeparator = "/"; }
        return telemetryInfo
            .map(function (info) {
            var value = info.value ? "" + valueSeparator + info.value : "";
            return "" + info.key + value;
        })
            .join(keySeparator);
    }
    var getDefaultUserAgentHeaderName = getDefaultUserAgentKey;
    function getDefaultUserAgentValue() {
        var runtimeInfo = getRuntimeInfo();
        var platformSpecificData = getPlatformSpecificData();
        var userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
        return userAgent;
    }
    function userAgentPolicy(userAgentData) {
        var key = !userAgentData || userAgentData.key == undefined ? getDefaultUserAgentKey() : userAgentData.key;
        var value = !userAgentData || userAgentData.value == undefined
            ? getDefaultUserAgentValue()
            : userAgentData.value;
        return {
            create: function (nextPolicy, options) {
                return new UserAgentPolicy(nextPolicy, options, key, value);
            },
        };
    }
    var UserAgentPolicy = /** @class */ (function (_super) {
        __extends(UserAgentPolicy, _super);
        function UserAgentPolicy(_nextPolicy, _options, headerKey, headerValue) {
            var _this = _super.call(this, _nextPolicy, _options) || this;
            _this._nextPolicy = _nextPolicy;
            _this._options = _options;
            _this.headerKey = headerKey;
            _this.headerValue = headerValue;
            return _this;
        }
        UserAgentPolicy.prototype.sendRequest = function (request) {
            this.addUserAgentHeader(request);
            return this._nextPolicy.sendRequest(request);
        };
        UserAgentPolicy.prototype.addUserAgentHeader = function (request) {
            if (!request.headers) {
                request.headers = new HttpHeaders();
            }
            if (!request.headers.get(this.headerKey) && this.headerValue) {
                request.headers.set(this.headerKey, this.headerValue);
            }
        };
        return UserAgentPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * A class that handles the query portion of a URLBuilder.
     */
    var URLQuery = /** @class */ (function () {
        function URLQuery() {
            this._rawQuery = {};
        }
        /**
         * Get whether or not there any query parameters in this URLQuery.
         */
        URLQuery.prototype.any = function () {
            return Object.keys(this._rawQuery).length > 0;
        };
        /**
         * Set a query parameter with the provided name and value. If the parameterValue is undefined or
         * empty, then this will attempt to remove an existing query parameter with the provided
         * parameterName.
         */
        URLQuery.prototype.set = function (parameterName, parameterValue) {
            if (parameterName) {
                if (parameterValue != undefined) {
                    var newValue = Array.isArray(parameterValue) ? parameterValue : parameterValue.toString();
                    this._rawQuery[parameterName] = newValue;
                }
                else {
                    delete this._rawQuery[parameterName];
                }
            }
        };
        /**
         * Get the value of the query parameter with the provided name. If no parameter exists with the
         * provided parameter name, then undefined will be returned.
         */
        URLQuery.prototype.get = function (parameterName) {
            return parameterName ? this._rawQuery[parameterName] : undefined;
        };
        /**
         * Get the string representation of this query. The return value will not start with a "?".
         */
        URLQuery.prototype.toString = function () {
            var result = "";
            for (var parameterName in this._rawQuery) {
                if (result) {
                    result += "&";
                }
                var parameterValue = this._rawQuery[parameterName];
                if (Array.isArray(parameterValue)) {
                    var parameterStrings = [];
                    for (var _i = 0, parameterValue_1 = parameterValue; _i < parameterValue_1.length; _i++) {
                        var parameterValueElement = parameterValue_1[_i];
                        parameterStrings.push(parameterName + "=" + parameterValueElement);
                    }
                    result += parameterStrings.join("&");
                }
                else {
                    result += parameterName + "=" + parameterValue;
                }
            }
            return result;
        };
        /**
         * Parse a URLQuery from the provided text.
         */
        URLQuery.parse = function (text) {
            var result = new URLQuery();
            if (text) {
                if (text.startsWith("?")) {
                    text = text.substring(1);
                }
                var currentState = "ParameterName";
                var parameterName = "";
                var parameterValue = "";
                for (var i = 0; i < text.length; ++i) {
                    var currentCharacter = text[i];
                    switch (currentState) {
                        case "ParameterName":
                            switch (currentCharacter) {
                                case "=":
                                    currentState = "ParameterValue";
                                    break;
                                case "&":
                                    parameterName = "";
                                    parameterValue = "";
                                    break;
                                default:
                                    parameterName += currentCharacter;
                                    break;
                            }
                            break;
                        case "ParameterValue":
                            switch (currentCharacter) {
                                case "&":
                                    result.set(parameterName, parameterValue);
                                    parameterName = "";
                                    parameterValue = "";
                                    currentState = "ParameterName";
                                    break;
                                default:
                                    parameterValue += currentCharacter;
                                    break;
                            }
                            break;
                        default:
                            throw new Error("Unrecognized URLQuery parse state: " + currentState);
                    }
                }
                if (currentState === "ParameterValue") {
                    result.set(parameterName, parameterValue);
                }
            }
            return result;
        };
        return URLQuery;
    }());
    /**
     * A class that handles creating, modifying, and parsing URLs.
     */
    var URLBuilder = /** @class */ (function () {
        function URLBuilder() {
        }
        /**
         * Set the scheme/protocol for this URL. If the provided scheme contains other parts of a URL
         * (such as a host, port, path, or query), those parts will be added to this URL as well.
         */
        URLBuilder.prototype.setScheme = function (scheme) {
            if (!scheme) {
                this._scheme = undefined;
            }
            else {
                this.set(scheme, "SCHEME");
            }
        };
        /**
         * Get the scheme that has been set in this URL.
         */
        URLBuilder.prototype.getScheme = function () {
            return this._scheme;
        };
        /**
         * Set the host for this URL. If the provided host contains other parts of a URL (such as a
         * port, path, or query), those parts will be added to this URL as well.
         */
        URLBuilder.prototype.setHost = function (host) {
            if (!host) {
                this._host = undefined;
            }
            else {
                this.set(host, "SCHEME_OR_HOST");
            }
        };
        /**
         * Get the host that has been set in this URL.
         */
        URLBuilder.prototype.getHost = function () {
            return this._host;
        };
        /**
         * Set the port for this URL. If the provided port contains other parts of a URL (such as a
         * path or query), those parts will be added to this URL as well.
         */
        URLBuilder.prototype.setPort = function (port) {
            if (port == undefined || port === "") {
                this._port = undefined;
            }
            else {
                this.set(port.toString(), "PORT");
            }
        };
        /**
         * Get the port that has been set in this URL.
         */
        URLBuilder.prototype.getPort = function () {
            return this._port;
        };
        /**
         * Set the path for this URL. If the provided path contains a query, then it will be added to
         * this URL as well.
         */
        URLBuilder.prototype.setPath = function (path) {
            if (!path) {
                this._path = undefined;
            }
            else {
                var schemeIndex = path.indexOf("://");
                if (schemeIndex !== -1) {
                    var schemeStart = path.lastIndexOf("/", schemeIndex);
                    // Make sure to only grab the URL part of the path before setting the state back to SCHEME
                    // this will handle cases such as "/a/b/c/https://microsoft.com" => "https://microsoft.com"
                    this.set(schemeStart === -1 ? path : path.substr(schemeStart + 1), "SCHEME");
                }
                else {
                    this.set(path, "PATH");
                }
            }
        };
        /**
         * Append the provided path to this URL's existing path. If the provided path contains a query,
         * then it will be added to this URL as well.
         */
        URLBuilder.prototype.appendPath = function (path) {
            if (path) {
                var currentPath = this.getPath();
                if (currentPath) {
                    if (!currentPath.endsWith("/")) {
                        currentPath += "/";
                    }
                    if (path.startsWith("/")) {
                        path = path.substring(1);
                    }
                    path = currentPath + path;
                }
                this.set(path, "PATH");
            }
        };
        /**
         * Get the path that has been set in this URL.
         */
        URLBuilder.prototype.getPath = function () {
            return this._path;
        };
        /**
         * Set the query in this URL.
         */
        URLBuilder.prototype.setQuery = function (query) {
            if (!query) {
                this._query = undefined;
            }
            else {
                this._query = URLQuery.parse(query);
            }
        };
        /**
         * Set a query parameter with the provided name and value in this URL's query. If the provided
         * query parameter value is undefined or empty, then the query parameter will be removed if it
         * existed.
         */
        URLBuilder.prototype.setQueryParameter = function (queryParameterName, queryParameterValue) {
            if (queryParameterName) {
                if (!this._query) {
                    this._query = new URLQuery();
                }
                this._query.set(queryParameterName, queryParameterValue);
            }
        };
        /**
         * Get the value of the query parameter with the provided query parameter name. If no query
         * parameter exists with the provided name, then undefined will be returned.
         */
        URLBuilder.prototype.getQueryParameterValue = function (queryParameterName) {
            return this._query ? this._query.get(queryParameterName) : undefined;
        };
        /**
         * Get the query in this URL.
         */
        URLBuilder.prototype.getQuery = function () {
            return this._query ? this._query.toString() : undefined;
        };
        /**
         * Set the parts of this URL by parsing the provided text using the provided startState.
         */
        URLBuilder.prototype.set = function (text, startState) {
            var tokenizer = new URLTokenizer(text, startState);
            while (tokenizer.next()) {
                var token = tokenizer.current();
                if (token) {
                    switch (token.type) {
                        case "SCHEME":
                            this._scheme = token.text || undefined;
                            break;
                        case "HOST":
                            this._host = token.text || undefined;
                            break;
                        case "PORT":
                            this._port = token.text || undefined;
                            break;
                        case "PATH":
                            var tokenPath = token.text || undefined;
                            if (!this._path || this._path === "/" || tokenPath !== "/") {
                                this._path = tokenPath;
                            }
                            break;
                        case "QUERY":
                            this._query = URLQuery.parse(token.text);
                            break;
                        default:
                            throw new Error("Unrecognized URLTokenType: " + token.type);
                    }
                }
            }
        };
        URLBuilder.prototype.toString = function () {
            var result = "";
            if (this._scheme) {
                result += this._scheme + "://";
            }
            if (this._host) {
                result += this._host;
            }
            if (this._port) {
                result += ":" + this._port;
            }
            if (this._path) {
                if (!this._path.startsWith("/")) {
                    result += "/";
                }
                result += this._path;
            }
            if (this._query && this._query.any()) {
                result += "?" + this._query.toString();
            }
            return result;
        };
        /**
         * If the provided searchValue is found in this URLBuilder, then replace it with the provided
         * replaceValue.
         */
        URLBuilder.prototype.replaceAll = function (searchValue, replaceValue) {
            if (searchValue) {
                this.setScheme(replaceAll(this.getScheme(), searchValue, replaceValue));
                this.setHost(replaceAll(this.getHost(), searchValue, replaceValue));
                this.setPort(replaceAll(this.getPort(), searchValue, replaceValue));
                this.setPath(replaceAll(this.getPath(), searchValue, replaceValue));
                this.setQuery(replaceAll(this.getQuery(), searchValue, replaceValue));
            }
        };
        URLBuilder.parse = function (text) {
            var result = new URLBuilder();
            result.set(text, "SCHEME_OR_HOST");
            return result;
        };
        return URLBuilder;
    }());
    var URLToken = /** @class */ (function () {
        function URLToken(text, type) {
            this.text = text;
            this.type = type;
        }
        URLToken.scheme = function (text) {
            return new URLToken(text, "SCHEME");
        };
        URLToken.host = function (text) {
            return new URLToken(text, "HOST");
        };
        URLToken.port = function (text) {
            return new URLToken(text, "PORT");
        };
        URLToken.path = function (text) {
            return new URLToken(text, "PATH");
        };
        URLToken.query = function (text) {
            return new URLToken(text, "QUERY");
        };
        return URLToken;
    }());
    /**
     * Get whether or not the provided character (single character string) is an alphanumeric (letter or
     * digit) character.
     */
    function isAlphaNumericCharacter(character) {
        var characterCode = character.charCodeAt(0);
        return ((48 /* '0' */ <= characterCode && characterCode <= 57) /* '9' */ ||
            (65 /* 'A' */ <= characterCode && characterCode <= 90) /* 'Z' */ ||
            (97 /* 'a' */ <= characterCode && characterCode <= 122) /* 'z' */);
    }
    /**
     * A class that tokenizes URL strings.
     */
    var URLTokenizer = /** @class */ (function () {
        function URLTokenizer(_text, state) {
            this._text = _text;
            this._textLength = _text ? _text.length : 0;
            this._currentState = state != undefined ? state : "SCHEME_OR_HOST";
            this._currentIndex = 0;
        }
        /**
         * Get the current URLToken this URLTokenizer is pointing at, or undefined if the URLTokenizer
         * hasn't started or has finished tokenizing.
         */
        URLTokenizer.prototype.current = function () {
            return this._currentToken;
        };
        /**
         * Advance to the next URLToken and return whether or not a URLToken was found.
         */
        URLTokenizer.prototype.next = function () {
            if (!hasCurrentCharacter(this)) {
                this._currentToken = undefined;
            }
            else {
                switch (this._currentState) {
                    case "SCHEME":
                        nextScheme(this);
                        break;
                    case "SCHEME_OR_HOST":
                        nextSchemeOrHost(this);
                        break;
                    case "HOST":
                        nextHost(this);
                        break;
                    case "PORT":
                        nextPort(this);
                        break;
                    case "PATH":
                        nextPath(this);
                        break;
                    case "QUERY":
                        nextQuery(this);
                        break;
                    default:
                        throw new Error("Unrecognized URLTokenizerState: " + this._currentState);
                }
            }
            return !!this._currentToken;
        };
        return URLTokenizer;
    }());
    /**
     * Read the remaining characters from this Tokenizer's character stream.
     */
    function readRemaining(tokenizer) {
        var result = "";
        if (tokenizer._currentIndex < tokenizer._textLength) {
            result = tokenizer._text.substring(tokenizer._currentIndex);
            tokenizer._currentIndex = tokenizer._textLength;
        }
        return result;
    }
    /**
     * Whether or not this URLTokenizer has a current character.
     */
    function hasCurrentCharacter(tokenizer) {
        return tokenizer._currentIndex < tokenizer._textLength;
    }
    /**
     * Get the character in the text string at the current index.
     */
    function getCurrentCharacter(tokenizer) {
        return tokenizer._text[tokenizer._currentIndex];
    }
    /**
     * Advance to the character in text that is "step" characters ahead. If no step value is provided,
     * then step will default to 1.
     */
    function nextCharacter(tokenizer, step) {
        if (hasCurrentCharacter(tokenizer)) {
            if (!step) {
                step = 1;
            }
            tokenizer._currentIndex += step;
        }
    }
    /**
     * Starting with the current character, peek "charactersToPeek" number of characters ahead in this
     * Tokenizer's stream of characters.
     */
    function peekCharacters(tokenizer, charactersToPeek) {
        var endIndex = tokenizer._currentIndex + charactersToPeek;
        if (tokenizer._textLength < endIndex) {
            endIndex = tokenizer._textLength;
        }
        return tokenizer._text.substring(tokenizer._currentIndex, endIndex);
    }
    /**
     * Read characters from this Tokenizer until the end of the stream or until the provided condition
     * is false when provided the current character.
     */
    function readWhile(tokenizer, condition) {
        var result = "";
        while (hasCurrentCharacter(tokenizer)) {
            var currentCharacter = getCurrentCharacter(tokenizer);
            if (!condition(currentCharacter)) {
                break;
            }
            else {
                result += currentCharacter;
                nextCharacter(tokenizer);
            }
        }
        return result;
    }
    /**
     * Read characters from this Tokenizer until a non-alphanumeric character or the end of the
     * character stream is reached.
     */
    function readWhileLetterOrDigit(tokenizer) {
        return readWhile(tokenizer, function (character) { return isAlphaNumericCharacter(character); });
    }
    /**
     * Read characters from this Tokenizer until one of the provided terminating characters is read or
     * the end of the character stream is reached.
     */
    function readUntilCharacter(tokenizer) {
        var terminatingCharacters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            terminatingCharacters[_i - 1] = arguments[_i];
        }
        return readWhile(tokenizer, function (character) { return terminatingCharacters.indexOf(character) === -1; });
    }
    function nextScheme(tokenizer) {
        var scheme = readWhileLetterOrDigit(tokenizer);
        tokenizer._currentToken = URLToken.scheme(scheme);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else {
            tokenizer._currentState = "HOST";
        }
    }
    function nextSchemeOrHost(tokenizer) {
        var schemeOrHost = readUntilCharacter(tokenizer, ":", "/", "?");
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentToken = URLToken.host(schemeOrHost);
            tokenizer._currentState = "DONE";
        }
        else if (getCurrentCharacter(tokenizer) === ":") {
            if (peekCharacters(tokenizer, 3) === "://") {
                tokenizer._currentToken = URLToken.scheme(schemeOrHost);
                tokenizer._currentState = "HOST";
            }
            else {
                tokenizer._currentToken = URLToken.host(schemeOrHost);
                tokenizer._currentState = "PORT";
            }
        }
        else {
            tokenizer._currentToken = URLToken.host(schemeOrHost);
            if (getCurrentCharacter(tokenizer) === "/") {
                tokenizer._currentState = "PATH";
            }
            else {
                tokenizer._currentState = "QUERY";
            }
        }
    }
    function nextHost(tokenizer) {
        if (peekCharacters(tokenizer, 3) === "://") {
            nextCharacter(tokenizer, 3);
        }
        var host = readUntilCharacter(tokenizer, ":", "/", "?");
        tokenizer._currentToken = URLToken.host(host);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else if (getCurrentCharacter(tokenizer) === ":") {
            tokenizer._currentState = "PORT";
        }
        else if (getCurrentCharacter(tokenizer) === "/") {
            tokenizer._currentState = "PATH";
        }
        else {
            tokenizer._currentState = "QUERY";
        }
    }
    function nextPort(tokenizer) {
        if (getCurrentCharacter(tokenizer) === ":") {
            nextCharacter(tokenizer);
        }
        var port = readUntilCharacter(tokenizer, "/", "?");
        tokenizer._currentToken = URLToken.port(port);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else if (getCurrentCharacter(tokenizer) === "/") {
            tokenizer._currentState = "PATH";
        }
        else {
            tokenizer._currentState = "QUERY";
        }
    }
    function nextPath(tokenizer) {
        var path = readUntilCharacter(tokenizer, "?");
        tokenizer._currentToken = URLToken.path(path);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else {
            tokenizer._currentState = "QUERY";
        }
    }
    function nextQuery(tokenizer) {
        if (getCurrentCharacter(tokenizer) === "?") {
            nextCharacter(tokenizer);
        }
        var query = readRemaining(tokenizer);
        tokenizer._currentToken = URLToken.query(query);
        tokenizer._currentState = "DONE";
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var DefaultRedirectOptions = {
        handleRedirects: true,
        maxRetries: 20,
    };
    function redirectPolicy(maximumRetries) {
        if (maximumRetries === void 0) { maximumRetries = 20; }
        return {
            create: function (nextPolicy, options) {
                return new RedirectPolicy(nextPolicy, options, maximumRetries);
            },
        };
    }
    var RedirectPolicy = /** @class */ (function (_super) {
        __extends(RedirectPolicy, _super);
        function RedirectPolicy(nextPolicy, options, maxRetries) {
            if (maxRetries === void 0) { maxRetries = 20; }
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.maxRetries = maxRetries;
            return _this;
        }
        RedirectPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request)
                .then(function (response) { return handleRedirect(_this, response, 0); });
        };
        return RedirectPolicy;
    }(BaseRequestPolicy));
    function handleRedirect(policy, response, currentRetries) {
        var request = response.request, status = response.status;
        var locationHeader = response.headers.get("location");
        if (locationHeader &&
            (status === 300 ||
                (status === 301 && ["GET", "HEAD"].includes(request.method)) ||
                (status === 302 && ["GET", "POST", "HEAD"].includes(request.method)) ||
                (status === 303 && "POST" === request.method) ||
                status === 307) &&
            ((request.redirectLimit !== undefined && currentRetries < request.redirectLimit) ||
                (request.redirectLimit === undefined && currentRetries < policy.maxRetries))) {
            var builder = URLBuilder.parse(request.url);
            builder.setPath(locationHeader);
            request.url = builder.toString();
            // POST request with Status code 302 and 303 should be converted into a
            // redirected GET request if the redirect url is present in the location header
            // reference: https://tools.ietf.org/html/rfc7231#page-57 && https://fetch.spec.whatwg.org/#http-redirect-fetch
            if ((status === 302 || status === 303) && request.method === "POST") {
                request.method = "GET";
                delete request.body;
            }
            return policy._nextPolicy
                .sendRequest(request)
                .then(function (res) { return handleRedirect(policy, res, currentRetries + 1); })
                .then(function (res) { return recordRedirect(res, request.url); });
        }
        return Promise.resolve(response);
    }
    function recordRedirect(response, redirect) {
        // This is called as the recursive calls to handleRedirect() unwind,
        // only record the deepest/last redirect
        if (!response.redirected) {
            response.redirected = true;
            response.url = redirect;
        }
        return response;
    }

    function rpRegistrationPolicy(retryTimeout) {
        if (retryTimeout === void 0) { retryTimeout = 30; }
        return {
            create: function (nextPolicy, options) {
                return new RPRegistrationPolicy(nextPolicy, options, retryTimeout);
            },
        };
    }
    var RPRegistrationPolicy = /** @class */ (function (_super) {
        __extends(RPRegistrationPolicy, _super);
        function RPRegistrationPolicy(nextPolicy, options, _retryTimeout) {
            if (_retryTimeout === void 0) { _retryTimeout = 30; }
            var _this = _super.call(this, nextPolicy, options) || this;
            _this._retryTimeout = _retryTimeout;
            return _this;
        }
        RPRegistrationPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request.clone())
                .then(function (response) { return registerIfNeeded(_this, request, response); });
        };
        return RPRegistrationPolicy;
    }(BaseRequestPolicy));
    function registerIfNeeded(policy, request, response) {
        if (response.status === 409) {
            var rpName = checkRPNotRegisteredError(response.bodyAsText);
            if (rpName) {
                var urlPrefix = extractSubscriptionUrl(request.url);
                return (registerRP(policy, urlPrefix, rpName, request)
                    // Autoregistration of ${provider} failed for some reason. We will not return this error
                    // instead will return the initial response with 409 status code back to the user.
                    // do nothing here as we are returning the original response at the end of this method.
                    .catch(function () { return false; })
                    .then(function (registrationStatus) {
                    if (registrationStatus) {
                        // Retry the original request. We have to change the x-ms-client-request-id
                        // otherwise Azure endpoint will return the initial 409 (cached) response.
                        request.headers.set("x-ms-client-request-id", generateUuid());
                        return policy._nextPolicy.sendRequest(request.clone());
                    }
                    return response;
                }));
            }
        }
        return Promise.resolve(response);
    }
    /**
     * Reuses the headers of the original request and url (if specified).
     * @param {WebResourceLike} originalRequest The original request
     * @param {boolean} reuseUrlToo Should the url from the original request be reused as well. Default false.
     * @returns {object} A new request object with desired headers.
     */
    function getRequestEssentials(originalRequest, reuseUrlToo) {
        if (reuseUrlToo === void 0) { reuseUrlToo = false; }
        var reqOptions = originalRequest.clone();
        if (reuseUrlToo) {
            reqOptions.url = originalRequest.url;
        }
        // We have to change the x-ms-client-request-id otherwise Azure endpoint
        // will return the initial 409 (cached) response.
        reqOptions.headers.set("x-ms-client-request-id", generateUuid());
        // Set content-type to application/json
        reqOptions.headers.set("Content-Type", "application/json; charset=utf-8");
        return reqOptions;
    }
    /**
     * Validates the error code and message associated with 409 response status code. If it matches to that of
     * RP not registered then it returns the name of the RP else returns undefined.
     * @param {string} body The response body received after making the original request.
     * @returns {string} The name of the RP if condition is satisfied else undefined.
     */
    function checkRPNotRegisteredError(body) {
        var result, responseBody;
        if (body) {
            try {
                responseBody = JSON.parse(body);
            }
            catch (err) {
                // do nothing;
            }
            if (responseBody &&
                responseBody.error &&
                responseBody.error.message &&
                responseBody.error.code &&
                responseBody.error.code === "MissingSubscriptionRegistration") {
                var matchRes = responseBody.error.message.match(/.*'(.*)'/i);
                if (matchRes) {
                    result = matchRes.pop();
                }
            }
        }
        return result;
    }
    /**
     * Extracts the first part of the URL, just after subscription:
     * https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} url The original request url
     * @returns {string} The url prefix as explained above.
     */
    function extractSubscriptionUrl(url) {
        var result;
        var matchRes = url.match(/.*\/subscriptions\/[a-f0-9-]+\//gi);
        if (matchRes && matchRes[0]) {
            result = matchRes[0];
        }
        else {
            throw new Error("Unable to extract subscriptionId from the given url - " + url + ".");
        }
        return result;
    }
    /**
     * Registers the given provider.
     * @param {RPRegistrationPolicy} policy The RPRegistrationPolicy this function is being called against.
     * @param {string} urlPrefix https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} provider The provider name to be registered.
     * @param {WebResourceLike} originalRequest The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @param {registrationCallback} callback The callback that handles the RP registration
     */
    function registerRP(policy, urlPrefix, provider, originalRequest) {
        var postUrl = urlPrefix + "providers/" + provider + "/register?api-version=2016-02-01";
        var getUrl = urlPrefix + "providers/" + provider + "?api-version=2016-02-01";
        var reqOptions = getRequestEssentials(originalRequest);
        reqOptions.method = "POST";
        reqOptions.url = postUrl;
        return policy._nextPolicy.sendRequest(reqOptions).then(function (response) {
            if (response.status !== 200) {
                throw new Error("Autoregistration of " + provider + " failed. Please try registering manually.");
            }
            return getRegistrationStatus(policy, getUrl, originalRequest);
        });
    }
    /**
     * Polls the registration status of the provider that was registered. Polling happens at an interval of 30 seconds.
     * Polling will happen till the registrationState property of the response body is "Registered".
     * @param {RPRegistrationPolicy} policy The RPRegistrationPolicy this function is being called against.
     * @param {string} url The request url for polling
     * @param {WebResourceLike} originalRequest The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @returns {Promise<boolean>} True if RP Registration is successful.
     */
    function getRegistrationStatus(policy, url, originalRequest) {
        var reqOptions = getRequestEssentials(originalRequest);
        reqOptions.url = url;
        reqOptions.method = "GET";
        return policy._nextPolicy.sendRequest(reqOptions).then(function (res) {
            var obj = res.parsedBody;
            if (res.parsedBody && obj.registrationState && obj.registrationState === "Registered") {
                return true;
            }
            else {
                return delay(policy._retryTimeout * 1000)
                    .then(function () { return getRegistrationStatus(policy, url, originalRequest); });
            }
        });
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function signingPolicy(authenticationProvider) {
        return {
            create: function (nextPolicy, options) {
                return new SigningPolicy(nextPolicy, options, authenticationProvider);
            },
        };
    }
    var SigningPolicy = /** @class */ (function (_super) {
        __extends(SigningPolicy, _super);
        function SigningPolicy(nextPolicy, options, authenticationProvider) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.authenticationProvider = authenticationProvider;
            return _this;
        }
        SigningPolicy.prototype.signRequest = function (request) {
            return this.authenticationProvider.signRequest(request);
        };
        SigningPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this.signRequest(request).then(function (nextRequest) {
                return _this._nextPolicy.sendRequest(nextRequest);
            });
        };
        return SigningPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function systemErrorRetryPolicy(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
        return {
            create: function (nextPolicy, options) {
                return new SystemErrorRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval);
            },
        };
    }
    /**
     * @class
     * Instantiates a new "ExponentialRetryPolicyFilter" instance.
     *
     * @constructor
     * @param {number} retryCount        The client retry count.
     * @param {number} retryInterval     The client retry interval, in milliseconds.
     * @param {number} minRetryInterval  The minimum retry interval, in milliseconds.
     * @param {number} maxRetryInterval  The maximum retry interval, in milliseconds.
     */
    var SystemErrorRetryPolicy = /** @class */ (function (_super) {
        __extends(SystemErrorRetryPolicy, _super);
        function SystemErrorRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
            _this.DEFAULT_CLIENT_RETRY_COUNT = 3;
            _this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
            _this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
            _this.retryCount = typeof retryCount === "number" ? retryCount : _this.DEFAULT_CLIENT_RETRY_COUNT;
            _this.retryInterval =
                typeof retryInterval === "number" ? retryInterval : _this.DEFAULT_CLIENT_RETRY_INTERVAL;
            _this.minRetryInterval =
                typeof minRetryInterval === "number"
                    ? minRetryInterval
                    : _this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
            _this.maxRetryInterval =
                typeof maxRetryInterval === "number"
                    ? maxRetryInterval
                    : _this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
            return _this;
        }
        SystemErrorRetryPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request.clone())
                .catch(function (error) { return retry$1(_this, request, error.response, error); });
        };
        return SystemErrorRetryPolicy;
    }(BaseRequestPolicy));
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param {number} statusCode The HTTP status code.
     * @param {RetryData} retryData  The retry data.
     * @return {boolean} True if the operation qualifies for a retry; false otherwise.
     */
    function shouldRetry$1(policy, retryData) {
        var currentCount;
        if (!retryData) {
            throw new Error("retryData for the SystemErrorRetryPolicyFilter cannot be null.");
        }
        else {
            currentCount = retryData && retryData.retryCount;
        }
        return currentCount < policy.retryCount;
    }
    /**
     * Updates the retry data for the next attempt.
     *
     * @param {RetryData} retryData  The retry data.
     * @param {object} err        The operation"s error, if any.
     */
    function updateRetryData$1(policy, retryData, err) {
        if (!retryData) {
            retryData = {
                retryCount: 0,
                retryInterval: 0,
            };
        }
        if (err) {
            if (retryData.error) {
                err.innerError = retryData.error;
            }
            retryData.error = err;
        }
        // Adjust retry count
        retryData.retryCount++;
        // Adjust retry interval
        var incrementDelta = Math.pow(2, retryData.retryCount) - 1;
        var boundedRandDelta = policy.retryInterval * 0.8 + Math.floor(Math.random() * (policy.retryInterval * 0.4));
        incrementDelta *= boundedRandDelta;
        retryData.retryInterval = Math.min(policy.minRetryInterval + incrementDelta, policy.maxRetryInterval);
        return retryData;
    }
    function retry$1(policy, request, operationResponse, err, retryData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retryData = updateRetryData$1(policy, retryData, err);
                        if (!(err &&
                            err.code &&
                            shouldRetry$1(policy, retryData) &&
                            (err.code === "ETIMEDOUT" ||
                                err.code === "ESOCKETTIMEDOUT" ||
                                err.code === "ECONNREFUSED" ||
                                err.code === "ECONNRESET" ||
                                err.code === "ENOENT"))) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, delay(retryData.retryInterval)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, policy._nextPolicy.sendRequest(request.clone())];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, retry$1(policy, request, operationResponse, error_1, retryData)];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (err) {
                            // If the operation failed in the end, return all errors instead of just the last one
                            return [2 /*return*/, Promise.reject(retryData.error)];
                        }
                        return [2 /*return*/, operationResponse];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    (function (QueryCollectionFormat) {
        QueryCollectionFormat["Csv"] = ",";
        QueryCollectionFormat["Ssv"] = " ";
        QueryCollectionFormat["Tsv"] = "\t";
        QueryCollectionFormat["Pipes"] = "|";
        QueryCollectionFormat["Multi"] = "Multi";
    })(exports.QueryCollectionFormat || (exports.QueryCollectionFormat = {}));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var agentNotSupportedInBrowser = new Error("AgentPolicy is not supported in browser environment");
    function agentPolicy(_agentSettings) {
        return {
            create: function (_nextPolicy, _options) {
                throw agentNotSupportedInBrowser;
            },
        };
    }
    var AgentPolicy = /** @class */ (function (_super) {
        __extends(AgentPolicy, _super);
        function AgentPolicy(nextPolicy, options) {
            var _this = _super.call(this, nextPolicy, options) || this;
            throw agentNotSupportedInBrowser;
        }
        AgentPolicy.prototype.sendRequest = function (_request) {
            throw agentNotSupportedInBrowser;
        };
        return AgentPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var proxyNotSupportedInBrowser = new Error("ProxyPolicy is not supported in browser environment");
    function getDefaultProxySettings(_proxyUrl) {
        return undefined;
    }
    function proxyPolicy(_proxySettings) {
        return {
            create: function (_nextPolicy, _options) {
                throw proxyNotSupportedInBrowser;
            },
        };
    }
    var ProxyPolicy = /** @class */ (function (_super) {
        __extends(ProxyPolicy, _super);
        function ProxyPolicy(nextPolicy, options) {
            var _this = _super.call(this, nextPolicy, options) || this;
            throw proxyNotSupportedInBrowser;
        }
        ProxyPolicy.prototype.sendRequest = function (_request) {
            throw proxyNotSupportedInBrowser;
        };
        return ProxyPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var StatusCodes = Constants.HttpConstants.StatusCodes;
    var DEFAULT_RETRY_COUNT = 3;
    function throttlingRetryPolicy(maxRetries) {
        if (maxRetries === void 0) { maxRetries = DEFAULT_RETRY_COUNT; }
        return {
            create: function (nextPolicy, options) {
                return new ThrottlingRetryPolicy(nextPolicy, options, maxRetries);
            },
        };
    }
    /**
     * To learn more, please refer to
     * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
     * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
     * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
     */
    var ThrottlingRetryPolicy = /** @class */ (function (_super) {
        __extends(ThrottlingRetryPolicy, _super);
        function ThrottlingRetryPolicy(nextPolicy, options, retryLimit) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.retryLimit = retryLimit;
            return _this;
        }
        ThrottlingRetryPolicy.prototype.sendRequest = function (httpRequest) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._nextPolicy.sendRequest(httpRequest.clone()).then(function (response) {
                            return _this.retry(httpRequest, response, 0);
                        })];
                });
            });
        };
        ThrottlingRetryPolicy.prototype.retry = function (httpRequest, httpResponse, retryCount) {
            return __awaiter(this, void 0, void 0, function () {
                var retryAfterHeader, delayInMs, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (httpResponse.status !== StatusCodes.TooManyRequests) {
                                return [2 /*return*/, httpResponse];
                            }
                            retryAfterHeader = httpResponse.headers.get(Constants.HeaderConstants.RETRY_AFTER);
                            if (!(retryAfterHeader && retryCount < this.retryLimit)) return [3 /*break*/, 3];
                            delayInMs = ThrottlingRetryPolicy.parseRetryAfterHeader(retryAfterHeader);
                            if (!delayInMs) return [3 /*break*/, 3];
                            return [4 /*yield*/, delay(delayInMs)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._nextPolicy.sendRequest(httpRequest)];
                        case 2:
                            res = _a.sent();
                            return [2 /*return*/, this.retry(httpRequest, res, retryCount + 1)];
                        case 3: return [2 /*return*/, httpResponse];
                    }
                });
            });
        };
        ThrottlingRetryPolicy.parseRetryAfterHeader = function (headerValue) {
            var retryAfterInSeconds = Number(headerValue);
            if (Number.isNaN(retryAfterInSeconds)) {
                return ThrottlingRetryPolicy.parseDateRetryAfterHeader(headerValue);
            }
            else {
                return retryAfterInSeconds * 1000;
            }
        };
        ThrottlingRetryPolicy.parseDateRetryAfterHeader = function (headerValue) {
            try {
                var now = Date.now();
                var date = Date.parse(headerValue);
                var diff = date - now;
                return Number.isNaN(diff) ? undefined : diff;
            }
            catch (error) {
                return undefined;
            }
        };
        return ThrottlingRetryPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var DEFAULT_AUTHORIZATION_SCHEME = "Bearer";
    /**
     * Resource manager endpoints to match in order to specify a valid scope to the AzureIdentityCredentialAdapter.
     */
    var azureResourceManagerEndpoints = [
        "https://management.windows.net",
        "https://management.chinacloudapi.cn",
        "https://management.usgovcloudapi.net",
        "https://management.cloudapi.de",
    ];
    /**
     * This class provides a simple extension to use {@link TokenCredential} from `@azure/identity` library to
     * use with legacy Azure SDKs that accept {@link ServiceClientCredentials} family of credentials for authentication.
     */
    var AzureIdentityCredentialAdapter = /** @class */ (function () {
        function AzureIdentityCredentialAdapter(azureTokenCredential, scopes) {
            if (scopes === void 0) { scopes = "https://management.azure.com/.default"; }
            this.azureTokenCredential = azureTokenCredential;
            this.scopes = scopes;
        }
        AzureIdentityCredentialAdapter.prototype.getToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var accessToken, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.azureTokenCredential.getToken(this.scopes)];
                        case 1:
                            accessToken = _a.sent();
                            if (accessToken !== null) {
                                result = {
                                    accessToken: accessToken.token,
                                    tokenType: DEFAULT_AUTHORIZATION_SCHEME,
                                    expiresOn: accessToken.expiresOnTimestamp,
                                };
                                return [2 /*return*/, result];
                            }
                            else {
                                throw new Error("Could find token for scope");
                            }
                    }
                });
            });
        };
        AzureIdentityCredentialAdapter.prototype.signRequest = function (webResource) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getToken()];
                        case 1:
                            tokenResponse = _a.sent();
                            webResource.headers.set(Constants.HeaderConstants.AUTHORIZATION, tokenResponse.tokenType + " " + tokenResponse.accessToken);
                            return [2 /*return*/, Promise.resolve(webResource)];
                    }
                });
            });
        };
        return AzureIdentityCredentialAdapter;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * @class
     * Initializes a new instance of the ServiceClient.
     */
    var ServiceClient = /** @class */ (function () {
        /**
         * The ServiceClient constructor
         * @constructor
         * @param {ServiceClientCredentials} [credentials] The credentials object used for authentication.
         * @param {ServiceClientOptions} [options] The service client options that govern the behavior of the client.
         */
        function ServiceClient(credentials, options) {
            if (!options) {
                options = {};
            }
            if (options.baseUri) {
                this.baseUri = options.baseUri;
            }
            var serviceClientCredentials;
            if (isTokenCredential(credentials)) {
                var scope = undefined;
                if ((options === null || options === void 0 ? void 0 : options.baseUri) && azureResourceManagerEndpoints.includes(options === null || options === void 0 ? void 0 : options.baseUri)) {
                    scope = options.baseUri + "/.default";
                }
                serviceClientCredentials = new AzureIdentityCredentialAdapter(credentials, scope);
            }
            else {
                serviceClientCredentials = credentials;
            }
            if (serviceClientCredentials && !serviceClientCredentials.signRequest) {
                throw new Error("credentials argument needs to implement signRequest method");
            }
            this._withCredentials = options.withCredentials || false;
            this._httpClient = options.httpClient || new XhrHttpClient();
            this._requestPolicyOptions = new RequestPolicyOptions(options.httpPipelineLogger);
            var requestPolicyFactories;
            if (Array.isArray(options.requestPolicyFactories)) {
                requestPolicyFactories = options.requestPolicyFactories;
            }
            else {
                requestPolicyFactories = createDefaultRequestPolicyFactories(serviceClientCredentials, options);
                if (options.requestPolicyFactories) {
                    var newRequestPolicyFactories = options.requestPolicyFactories(requestPolicyFactories);
                    if (newRequestPolicyFactories) {
                        requestPolicyFactories = newRequestPolicyFactories;
                    }
                }
            }
            this._requestPolicyFactories = requestPolicyFactories;
        }
        /**
         * Send the provided httpRequest.
         */
        ServiceClient.prototype.sendRequest = function (options) {
            if (options === null || options === undefined || typeof options !== "object") {
                throw new Error("options cannot be null or undefined and it must be of type object.");
            }
            var httpRequest;
            try {
                if (isWebResourceLike(options)) {
                    options.validateRequestProperties();
                    httpRequest = options;
                }
                else {
                    httpRequest = new WebResource();
                    httpRequest = httpRequest.prepare(options);
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
            var httpPipeline = this._httpClient;
            if (this._requestPolicyFactories && this._requestPolicyFactories.length > 0) {
                for (var i = this._requestPolicyFactories.length - 1; i >= 0; --i) {
                    httpPipeline = this._requestPolicyFactories[i].create(httpPipeline, this._requestPolicyOptions);
                }
            }
            return httpPipeline.sendRequest(httpRequest);
        };
        /**
         * Send an HTTP request that is populated using the provided OperationSpec.
         * @param {OperationArguments} operationArguments The arguments that the HTTP request's templated values will be populated from.
         * @param {OperationSpec} operationSpec The OperationSpec to use to populate the httpRequest.
         * @param {ServiceCallback} callback The callback to call when the response is received.
         */
        ServiceClient.prototype.sendOperationRequest = function (operationArguments, operationSpec, callback) {
            if (typeof operationArguments.options === "function") {
                callback = operationArguments.options;
                operationArguments.options = undefined;
            }
            var httpRequest = new WebResource();
            var result;
            try {
                var baseUri = operationSpec.baseUrl || this.baseUri;
                if (!baseUri) {
                    throw new Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a baseUri string property that contains the base URL to use.");
                }
                httpRequest.method = operationSpec.httpMethod;
                httpRequest.operationSpec = operationSpec;
                var requestUrl = URLBuilder.parse(baseUri);
                if (operationSpec.path) {
                    requestUrl.appendPath(operationSpec.path);
                }
                if (operationSpec.urlParameters && operationSpec.urlParameters.length > 0) {
                    for (var _i = 0, _a = operationSpec.urlParameters; _i < _a.length; _i++) {
                        var urlParameter = _a[_i];
                        var urlParameterValue = getOperationArgumentValueFromParameter(this, operationArguments, urlParameter, operationSpec.serializer);
                        urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, getPathStringFromParameter(urlParameter));
                        if (!urlParameter.skipEncoding) {
                            urlParameterValue = encodeURIComponent(urlParameterValue);
                        }
                        requestUrl.replaceAll("{" + (urlParameter.mapper.serializedName || getPathStringFromParameter(urlParameter)) + "}", urlParameterValue);
                    }
                }
                if (operationSpec.queryParameters && operationSpec.queryParameters.length > 0) {
                    for (var _b = 0, _c = operationSpec.queryParameters; _b < _c.length; _b++) {
                        var queryParameter = _c[_b];
                        var queryParameterValue = getOperationArgumentValueFromParameter(this, operationArguments, queryParameter, operationSpec.serializer);
                        if (queryParameterValue != undefined) {
                            queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, getPathStringFromParameter(queryParameter));
                            if (queryParameter.collectionFormat != undefined) {
                                if (queryParameter.collectionFormat === exports.QueryCollectionFormat.Multi) {
                                    if (queryParameterValue.length === 0) {
                                        queryParameterValue = "";
                                    }
                                    else {
                                        for (var index in queryParameterValue) {
                                            var item = queryParameterValue[index];
                                            queryParameterValue[index] = item == undefined ? "" : item.toString();
                                        }
                                    }
                                }
                                else if (queryParameter.collectionFormat === exports.QueryCollectionFormat.Ssv ||
                                    queryParameter.collectionFormat === exports.QueryCollectionFormat.Tsv) {
                                    queryParameterValue = queryParameterValue.join(queryParameter.collectionFormat);
                                }
                            }
                            if (!queryParameter.skipEncoding) {
                                if (Array.isArray(queryParameterValue)) {
                                    for (var index in queryParameterValue) {
                                        if (queryParameterValue[index] !== undefined &&
                                            queryParameterValue[index] !== null) {
                                            queryParameterValue[index] = encodeURIComponent(queryParameterValue[index]);
                                        }
                                    }
                                }
                                else {
                                    queryParameterValue = encodeURIComponent(queryParameterValue);
                                }
                            }
                            if (queryParameter.collectionFormat != undefined &&
                                queryParameter.collectionFormat !== exports.QueryCollectionFormat.Multi &&
                                queryParameter.collectionFormat !== exports.QueryCollectionFormat.Ssv &&
                                queryParameter.collectionFormat !== exports.QueryCollectionFormat.Tsv) {
                                queryParameterValue = queryParameterValue.join(queryParameter.collectionFormat);
                            }
                            requestUrl.setQueryParameter(queryParameter.mapper.serializedName || getPathStringFromParameter(queryParameter), queryParameterValue);
                        }
                    }
                }
                httpRequest.url = requestUrl.toString();
                var contentType = operationSpec.contentType || this.requestContentType;
                if (contentType) {
                    httpRequest.headers.set("Content-Type", contentType);
                }
                if (operationSpec.headerParameters) {
                    for (var _d = 0, _e = operationSpec.headerParameters; _d < _e.length; _d++) {
                        var headerParameter = _e[_d];
                        var headerValue = getOperationArgumentValueFromParameter(this, operationArguments, headerParameter, operationSpec.serializer);
                        if (headerValue != undefined) {
                            headerValue = operationSpec.serializer.serialize(headerParameter.mapper, headerValue, getPathStringFromParameter(headerParameter));
                            var headerCollectionPrefix = headerParameter.mapper
                                .headerCollectionPrefix;
                            if (headerCollectionPrefix) {
                                for (var _f = 0, _g = Object.keys(headerValue); _f < _g.length; _f++) {
                                    var key = _g[_f];
                                    httpRequest.headers.set(headerCollectionPrefix + key, headerValue[key]);
                                }
                            }
                            else {
                                httpRequest.headers.set(headerParameter.mapper.serializedName ||
                                    getPathStringFromParameter(headerParameter), headerValue);
                            }
                        }
                    }
                }
                var options = operationArguments.options;
                if (options) {
                    if (options.customHeaders) {
                        for (var customHeaderName in options.customHeaders) {
                            httpRequest.headers.set(customHeaderName, options.customHeaders[customHeaderName]);
                        }
                    }
                    if (options.abortSignal) {
                        httpRequest.abortSignal = options.abortSignal;
                    }
                    if (options.timeout) {
                        httpRequest.timeout = options.timeout;
                    }
                    if (options.onUploadProgress) {
                        httpRequest.onUploadProgress = options.onUploadProgress;
                    }
                    if (options.onDownloadProgress) {
                        httpRequest.onDownloadProgress = options.onDownloadProgress;
                    }
                }
                httpRequest.withCredentials = this._withCredentials;
                serializeRequestBody(this, httpRequest, operationArguments, operationSpec);
                if (httpRequest.streamResponseBody == undefined) {
                    httpRequest.streamResponseBody = isStreamOperation(operationSpec);
                }
                result = this.sendRequest(httpRequest).then(function (res) {
                    return flattenResponse(res, operationSpec.responses[res.status]);
                });
            }
            catch (error) {
                result = Promise.reject(error);
            }
            var cb = callback;
            if (cb) {
                result
                    // tslint:disable-next-line:no-null-keyword
                    .then(function (res) { return cb(null, res._response.parsedBody, res._response.request, res._response); })
                    .catch(function (err) { return cb(err); });
            }
            return result;
        };
        return ServiceClient;
    }());
    function serializeRequestBody(serviceClient, httpRequest, operationArguments, operationSpec) {
        if (operationSpec.requestBody && operationSpec.requestBody.mapper) {
            httpRequest.body = getOperationArgumentValueFromParameter(serviceClient, operationArguments, operationSpec.requestBody, operationSpec.serializer);
            var bodyMapper = operationSpec.requestBody.mapper;
            var required = bodyMapper.required, xmlName = bodyMapper.xmlName, xmlElementName = bodyMapper.xmlElementName, serializedName = bodyMapper.serializedName;
            var typeName = bodyMapper.type.name;
            try {
                if (httpRequest.body != undefined || required) {
                    var requestBodyParameterPathString = getPathStringFromParameter(operationSpec.requestBody);
                    httpRequest.body = operationSpec.serializer.serialize(bodyMapper, httpRequest.body, requestBodyParameterPathString);
                    var isStream = typeName === MapperType.Stream;
                    if (operationSpec.isXML) {
                        if (typeName === MapperType.Sequence) {
                            httpRequest.body = stringifyXML(prepareXMLRootList(httpRequest.body, xmlElementName || xmlName || serializedName), { rootName: xmlName || serializedName });
                        }
                        else if (!isStream) {
                            httpRequest.body = stringifyXML(httpRequest.body, {
                                rootName: xmlName || serializedName,
                            });
                        }
                    }
                    else if (!isStream) {
                        httpRequest.body = JSON.stringify(httpRequest.body);
                    }
                }
            }
            catch (error) {
                throw new Error("Error \"" + error.message + "\" occurred in serializing the payload - " + JSON.stringify(serializedName, undefined, "  ") + ".");
            }
        }
        else if (operationSpec.formDataParameters && operationSpec.formDataParameters.length > 0) {
            httpRequest.formData = {};
            for (var _i = 0, _a = operationSpec.formDataParameters; _i < _a.length; _i++) {
                var formDataParameter = _a[_i];
                var formDataParameterValue = getOperationArgumentValueFromParameter(serviceClient, operationArguments, formDataParameter, operationSpec.serializer);
                if (formDataParameterValue != undefined) {
                    var formDataParameterPropertyName = formDataParameter.mapper.serializedName || getPathStringFromParameter(formDataParameter);
                    httpRequest.formData[formDataParameterPropertyName] = operationSpec.serializer.serialize(formDataParameter.mapper, formDataParameterValue, getPathStringFromParameter(formDataParameter));
                }
            }
        }
    }
    function isRequestPolicyFactory(instance) {
        return typeof instance.create === "function";
    }
    function getValueOrFunctionResult(value, defaultValueCreator) {
        var result;
        if (typeof value === "string") {
            result = value;
        }
        else {
            result = defaultValueCreator();
            if (typeof value === "function") {
                result = value(result);
            }
        }
        return result;
    }
    function createDefaultRequestPolicyFactories(credentials, options) {
        var factories = [];
        if (options.generateClientRequestIdHeader) {
            factories.push(generateClientRequestIdPolicy(options.clientRequestIdHeaderName));
        }
        if (credentials) {
            if (isRequestPolicyFactory(credentials)) {
                factories.push(credentials);
            }
            else {
                factories.push(signingPolicy(credentials));
            }
        }
        var userAgentHeaderName = getValueOrFunctionResult(options.userAgentHeaderName, getDefaultUserAgentHeaderName);
        var userAgentHeaderValue = getValueOrFunctionResult(options.userAgent, getDefaultUserAgentValue);
        if (userAgentHeaderName && userAgentHeaderValue) {
            factories.push(userAgentPolicy({ key: userAgentHeaderName, value: userAgentHeaderValue }));
        }
        var redirectOptions = __assign(__assign({}, DefaultRedirectOptions), options.redirectOptions);
        if (redirectOptions.handleRedirects) {
            factories.push(redirectPolicy(redirectOptions.maxRetries));
        }
        factories.push(rpRegistrationPolicy(options.rpRegistrationRetryTimeout));
        if (!options.noRetryPolicy) {
            factories.push(exponentialRetryPolicy());
            factories.push(systemErrorRetryPolicy());
            factories.push(throttlingRetryPolicy());
        }
        factories.push(deserializationPolicy(options.deserializationContentTypes));
        var proxySettings = options.proxySettings || getDefaultProxySettings();
        if (proxySettings) {
            factories.push(proxyPolicy());
        }
        if (options.agentSettings) {
            factories.push(agentPolicy(options.agentSettings));
        }
        return factories;
    }
    function getOperationArgumentValueFromParameter(serviceClient, operationArguments, parameter, serializer) {
        return getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, parameter.parameterPath, parameter.mapper, serializer);
    }
    function getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, parameterPath, parameterMapper, serializer) {
        var value;
        if (typeof parameterPath === "string") {
            parameterPath = [parameterPath];
        }
        if (Array.isArray(parameterPath)) {
            if (parameterPath.length > 0) {
                if (parameterMapper.isConstant) {
                    value = parameterMapper.defaultValue;
                }
                else {
                    var propertySearchResult = getPropertyFromParameterPath(operationArguments, parameterPath);
                    if (!propertySearchResult.propertyFound) {
                        propertySearchResult = getPropertyFromParameterPath(serviceClient, parameterPath);
                    }
                    var useDefaultValue = false;
                    if (!propertySearchResult.propertyFound) {
                        useDefaultValue =
                            parameterMapper.required ||
                                (parameterPath[0] === "options" && parameterPath.length === 2);
                    }
                    value = useDefaultValue ? parameterMapper.defaultValue : propertySearchResult.propertyValue;
                }
                // Serialize just for validation purposes.
                var parameterPathString = getPathStringFromParameterPath(parameterPath, parameterMapper);
                serializer.serialize(parameterMapper, value, parameterPathString);
            }
        }
        else {
            if (parameterMapper.required) {
                value = {};
            }
            for (var propertyName in parameterPath) {
                var propertyMapper = parameterMapper.type.modelProperties[propertyName];
                var propertyPath = parameterPath[propertyName];
                var propertyValue = getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, propertyPath, propertyMapper, serializer);
                // Serialize just for validation purposes.
                var propertyPathString = getPathStringFromParameterPath(propertyPath, propertyMapper);
                serializer.serialize(propertyMapper, propertyValue, propertyPathString);
                if (propertyValue !== undefined) {
                    if (!value) {
                        value = {};
                    }
                    value[propertyName] = propertyValue;
                }
            }
        }
        return value;
    }
    function getPropertyFromParameterPath(parent, parameterPath) {
        var result = { propertyFound: false };
        var i = 0;
        for (; i < parameterPath.length; ++i) {
            var parameterPathPart = parameterPath[i];
            // Make sure to check inherited properties too, so don't use hasOwnProperty().
            if (parent != undefined && parameterPathPart in parent) {
                parent = parent[parameterPathPart];
            }
            else {
                break;
            }
        }
        if (i === parameterPath.length) {
            result.propertyValue = parent;
            result.propertyFound = true;
        }
        return result;
    }
    function flattenResponse(_response, responseSpec) {
        var parsedHeaders = _response.parsedHeaders;
        var bodyMapper = responseSpec && responseSpec.bodyMapper;
        var addOperationResponse = function (obj) {
            return Object.defineProperty(obj, "_response", {
                value: _response,
            });
        };
        if (bodyMapper) {
            var typeName = bodyMapper.type.name;
            if (typeName === "Stream") {
                return addOperationResponse(__assign(__assign({}, parsedHeaders), { blobBody: _response.blobBody, readableStreamBody: _response.readableStreamBody }));
            }
            var modelProperties_1 = (typeName === "Composite" && bodyMapper.type.modelProperties) || {};
            var isPageableResponse = Object.keys(modelProperties_1).some(function (k) { return modelProperties_1[k].serializedName === ""; });
            if (typeName === "Sequence" || isPageableResponse) {
                // We're expecting a sequece(array) make sure that the response body is in the
                // correct format, if not make it an empty array []
                var parsedBody = Array.isArray(_response.parsedBody) ? _response.parsedBody : [];
                var arrayResponse = __spreadArrays(parsedBody);
                for (var _i = 0, _a = Object.keys(modelProperties_1); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (modelProperties_1[key].serializedName) {
                        arrayResponse[key] = _response.parsedBody[key];
                    }
                }
                if (parsedHeaders) {
                    for (var _b = 0, _c = Object.keys(parsedHeaders); _b < _c.length; _b++) {
                        var key = _c[_b];
                        arrayResponse[key] = parsedHeaders[key];
                    }
                }
                addOperationResponse(arrayResponse);
                return arrayResponse;
            }
            if (typeName === "Composite" || typeName === "Dictionary") {
                return addOperationResponse(__assign(__assign({}, parsedHeaders), _response.parsedBody));
            }
        }
        if (bodyMapper ||
            _response.request.method === "HEAD" ||
            isPrimitiveType(_response.parsedBody)) {
            // primitive body types and HEAD booleans
            return addOperationResponse(__assign(__assign({}, parsedHeaders), { body: _response.parsedBody }));
        }
        return addOperationResponse(__assign(__assign({}, parsedHeaders), _response.parsedBody));
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function logPolicy(logger) {
        if (logger === void 0) { logger = console.log; }
        return {
            create: function (nextPolicy, options) {
                return new LogPolicy(nextPolicy, options, logger);
            },
        };
    }
    var LogPolicy = /** @class */ (function (_super) {
        __extends(LogPolicy, _super);
        function LogPolicy(nextPolicy, options, logger) {
            if (logger === void 0) { logger = console.log; }
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.logger = logger;
            return _this;
        }
        LogPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy.sendRequest(request).then(function (response) { return logResponse(_this, response); });
        };
        return LogPolicy;
    }(BaseRequestPolicy));
    function logResponse(policy, response) {
        policy.logger(">> Request: " + JSON.stringify(response.request, undefined, 2));
        policy.logger(">> Response status code: " + response.status);
        var responseBody = response.bodyAsText;
        policy.logger(">> Body: " + responseBody);
        return Promise.resolve(response);
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var HeaderConstants = Constants.HeaderConstants;
    var DEFAULT_AUTHORIZATION_SCHEME$1 = "Bearer";
    /**
     * A credentials object that uses a token string and a authorzation scheme to authenticate.
     */
    var TokenCredentials = /** @class */ (function () {
        /**
         * Creates a new TokenCredentials object.
         *
         * @constructor
         * @param {string} token The token.
         * @param {string} [authorizationScheme] The authorization scheme.
         */
        function TokenCredentials(token, authorizationScheme) {
            if (authorizationScheme === void 0) { authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$1; }
            this.authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$1;
            if (!token) {
                throw new Error("token cannot be null or undefined.");
            }
            this.token = token;
            this.authorizationScheme = authorizationScheme;
        }
        /**
         * Signs a request with the Authentication header.
         *
         * @param {WebResourceLike} webResource The WebResourceLike to be signed.
         * @return {Promise<WebResourceLike>} The signed request object.
         */
        TokenCredentials.prototype.signRequest = function (webResource) {
            if (!webResource.headers)
                webResource.headers = new HttpHeaders();
            webResource.headers.set(HeaderConstants.AUTHORIZATION, this.authorizationScheme + " " + this.token);
            return Promise.resolve(webResource);
        };
        return TokenCredentials;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var HeaderConstants$1 = Constants.HeaderConstants;
    var DEFAULT_AUTHORIZATION_SCHEME$2 = "Basic";
    var BasicAuthenticationCredentials = /** @class */ (function () {
        /**
         * Creates a new BasicAuthenticationCredentials object.
         *
         * @constructor
         * @param {string} userName User name.
         * @param {string} password Password.
         * @param {string} [authorizationScheme] The authorization scheme.
         */
        function BasicAuthenticationCredentials(userName, password, authorizationScheme) {
            if (authorizationScheme === void 0) { authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$2; }
            this.authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$2;
            if (userName === null || userName === undefined || typeof userName.valueOf() !== "string") {
                throw new Error("userName cannot be null or undefined and must be of type string.");
            }
            if (password === null || password === undefined || typeof password.valueOf() !== "string") {
                throw new Error("password cannot be null or undefined and must be of type string.");
            }
            this.userName = userName;
            this.password = password;
            this.authorizationScheme = authorizationScheme;
        }
        /**
         * Signs a request with the Authentication header.
         *
         * @param {WebResourceLike} webResource The WebResourceLike to be signed.
         * @returns {Promise<WebResourceLike>} The signed request object.
         */
        BasicAuthenticationCredentials.prototype.signRequest = function (webResource) {
            var credentials = this.userName + ":" + this.password;
            var encodedCredentials = this.authorizationScheme + " " + encodeString(credentials);
            if (!webResource.headers)
                webResource.headers = new HttpHeaders();
            webResource.headers.set(HeaderConstants$1.AUTHORIZATION, encodedCredentials);
            return Promise.resolve(webResource);
        };
        return BasicAuthenticationCredentials;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Authenticates to a service using an API key.
     */
    var ApiKeyCredentials = /** @class */ (function () {
        /**
         * @constructor
         * @param {object} options   Specifies the options to be provided for auth. Either header or query needs to be provided.
         */
        function ApiKeyCredentials(options) {
            if (!options || (options && !options.inHeader && !options.inQuery)) {
                throw new Error("options cannot be null or undefined. Either \"inHeader\" or \"inQuery\" property of the options object needs to be provided.");
            }
            this.inHeader = options.inHeader;
            this.inQuery = options.inQuery;
        }
        /**
         * Signs a request with the values provided in the inHeader and inQuery parameter.
         *
         * @param {WebResource} webResource The WebResource to be signed.
         * @returns {Promise<WebResource>} The signed request object.
         */
        ApiKeyCredentials.prototype.signRequest = function (webResource) {
            if (!webResource) {
                return Promise.reject(new Error("webResource cannot be null or undefined and must be of type \"object\"."));
            }
            if (this.inHeader) {
                if (!webResource.headers) {
                    webResource.headers = new HttpHeaders();
                }
                for (var headerName in this.inHeader) {
                    webResource.headers.set(headerName, this.inHeader[headerName]);
                }
            }
            if (this.inQuery) {
                if (!webResource.url) {
                    return Promise.reject(new Error("url cannot be null in the request object."));
                }
                if (webResource.url.indexOf("?") < 0) {
                    webResource.url += "?";
                }
                for (var key in this.inQuery) {
                    if (!webResource.url.endsWith("?")) {
                        webResource.url += "&";
                    }
                    webResource.url += key + "=" + this.inQuery[key];
                }
            }
            return Promise.resolve(webResource);
        };
        return ApiKeyCredentials;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var TopicCredentials = /** @class */ (function (_super) {
        __extends(TopicCredentials, _super);
        /**
         * Creates a new EventGrid TopicCredentials object.
         *
         * @constructor
         * @param {string} topicKey   The EventGrid topic key
         */
        function TopicCredentials(topicKey) {
            var _this = this;
            if (!topicKey || (topicKey && typeof topicKey !== "string")) {
                throw new Error("topicKey cannot be null or undefined and must be of type string.");
            }
            var options = {
                inHeader: {
                    "aeg-sas-key": topicKey,
                },
            };
            _this = _super.call(this, options) || this;
            return _this;
        }
        return TopicCredentials;
    }(ApiKeyCredentials));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var DomainCredentials = /** @class */ (function (_super) {
        __extends(DomainCredentials, _super);
        /**
         * Creates a new EventGrid DomainCredentials object.
         *
         * @constructor
         * @param {string} domainKey   The EventGrid domain key
         */
        function DomainCredentials(domainKey) {
            var _this = this;
            if (!domainKey || (domainKey && typeof domainKey !== "string")) {
                throw new Error("domainKey cannot be null or undefined and must be of type string.");
            }
            var options = {
                inHeader: {
                    "aeg-sas-key": domainKey,
                },
            };
            _this = _super.call(this, options) || this;
            return _this;
        }
        return DomainCredentials;
    }(ApiKeyCredentials));

    exports.ApiKeyCredentials = ApiKeyCredentials;
    exports.AzureIdentityCredentialAdapter = AzureIdentityCredentialAdapter;
    exports.BaseRequestPolicy = BaseRequestPolicy;
    exports.BasicAuthenticationCredentials = BasicAuthenticationCredentials;
    exports.Constants = Constants;
    exports.DefaultHttpClient = XhrHttpClient;
    exports.DomainCredentials = DomainCredentials;
    exports.HttpHeaders = HttpHeaders;
    exports.MapperType = MapperType;
    exports.RequestPolicyOptions = RequestPolicyOptions;
    exports.RestError = RestError;
    exports.Serializer = Serializer;
    exports.ServiceClient = ServiceClient;
    exports.TokenCredentials = TokenCredentials;
    exports.TopicCredentials = TopicCredentials;
    exports.URLBuilder = URLBuilder;
    exports.URLQuery = URLQuery;
    exports.WebResource = WebResource;
    exports.agentPolicy = agentPolicy;
    exports.applyMixins = applyMixins;
    exports.delay = delay;
    exports.deserializationPolicy = deserializationPolicy;
    exports.deserializeResponseBody = deserializeResponseBody;
    exports.encodeUri = encodeUri;
    exports.executePromisesSequentially = executePromisesSequentially;
    exports.exponentialRetryPolicy = exponentialRetryPolicy;
    exports.flattenResponse = flattenResponse;
    exports.generateClientRequestIdPolicy = generateClientRequestIdPolicy;
    exports.generateUuid = generateUuid;
    exports.getDefaultProxySettings = getDefaultProxySettings;
    exports.getDefaultUserAgentValue = getDefaultUserAgentValue;
    exports.isDuration = isDuration;
    exports.isNode = isNode;
    exports.isValidUuid = isValidUuid;
    exports.logPolicy = logPolicy;
    exports.promiseToCallback = promiseToCallback;
    exports.promiseToServiceCallback = promiseToServiceCallback;
    exports.proxyPolicy = proxyPolicy;
    exports.redirectPolicy = redirectPolicy;
    exports.serializeObject = serializeObject;
    exports.signingPolicy = signingPolicy;
    exports.stripRequest = stripRequest;
    exports.stripResponse = stripResponse;
    exports.systemErrorRetryPolicy = systemErrorRetryPolicy;
    exports.throttlingRetryPolicy = throttlingRetryPolicy;
    exports.userAgentPolicy = userAgentPolicy;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=msRest.browser.js.map
