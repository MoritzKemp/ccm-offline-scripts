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

(function(){
    var component = {
        name: "cache_testing",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            "store": [
                "ccm.store",
                {
                    "store":"moritz_kemp_cache_testing",
                    "url":"https://ccm.inf.h-brs.de"
                }
            ],
            "html":{
                "sendDataBtn":{
                    "tag":"button",
                    "type":"button",
                    "inner":"Send Data"
                },
                "fetchDataBtn":{
                    "tag":"button",
                    "type":"button",
                    "inner":"Fetch Data"
                },
                "deleteDataBtn":{
                    "tag":"button",
                    "type":"button",
                    "inner":"Delete All Data"
                }
            }
        },
        Instance: function(){
            const self = this;
            let my = {};
            
            this.ready = function( callback ){
                my = self.ccm.helper.privatize(self);
                if(callback) callback();
            };
            
            this.start = function( callback ){
                renderMsg();
                renderBtn();
                if(callback) callback();
            };
            
            const renderMsg = function(){
                let isLoadedMsg = document.createTextNode('The chache-testing component instance is ready.');
                self.element.appendChild(isLoadedMsg);
            };
            
            const renderBtn = function(){
                let sendBtn = self.ccm.helper.html(my.html.sendDataBtn);
                sendBtn.onclick = pushToRemote;
                self.element.appendChild(sendBtn);
                let fetchBtn = self.ccm.helper.html(my.html.fetchDataBtn);
                fetchBtn.onclick = fetchRemoteData;
                self.element.appendChild(fetchBtn);
                let deleteDataBtn = self.ccm.helper.html(my.html.deleteDataBtn);
                deleteDataBtn.onclick = deleteAllRemoteData;
                self.element.appendChild(deleteDataBtn);
            };
            
            const fetchRemoteData = function(){
                my.store.get("01",function(data){
                    console.log(data);
                });
            };
            
            const pushToRemote = function(){
                data = {
                    "key": "01",
                    "foo": "bar"
                };
                
                my.store.set(data);
            };
            
            const deleteAllRemoteData = function(){
                my.store.get( function( remoteData ){
                    remoteData.forEach(function( data ){
                        my.store.del(data.key);
                    });
                });
            };
        }
    };
    //The following code gets the framework and registers component from above
    function p(){
        window.ccm[v].component(component);
    }
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
    
}());

