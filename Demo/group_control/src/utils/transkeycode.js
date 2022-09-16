export default function transKeyCode(key) {
    console.log(key)
    var keyCode = key;
    switch (key) {
        case 8: // Backspace
            keyCode = 0x01000003;
            return keyCode;
        case 9: // Tab Tab
            keyCode = 0x01000001;
            return keyCode;
        case 13: //Enter
            keyCode = 0x01000005;
            return keyCode;
        case 16: //Shift
            keyCode = 0x01000020;
            return keyCode;
        case 17: //Control
            keyCode = 0x01000021;
            return keyCode;
        case 18: // Alt
            keyCode = 0x01000023;
            return keyCode;
        case 20: //capslock
            keyCode = 0x01000024;
            return keyCode;
        case 27: //esc
            keyCode = 0x01000000;
            return keyCode;
        case 32:
            keyCode = 0x20;
            return keyCode;
        case 37: // Left
            keyCode = 0x01000012;
            return keyCode;
        case 38: // Up
            keyCode = 0x01000013;
            return keyCode;
        case 39: // Right
            keyCode = 0x01000014;
            return keyCode;
        case 40: // Down
            keyCode = 0x01000015;
            return keyCode;
        case 45: // Insert
            keyCode = 0x01000006;
            return keyCode;
        case 46: //Delete
            keyCode = 0x01000007;
            return keyCode;

        case 96: // kp 0
            keyCode = 48
            return keyCode;
        case 97: // kp 1
            keyCode = 49
            return keyCode;
        case 98: // kp 2
            keyCode = 50
            return keyCode;
        case 99: // kp 3
            keyCode = 51
            return keyCode;
        case 100: // kp 4
            keyCode = 52
            return keyCode;
        case 101: // kp 5
            keyCode = 53
            return keyCode;
        case 102: // kp 6
            keyCode = 54
            return keyCode;
        case 103: // kp 7
            keyCode = 55
            return keyCode;
        case 104: // kp 8
            keyCode = 56
            return keyCode;
        case 105: // kp 9
            keyCode = 57
            return keyCode;

        case 106: // kp *
            keyCode = 0x62
            return keyCode;
        case 107: // kp +
            keyCode = 0x64
            return keyCode;
        case 108: // kp enter
            keyCode = 0x65
            return keyCode;
        case 109: // kp -
            keyCode = 0x63
            return keyCode;
        case 110: // kp .
            keyCode = 0x2e
            return keyCode;
        case 111: // kp /
            keyCode = 0x61
            return keyCode

            // case 96: // kp 0
            //     keyCode = 0x67
            //     return keyCode;
            // case 97: // kp 1
            //     keyCode = 0x68
            //     return keyCode;
            // case 98: // kp 2
            //     keyCode = 0x69
            //     return keyCode;
            // case 99: // kp 3
            //     keyCode = 0x6a
            //     return keyCode;
            // case 100: // kp 4
            //     keyCode = 0x6b
            //     return keyCode;
            // case 101: // kp 5
            //     keyCode = 0x6c
            //     return keyCode;
            // case 102: // kp 6
            //     keyCode = 0x6d
            //     return keyCode;
            // case 103: // kp 7
            //     keyCode = 0x6e
            //     return keyCode;
            // case 104: // kp 8
            //     keyCode = 0x6f
            //     return keyCode;
            // case 105: // kp 9
            //     keyCode = 0x70
            //     return keyCode;
            // case 106: // kp *
            //     keyCode = 0x62
            //     return keyCode;
            // case 107: // kp +
            //     keyCode = 0x64
            //     return keyCode;
            // case 108: // kp enter
            //     keyCode = 0x65
            //     return keyCode;
            // case 109: // kp -
            //     keyCode = 0x63
            //     return keyCode;
            // case 110: // kp .
            //     keyCode = 0x66
            //     return keyCode;
            // case 111: // kp /
            //     keyCode = 0x61
            //     return keyCode

        case 112: //f1
            keyCode = 0x01000030;
            return keyCode;
        case 113: //f2
            keyCode = 0x01000031;
            return keyCode;
        case 114: //f3
            keyCode = 0x01000032;
            return keyCode;
        case 115: //f4
            keyCode = 0x01000033;
            return keyCode;
        case 116: //f5
            keyCode = 0x01000034;
            return keyCode;
        case 117: //f6
            keyCode = 0x01000035;
            return keyCode;
        case 118: //f7
            keyCode = 0x01000036;
            return keyCode;
        case 119: //f8
            keyCode = 0x01000037;
            return keyCode;
        case 120: //f9
            keyCode = 0x01000038;
            return keyCode;
        case 121: //f10
            keyCode = 0x01000039;
            return keyCode;
        case 122: //f11
            keyCode = 0x0100003a;
            return keyCode;
        case 123: //f12
            keyCode = 0x0100003b;
            return keyCode;
        case 144: //kp numlock
            keyCode = 0x01000025;
            return keyCode;
        case 186: // ;
            keyCode = 0x3b
            return keyCode;
        case 187: // =
            keyCode = 0x3d
            return keyCode
        case 188: //,
            keyCode = 0x2c
            return keyCode;
        case 189: // -
            keyCode = 0x2d
            return keyCode
        case 190: //.
            keyCode = 0x2e
            return keyCode;
        case 191: // /
            keyCode = 0x2f
            return keyCode;
        case 192: // ~
            keyCode = 0x60
            return keyCode
        case 219: //[
            keyCode = 0x5b
            return keyCode
        case 220: // \
            keyCode = 0x5c
            return keyCode
        case 221: // ]
            keyCode = 0x5d
            return keyCode
        case 222: //'
            keyCode = 0x27
            return keyCode

    }
    return keyCode;
}