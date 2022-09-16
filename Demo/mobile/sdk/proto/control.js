/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  ucloud: {
    nested: {
      finger: {
        fields: {
          fid: {
            type: "int32",
            id: 1
          },
          x: {
            type: "float",
            id: 2
          },
          y: {
            type: "float",
            id: 3
          }
        }
      },
      resolution: {
        fields: {
          r: {
            type: "int32",
            id: 1
          },
          w: {
            type: "int32",
            id: 2
          },
          h: {
            type: "int32",
            id: 3
          },
          status: {
            type: "int32",
            id: 4
          }
        }
      },
      version: {
        fields: {
          value: {
            type: "string",
            id: 1
          }
        }
      },
      errmsg: {
        fields: {
          error: {
            type: "int32",
            id: 1
          },
          desc: {
            type: "string",
            id: 2
          }
        }
      },
      gamepad: {
        fields: {
          buttons: {
            type: "int32",
            id: 1
          },
          lx: {
            type: "sint32",
            id: 2
          },
          ly: {
            type: "sint32",
            id: 3
          },
          rx: {
            type: "sint32",
            id: 4
          },
          ry: {
            type: "sint32",
            id: 5
          }
        }
      },
      rtmp: {
        fields: {
          uri: {
            type: "string",
            id: 1
          }
        }
      },
      mouse: {
        fields: {
          x: {
            type: "float",
            id: 1
          },
          y: {
            type: "float",
            id: 2
          }
        }
      },
      kb: {
        fields: {
          v: {
            type: "uint32",
            id: 1
          }
        }
      },
      response: {
        fields: {
          v: {
            type: "uint32",
            id: 1
          }
        }
      },
      secm: {
        fields: {
          v: {
            type: "uint32",
            id: 1
          }
        }
      },
      raw_msg: {
        fields: {
          code: {
            type: "int32",
            id: 1
          },
          msg: {
            type: "google.protobuf.Any",
            id: 2
          },
          motionFs: {
            rule: "repeated",
            type: "finger",
            id: 3
          },
          mousePtr: {
            type: "mouse",
            id: 5
          },
          timestamp: {
            type: "uint64",
            id: 4
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          Any: {
            fields: {
              type_url: {
                type: "string",
                id: 1
              },
              value: {
                type: "bytes",
                id: 2
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;
