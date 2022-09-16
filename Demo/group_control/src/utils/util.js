'use strict';

function $(selector) {
  return document.querySelector(selector);
}

// If async is true, returns a Promise and executes the xhr request
// async. If async is false, the xhr will be executed sync and a
// resolved promise is returned.
export function sendUrlRequest(method, url, async, body) {
  return new Promise(function(resolve, reject) {
    var xhr;
    var reportResults = function() {
      if (xhr.status !== 200) {
        reject(
            Error('Status=' + xhr.status + ', response=' +
                  xhr.responseText));
        return;
      }
      resolve(xhr.responseText);
    };

    xhr = new XMLHttpRequest();
    if (async) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }
        reportResults();
      };
    }
    xhr.open(method, url, async);
    xhr.send(body);

    if (!async) {
      reportResults();
    }
  });
}

export function requestIceServers(iceServerRequestUrl, iceTransports) {
  return new Promise(function(resolve, reject) {
    sendAsyncUrlRequest('POST', iceServerRequestUrl).then(function(response) {
      var iceServerRequestResponse = parseJSON(response);
      if (!iceServerRequestResponse) {
        reject(Error('Error parsing response JSON: ' + response));
        return;
      }
      if (iceTransports !== '') {
        filterIceServersUrls(iceServerRequestResponse, iceTransports);
      }
      trace('Retrieved ICE server information.');
      resolve(iceServerRequestResponse.iceServers);
    }).catch(function(error) {
      reject(Error('ICE server request error: ' + error.message));
      return;
    });
  });
}

// Parse the supplied JSON, or return null if parsing fails.
export function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    trace('Error parsing json: ' + json);
  }
  return null;
}

// Filter a peerConnection config to only contain ice servers with
// transport=|protocol|.
export function filterIceServersUrls(config, protocol) {
  var transport = 'transport=' + protocol;
  var newIceServers = [];
  for (var i = 0; i < config.iceServers.length; ++i) {
    var iceServer = config.iceServers[i];
    var newUrls = [];
    for (var j = 0; j < iceServer.urls.length; ++j) {
      var url = iceServer.urls[j];
      if (url.indexOf(transport) !== -1) {
        newUrls.push(url);
      } else if (
        url.indexOf('?transport=') === -1) {
        newUrls.push(url + '?' + transport);
      }
    }
    if (newUrls.length !== 0) {
      iceServer.urls = newUrls;
      newIceServers.push(iceServer);
    }
  }
  config.iceServers = newIceServers;
}

// Start shims for fullscreen
export function setUpFullScreen() {
  document.cancelFullScreen = document.webkitCancelFullScreen ||
      document.mozCancelFullScreen || document.cancelFullScreen;

  document.body.requestFullScreen = document.body.webkitRequestFullScreen ||
      document.body.mozRequestFullScreen || document.body.requestFullScreen;

  document.onfullscreenchange = document.onfullscreenchange ||
        document.onwebkitfullscreenchange || document.onmozfullscreenchange;
}

export function isFullScreen() {
  return !!(document.webkitIsFullScreen || document.mozFullScreen ||
    document.isFullScreen); // if any defined and true
}

export function fullScreenElement() {
  return document.webkitFullScreenElement ||
      document.webkitCurrentFullScreenElement ||
      document.mozFullScreenElement ||
      document.fullScreenElement;
}

// End shims for fullscreen

// Return a random numerical string.
export function randomString(strLength) {
  var result = [];
  strLength = strLength || 5;
  var charSet = '0123456789';
  while (strLength--) {
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }
  return result.join('');
}

// Calculcates FPS for the provided video elements and calls on a callback which
// is used to update the necessary stats for either remote or local videos.
// Adapted from https://cs.chromium.org/chromium/src/chrome/test/data/media/html/media_stat_perf.html
export function calculateFps(videoElement, decodedFrames, startTime, remoteOrLocal,
  callback) {
  var fps = 0;
  if (videoElement &&
      typeof videoElement.webkitDecodedFrameCount !== undefined) {
    if (videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
      var currentTime = new Date().getTime();
      var deltaTime = (currentTime - startTime) / 1000;
      var startTimeToReturn = currentTime;
      fps = (videoElement.webkitDecodedFrameCount - decodedFrames) / deltaTime;
      callback(videoElement.webkitDecodedFrameCount, startTimeToReturn,
          remoteOrLocal);
    }
  }
  return parseInt(fps);
}

export function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] === '\n') {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ' + text);
  } else {
    console.log(text);
  }
}

export function toChineseWords(data){
  if(data == '' || typeof data == 'undefined') 
    return '请输入十六进制unicode';
  var chData = data.split('\\u');
  var str = '';
  for(var i=0; i<chData.length; i++){
    str += String.fromCharCode(parseInt(chData[i],16).toString(10));
  }
  return str;
}