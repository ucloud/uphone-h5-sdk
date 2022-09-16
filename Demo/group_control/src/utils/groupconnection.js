import ucloudrtcController from "../sdk/groupcontroller";
import store from "../store";

function updatelist(phoneList, timeout, isshowlist) {
    let oldphonelist = store.state.phoneList
    console.log("old list length: " + oldphonelist.length);
    let newphonelist = phoneList
    console.log("new list length: " + newphonelist.length);
    if (oldphonelist.length == newphonelist.length) {
        console.log("only update.");
        connection(newphonelist, timeout, isshowlist);
        return;
    }
    let relist = []
    let inlist = []
    for (let i = 0; i < oldphonelist.length; i++) {
        let flag = false
        for (let j = 0; j < newphonelist.length; j++) {
            if (oldphonelist[i].phoneId == newphonelist[j].phoneId) {
                flag = true
                break
            }
        }
        if (!flag) {
            relist.push(oldphonelist[i])
        }

    }
    for (let i = 0; i < newphonelist.length; i++) {
        let flag = false
        for (let j = 0; j < oldphonelist.length; j++) {
            if (newphonelist[i].phoneId == oldphonelist[j].phoneId) {
                flag = true
                break
            }
        }
        if (!flag) {
            inlist.push(newphonelist[i])
        }
    }
    if (!relist.length) {
        store.commit({
            type: 'setPhoneList',
            phoneList: phoneList
        })
        console.log("加")
        connection(inlist, timeout, isshowlist);
    } else {
        store.commit({
            type: 'setPhoneList',
            phoneList: phoneList
        })
        console.log("减")
        disconnection(relist)
        if (isshowlist.length != 0) {
            connection(newphonelist, timeout, isshowlist);
        }
    }
}

function connection(list, timeout, isshowlist) {
    let needconnect = false;
    list.forEach((item, index) => {
        let showflag = "ntos";
        let sendkind = 0; //1:start update 2:stop update 3:keep up
        for (let i = 0; i < isshowlist.length; i++) {
            if (Object.keys(isshowlist[i]) == item.phoneId) {
                showflag = Object.values(isshowlist[i]);
                console.log(Object.keys(isshowlist[i]) + " = " + Object.values(isshowlist[i]));
            }
        }
        if (showflag == "ntos") {
            sendkind = 1;
            needconnect = true;
        } else if (showflag == "htos") {
            sendkind = 1;
        } else if (showflag == "ntoh") {
            sendkind = 3;
            needconnect = true;
        } else if (showflag == "stoh") {
            sendkind = 2;
        } else if (showflag == "stos") {
            sendkind = 3;
        } else if (showflag == "htoh") {
            sendkind = 3;
        }
        let loadingParams = {
            Id: item.phoneId,
            mediaConstraints: {
                audio: false,
                video: true,
            },
        };

        if (needconnect) {
            if (showflag == "ntoh") {
                timeout += 300;
                console.log("rtc connect plus 300ms.");
            }
            creatertcserve(loadingParams, item.phoneId, timeout, sendkind);
            console.log("connection->creatertcserve: " + item.phoneId + " " + sendkind);
        } else {
            let rtc = getrtc(item.phoneId);
            if (rtc) {
                rtc.sendupdatenotice(sendkind);
                console.log("connection->sendupdatenotice: " + item.phoneId + " " + sendkind);
            } else {
                console.log(item.phoneId + " rtc has not been created.");
            }
        }
    })
}

function disconnection(list) {
    try {
        list.forEach((fitem, findex) => {
            store.state.rtclist.forEach((sitem, sindex) => {
                if (fitem.phoneId == sitem.phoneId) {
                    sitem.rtc.Hangup();
                    sitem.icestatus = "disconnected";
                    store.commit("clearRtc", sindex);
                }
            })
        })
    } catch (error) {
        return
    }
}

function creatertcserve(loadingParams, phoneId, timeout, kind = 0) {
    let rtcitem = {
        rtc: null,
        phoneId: ''
    }
    rtcitem.phoneId = phoneId
    rtcitem.rtc = new ucloudrtcController(loadingParams);
    rtcitem.rtc.sendupdatenotice(kind);
    store.commit("setRtcList", rtcitem)
    setTimeout(() => {
        startconnection(rtcitem)
    }, timeout);
}

function startconnection(rtcitem) {
    var count = 0
    var countfir = 0
    var countsec = 0
    rtcitem.rtc.startConnection()
    rtcitem.rtc.onstatus("devicestatus", (states) => {
        if (states == 136) {
            rtcitem.rtc.Hangup()
            rtcitem.icestatus = states
        }
        if (states == 500) {
            rtcitem.icestatus = states
            rtcitem.isresult = false
            rtcitem.rtc.reStart()
        }
        if (states == 1000 || states == 1001 || states == 1002 || states == 1003 || states == 1004 || states == 1005 || states == 1006 || states == 1007 || states == 1008 || states == 1009 || states == 1026 || states == 1027 || states == 1028 || states == 1031 || states == 73002 || states == 90012 || states == 1038) {
            if (rtcitem.icestatus == "connected") {
                console.log("------已经连接成功 ----")
            } else {
                switch (states) {
                    case 1001:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 1003:
                        ++countfir
                        rtcitem.icestatus = states
                        if (countfir == 4) {
                            rtcitem.icestatustext = "设备连接错误"
                        }
                        break;
                    case 1008:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "服务器未响应"
                        break;
                    case 1026:
                        ++count
                        console.log(count)
                        rtcitem.icestatus = states
                        rtcitem.isresult = false
                        if (count == 4) {
                            rtcitem.isresult = true
                            rtcitem.icestatustext = "设备被占用"
                            console.log("finnalcount" + count)
                            return
                        }
                        break;
                    case 1027:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 1028:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 1031:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 1038:
                        rtcitem.icestatus = states
                        break;
                    case 73002:
                        ++countsec
                        rtcitem.icestatus = states
                        if (countsec == 4) {
                            rtcitem.icestatustext = "设备不存在"
                        }
                        break;
                    case 42100:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "请求参数错误"
                        break;
                    case 50000:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "服务器内部错误"
                        break;
                    case 90010:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 90011:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 90012:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    case 90013:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                    default:
                        rtcitem.icestatus = states
                        rtcitem.icestatustext = "网络连接错误"
                        break;
                }
                rtcitem.rtc.reStart()

            }
        }
    });
    //p2p连接状态变更回调
    rtcitem.rtc.onstatus("networkstatus", (states) => {
        console.log(states)
        rtcitem.icestatus = states
        rtcitem.icestatustext = ""
        rtcitem.isresult = false
        if (states == "connected") {
            let stream = rtcitem.rtc.getremotestream()
            rtcitem.stream = stream
        }
        if (states == "new") {
            rtcitem.icestatustext = "网络连接中"
            // rtcitem.icestatustext = "new"
        }
        if (states == "checking") {
            rtcitem.icestatustext = "网络连接中"
            // rtcitem.icestatustext = "checking"
        }
        if (states == "failed") {
            rtcitem.icestatustext = "网络连接中"
            // rtcitem.icestatustext = "failed"
            console.log("连接失败" + rtcitem.phoneId)
            rtcitem.rtc.reStart()
        }
        if (states == "disconnected") {
            // rtcitem.icestatustext = "disconnected"
            rtcitem.icestatustext = "网络连接断开"
            console.log("连接断开" + rtcitem.phoneId)
            rtcitem.rtc.reStart()
        }
    });
}

function getstream(phoneId) {
    let stream
    store.state.rtclist.forEach((item, index) => {
        if (item.phoneId == phoneId) {
            stream = item.stream
        }
    })
    return stream
}

function getrtc(phoneId) {
    let rtc = null;
    store.state.rtclist.forEach((item, index) => {
        if (item.phoneId == phoneId) {
            rtc = item.rtc;
        }
    })
    return rtc;
}

function sendmessage(message, phonelist) {
    phonelist.forEach((pitem, pindex) => {
        store.state.rtclist.forEach((item, index) => {
            if (item.rtc && pitem.phoneId == item.phoneId && pitem.itemchecked == true) {
                item.rtc.sendMessage(message)
            }
        })
    })
}

function groupconnection(phoneList, timeout = 0, isshowlist = []) {
    updatelist(phoneList, timeout, isshowlist);
}

export {
    groupconnection,
    sendmessage,
    getstream,
    getrtc
}