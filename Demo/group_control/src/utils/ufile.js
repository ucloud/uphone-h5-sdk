import instancesec from "./interceptersec"

function UFile(bucketName, bucketUrl, bucketRegion, ProjectId) {

    //API公钥，从控制台里获取
    this.publicKey = "xxx"

    //API私钥，从控制台里获取
    this.privateKey = "xxx"

    // 存储空间名称。既可以在这里配置，也可以在实例化时传参配置。
    // 例如 bucketName = "example-name"
    this.bucketName = bucketName || "";

    // 存储空间域名。既可以在这里配置，也可以在实例化时传参配置。
    // 例如 bucketUrl = "https://example-name.cn-bj.ufileos.com/"
    this.bucketUrl = bucketUrl || "";

    //存储空间区域
    this.bucketRegion = bucketRegion || "";

    //项目id
    this.ProjectId = ProjectId;

    this.createAjax = function (argument) {
        var xmlhttp = {};
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        // 发送二进制数据
        if (!XMLHttpRequest.prototype.sendAsBinary) {
            XMLHttpRequest.prototype.sendAsBinary = function (datastr) {
                function byteValue(x) {
                    return x.charCodeAt(0) & 0xff;
                }
                var ords = Array.prototype.map.call(datastr, byteValue);
                var ui8a = new Uint8Array(ords);
                this.send(ui8a.buffer);
            }
        }

        return xmlhttp;
    };

    this.getBucketUrl = function () {
        var bucketUrl = this.bucketUrl;

        // 如果不是以"/"结尾，则自动补上
        if (bucketUrl.charAt(bucketUrl.length - 1) !== "/") {
            bucketUrl += "/";
        }
        return bucketUrl;
    }

    // 重命名文件
    this.getFileName = function (file, fileRename) {
        var fileName = file.name
        if (fileRename && fileRename != "") {
            fileName = fileRename
        }
        return fileName

    }

}

UFile.prototype.contentMd5 = ""; // 文件的md5
UFile.prototype.slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
UFile.prototype.sliceSize = 4 * 1024 * 1024; // 分片大小为4M
UFile.prototype.getExpired = function (second) {
    return Date.parse(new Date()) / 1000 + (second || 600);
}

// 获取文件管理签名token
UFile.prototype.getUFileToken = function (options, success, error) {

    var url = "?Action=GetUS3UploadTokenWithApiKeys";
    var method = "post";
    var params = {
        Action: "GetUS3UploadTokenWithApiKeys",
        Method: options.method,
        ProjectId: this.ProjectId,
        ApiPublicKey: this.publicKey,
        ApiPrivateKey: this.privateKey,
        Bucket: this.bucketName,
        Key: options.fileName,
        ContentType: options.file.type,
    };
    //console.log("getUFileToken" + JSON.stringify(params));
    var data = {
        data: params
    }

    instancesec({
        url,
        method,
        timeout: options.timeout,
        ...data
    }).then((res) => {
        if (res && res.RetCode === 0) {
            //console.log(JSON.stringify(res));
            success(res.Token);
        }
    }).catch((error) => {
        console.log(error)
    }).finally(() => {
        // loadingInstance.close();
    })
}

UFile.prototype.getDownloadUrl = function (options, success, error) {

    var url = "?Action=GetUS3DownloadUrlWithApiKeys";
    var method = "post";
    var params = {
        Action: "GetUS3DownloadUrlWithApiKeys",
        ApiPublicKey: this.publicKey,
        ApiPrivateKey: this.privateKey,
        ProjectId: this.ProjectId,
        Bucket: this.bucketName,
        Key: options.fileName,
        US3Region: this.bucketRegion,
    };
    var data = {
        data: params
    }

    instancesec({
        url,
        method,
        timeout: options.timeout,
        ...data
    }).then((res) => {
        if (res && res.RetCode === 0) {
            success(res);
        } else {
            error(res);
        }
    }).catch((error) => {
        console.log(error)
    }).finally(() => {
        // loadingInstance.close();
    })
}

// 获取文件列表
UFile.prototype.getFileList = function (options, success, error) {

    var that = this;
    var method = "GET";
    var prefix = options.prefix || that.PREFIX;
    var marker = options.marker || "";
    var limit = options.limit || 20;

    var requestToken = {
        method: method
    };

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + "?list" +
            "&prefix=" + prefix +
            "&marker=" + marker +
            "&limit=" + limit;
        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);

        var onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    success(JSON.parse(ajax.response));
                } else {
                    error(ajax.responseText);
                }
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.send();

    }, error);
}

// 查看文件信息
UFile.prototype.getFileDetail = function (fileName, success, error) {

    var that = this;
    var method = "HEAD";
    var requestToken = {
        method: method,
        fileName: fileName
    };

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + encodeURIComponent(fileName);
        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);

        var onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {

                    var eTag = ajax.getResponseHeader("ETag");
                    var successRes = {
                        contentType: ajax.getResponseHeader("Content-Type"),
                        eTag: eTag.substring(1, eTag.length - 1),
                        status: ajax.status,
                        response: ajax.response
                    };
                    success(successRes);

                } else {
                    error(ajax.responseText);
                }
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.send();

    }, error);
}

// 普通上传
UFile.prototype.uploadFile = function (options, success, error, progress) {
    var that = this;
    var method = "PUT";
    var file = options.file || {};
    //var fileRename = options.fileRename;
    //var fileName = this.addPrefix(this.getFileName(file, fileRename));
    //var putPolicy = options.putPolicy;
    var fileName = file.name;
    var fileType = file.type;
    var fileUid = file.uid

    var requestToken = {
        file: file,
        fileName: fileName,
        method: method
    };

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + fileName;
        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);
        //ajax.setRequestHeader("Content-MD5", that.contentMd5);
        ajax.setRequestHeader("Content-Type", fileType);

        var onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    success({
                        msg: ajax.responseText,
                        file: file,
                        fileUid: fileUid,
                        fileName: fileName
                    });
                } else {
                    error({
                        msg: ajax.responseText,
                        file: file,
                        fileUid: fileUid,
                        fileName: fileName
                    });
                }
            }
        };
        var onprogress = function (event) {
            if (event.lengthComputable) {
                progress({
                    progress: event.loaded / event.total,
                    fileUid: fileUid,
                    fileName: fileName
                });
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.upload.onprogress = onprogress;
        ajax.send(file);

    }, error);
}

// 批量上传
UFile.prototype.batchUpload = function (fileList, success, error, progress) {
    var self = this;
    var successList = [];
    var errorList = [];
    var currentIndex = 0;

    if (fileList.length == 0) {
        console.warn("批量上传列表为空")
        return;
    }

    var successCallBack = function (res) {
        successList.push(res.file);
        success(res);
        if (successList.length == fileList.length) {
            // success(successList);
        } else {
            currentIndex++;
            self.uploadFile({
                file: fileList[currentIndex]
            }, successCallBack, errorCallBack, progressCallBack);
        }
    };

    var errorCallBack = function (res) {
        errorList.push(res.file);
        error(res)
        // if ((successList.length + errorList.length) == fileList.length) {
        //     error({
        //         errorList: errorList,
        //         successList: successList
        //     });
        // }
    };
    var progressCallBack = function (res) {
        progress(res)
    };

    progress(0);
    self.uploadFile({
        file: fileList[currentIndex]
    }, successCallBack, errorCallBack, progressCallBack);
}

// 分片上传（外部调用）
UFile.prototype.sliceUpload = function (options, success, error, progress) {
    var that = this;
    var file = options.file || {};
    var fileName = file.name;
    var fileUid = file.uid
    var fileReader = new FileReader();
    //var chunks = Math.ceil(file.size / this.sliceSize);
    var currentChunk = 0;

    // 初始化分片
    this.initMultipartUpload(function (intResponse) {
        var keyName = intResponse.Key;
        var uploadId = intResponse.UploadId;
        var sliceSize = intResponse.BlkSize;
        var chunks = Math.ceil(file.size / sliceSize);
        var partNumber = 0;
        var requestSuccess = 0; // 各分片请求成功数
        var eTags = "";

        // 每块文件读取完毕之后的处理
        fileReader.onload = function (e) {
            currentChunk++;

            // 如果文件处理完，调用完成分片；否则还有分片则继续处理
            if (currentChunk < chunks) {
                loadNext();
            }
        };

        // 处理单片文件的上传
        function loadNext() {

            var start = currentChunk * sliceSize;
            var end = start + sliceSize >= file.size ? file.size : start + sliceSize;
            var currentFile = that.slice.call(file, start, end, file.type);
            currentFile.name = file.name;

            // 上传各分片
            that.multipartUploading(function (multipartResponse) {
                requestSuccess++;
                if (eTags == "") {
                    eTags = multipartResponse.eTag;
                } else {
                    eTags = eTags + "," + multipartResponse.eTag;
                }

                var sliceCompleted = {
                    status: "uploading",
                    value: requestSuccess / chunks,
                    fileUid: fileUid
                };
                progress(sliceCompleted); // 上传各分片进度

                if (requestSuccess == chunks) {
                    // 完成分片
                    that.multipartUploaded(function (uploaded) {
                        success(uploaded);

                    }, error, progress, keyName, uploadId, file, eTags, fileUid);
                }
            }, error, keyName, uploadId, partNumber, currentFile);

            partNumber++;
            fileReader.readAsArrayBuffer(currentFile);
        }

        loadNext();

    }, error, progress, file, fileName);
}

// 初始化上传（内部调用）
UFile.prototype.initMultipartUpload = function (success, error, progress, file, fileName) {
    var that = this;
    var method = "POST";
    var contentType = file.type || ""; // application/octet-stream
    var requestToken = {
        method: method,
        file: file,
        fileName: fileName,
        md5Required: false
    }
    console.log(JSON.stringify(requestToken));

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + (fileName) + "?uploads";
        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);
        ajax.setRequestHeader("Content-Type", contentType);

        var onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    console.log(JSON.parse(ajax.response));
                    success(JSON.parse(ajax.response));
                } else {
                    error(ajax.responseText);
                }
            }
        };
        var onprogress = function (event) {
            if (event.lengthComputable) {
                var result = {
                    status: "init",
                    value: event.loaded / event.total
                };
                progress(result);
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.upload.onprogress = onprogress;
        ajax.send();

    }, error);
}

// 上传分片（内部调用）
UFile.prototype.multipartUploading = function (success, error, keyName, uploadId, partNumber, file) {
    var that = this;
    var method = "PUT";
    var requestToken = {
        method: method,
        file: file,
        fileName: keyName,
        md5Required: false
    }

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + encodeURIComponent(keyName) +
            "?uploadId=" + uploadId +
            "&partNumber=" + partNumber;
        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);
        ajax.setRequestHeader("Content-Type", file.type);

        var onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    var eTag = ajax.getResponseHeader("ETag");
                    var result = {
                        eTag: eTag.substring(1, eTag.length - 1),
                        response: ajax.response
                    };
                    success(result);
                } else {
                    error(ajax.responseText);
                }
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.send(file);

    }, error);
}

// 完成分片（内部调用）
UFile.prototype.multipartUploaded = function (success, error, progress, keyName, uploadId, file, eTags, fileUid) {
    var that = this;
    var method = "POST";
    var contentType = file.type;
    var requestToken = {
        method: method,
        file: file,
        fileName: keyName,
        md5Required: false,
        contentType: contentType
    };

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + (keyName) + "?uploadId=" + uploadId;

        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);
        ajax.setRequestHeader("Content-Type", contentType);

        var onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    success({
                        responseText: ajax.responseText,
                        file: file,
                        fileName: keyName,
                        fileUid: fileUid
                    });
                } else {
                    error(ajax.responseText);
                }
            }
        };
        var onprogress = function (event) {
            if (event.lengthComputable) {
                var result = {
                    status: "uploaded",
                    value: event.loaded / event.total
                };
                progress(result);
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.upload.onprogress = onprogress;
        ajax.send(eTags);

    }, error);
}

// 表单上传
UFile.prototype.formUpload = function (options, success, error) {
    var that = this;
    var method = "POST";
    var file = options.file || {};
    var fileRename = options.fileRename;
    var fileName = this.addPrefix(this.getFileName(file, fileRename));
    var putPolicy = options.putPolicy

    var requestToken = {
        method: method,
        file: file,
        fileName: fileName,
        putPolicy: putPolicy
    };

    this.getUFileToken(requestToken, function (token) {
        var ajax = that.createAjax();
        var url = that.getBucketUrl() + encodeURIComponent(fileName);
        var reader = new FileReader();

        // FileReader API是异步的,我们需要把读取到的内容存储下来
        reader.addEventListener("load", function () {

            var byteArray = new Uint8Array(reader.result);
            var fileBinary = "";

            for (var i = 0; i < byteArray.length; i++) {
                fileBinary += String.fromCharCode(byteArray[i]);
            }

            file.binary = fileBinary;

            // 虚拟出Blob格式的fileName
            var blobFileName = new Blob([fileName]);
            // Blob格式的fileName的FileReader
            var readerFileName = new FileReader();

            // 取得fileName的特定编码格式
            readerFileName.addEventListener("load", function () {
                var innerByteArray = new Uint8Array(readerFileName.result);
                var innerFileBinary = "";

                for (var i = 0; i < innerByteArray.length; i++) {
                    innerFileBinary += String.fromCharCode(innerByteArray[i]);
                }

                var reFileName = innerFileBinary;

                var boundary = "----UCloudPOSTFormBoundary";
                var data = "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; " + 'name="FileName"' + "\r\n" + "\r\n" +
                    reFileName + "\r\n" +
                    "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; " + 'name="Authorization"' + "\r\n" + "\r\n" +
                    token + "\r\n" +
                    "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; " + 'name="file"; ' + 'filename="' + reFileName + '"' + "\r\n" +
                    "Content-Type: " + file.type + "\r\n" + "\r\n" +
                    file.binary + "\r\n" +
                    "--" + boundary + "--" + "\r\n";

                ajax.open(method, url, true);
                ajax.setRequestHeader("Content-MD5", that.contentMd5);
                ajax.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);

                var onreadystatechange = function () {
                    if (ajax.readyState == 4) {
                        if (ajax.status == 200) {
                            success(ajax.response);
                        } else {
                            error(ajax.response);
                        }
                    }
                };
                ajax.onreadystatechange = onreadystatechange;
                ajax.sendAsBinary(data);

            });

            // 读取Blob格式的fileName
            if (blobFileName) {
                readerFileName.readAsArrayBuffer(blobFileName);
            }
        });

        // 读取文件的二进制内容
        if (file) {
            reader.readAsArrayBuffer(file);
        }

    }, error);
}

// 秒传文件
UFile.prototype.hitUpload = function (file, success, error) {
    var that = this;
    var method = "POST";

    this.getFileDetail(this.addPrefix(file.name), function (fileDetail) {
        var requestToken = {
            method: method,
            file: file,
            md5Required: false
        };

        that.getUFileToken(requestToken, function (token) {

            var ajax = that.createAjax();
            var url = that.getBucketUrl() +
                "uploadhit?Hash=" + fileDetail.eTag +
                "&FileName=" + encodeURIComponent(that.addPrefix(file.name)) +
                "&FileSize=" + file.size;
            ajax.open(method, url, true);
            ajax.setRequestHeader("Authorization", token);
            ajax.setRequestHeader("Content-Type", file.type);

            var onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        success(ajax.responseText);
                    } else {
                        error(ajax.responseText);
                    }
                }
            };

            ajax.onreadystatechange = onreadystatechange;
            ajax.send(file);

        }, error);

    }, error);
}

// 下载文件
UFile.prototype.downloadFile = function (fileName, success, error, progress) {
    var that = this;
    var method = "GET";
    var requestToken = {
        method: method,
        fileName: fileName
    };

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + encodeURIComponent(fileName);
        ajax.open(method, url, true);
        ajax.responseType = "blob";
        ajax.setRequestHeader("Authorization", token);

        var onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    var aTag = document.createElement("a");
                    var blob = ajax.response;

                    aTag.download = fileName;
                    aTag.href = URL.createObjectURL(blob);
                    aTag.click();
                    URL.revokeObjectURL(blob);
                    success(ajax.response);

                } else {
                    error(ajax.response)
                }
            }
        };
        var onprogress = function (event) {
            if (event.lengthComputable) {
                progress(event.loaded / event.total);
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.onprogress = onprogress;
        ajax.send();

    }, error);
}

// 删除文件
UFile.prototype.deleteFile = function (fileName, success, error) {
    var that = this;
    var method = "DELETE";
    var requestToken = {
        method: method,
        fileName: fileName
    };

    this.getUFileToken(requestToken, function (token) {

        var ajax = that.createAjax();
        var url = that.getBucketUrl() + encodeURIComponent(fileName);
        ajax.open(method, url, true);
        ajax.setRequestHeader("Authorization", token);

        var onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 204) {
                    success({
                        msg: ajax.responseText,
                        file: fileName
                    });
                } else {
                    error({
                        msg: ajax.responseText,
                        file: fileName
                    });
                }
            }
        };

        ajax.onreadystatechange = onreadystatechange;
        ajax.send();

    }, error);
}

// 批量删除
UFile.prototype.batchDelete = function (fileList, success, error) {
    var self = this;
    var successList = [];
    var errorList = [];

    if (fileList.length == 0) {
        console.warn("删除列表为空")
        return;
    }

    for (var i = 0; i < fileList.length; i++) {
        var successCallBack = function (res) {
            successList.push(res.file);

            if (successList.length == fileList.length) {
                success(successList)
            }

        };

        var errorCallBack = function (res) {
            errorList.push(res.file);

            if ((successList.length + errorList.length) == fileList) {
                error({
                    successList: successList,
                    errorList: errorList
                })
            }
        }

        this.deleteFile(fileList[i], successCallBack, errorCallBack);
    }

}

export default UFile;