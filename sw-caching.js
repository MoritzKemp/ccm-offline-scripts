/* 
 * The MIT License
 *
 * Copyright 2017 Moritz Kemp <moritz at kemp-thelen.de>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* global self */

const storesToHandle = [
    'moritz_kemp_cache_testing'
];

let jsonpCallbacks = {};
let counter = 0;
let responseData = {};

self.getDatasetsResponse = function( url ){
    return new Promise(function(resolve, reject){
                //store original callback for later use in response
                const originalCallback = url.searchParams.get("callback");
                //remove original callback for new jsonp-request
                url.searchParams.delete("callback");
                //prepare unique jsonp-callback
                const callbackId = "n" + counter++; 
                jsonpCallbacks[callbackId] = function(data){
                    responseData[callbackId] = JSON.stringify(data);
                };
                importScripts(
                    url.protocol +
                    url.hostname + 
                    url.pathname + 
                    "?" +
                    url.searchParams.toString() +
                    "&callback=jsonpCallbacks."+callbackId
                );
                //create response for original referrer
                let response = new Response(
                    originalCallback +
                    "(" + responseData[callbackId] + ")"
                );
                //cleanup
                delete jsonpCallbacks[callbackId];
                delete responseData[callbackId];
                
                resolve(response);
            }).then(function( response ){
                return response;
            });
};

self.addEventListener('fetch', event=>{
    let originalUrl = new URL(event.request.url);
    
    if( originalUrl.searchParams.has("store") &&
        storesToHandle.includes( originalUrl.searchParams.get("store") ) &&
        !/&dataset/.test(originalUrl.search) &&
        !originalUrl.searchParams.has("del")
    ){
        console.log("Catch fetch all");
        event.respondWith(
            self.getDatasetsResponse( originalUrl )
        );
    }
    
    if( 
        originalUrl.searchParams.has("store") &&
        storesToHandle.includes( originalUrl.searchParams.get("store") ) &&
        /&dataset/.test(originalUrl.search)
    ){
        console.log("Catch set");
    }
    
    if(
        originalUrl.searchParams.has("store") &&
        storesToHandle.includes( originalUrl.searchParams.get("store") ) &&
        originalUrl.searchParams.has("del")
    ){
        console.log("Catch delete");
    }
});




