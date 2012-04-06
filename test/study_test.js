TestCase("ES5ObjectTest", {
    setUp:function () {
    },
    tearDown:function () {
    },
    "test defineProperty":function () {
        var circle = {};
        Object.defineProperty(circle, "radius", {
            value:4,
            writable:false,
            configurable:false
        });
        assertEquals(4, circle.radius);
        var desc = Object.getOwnPropertyDescriptor(circle, "radius");
        assertEquals(false, desc.configurable);
    },
    "test changing a property descriptor":function () {
        var circle = { radius:3 };
        var descriptor = Object.getOwnPropertyDescriptor(circle, "radius");
        descriptor.configurable = false;
        Object.defineProperty(circle, "radius", descriptor);
        // 削除できない
        delete circle.radius;
        assertEquals(3, circle.radius);
    },
    "test seal":function () {
        var circle = { radius:3 };
        Object.seal(circle);
        // シーリングすると削除できない
        delete circle.radius;
        assertEquals(3, circle.radius);
        assertTrue(Object.isSealed(circle));
    },
    "test seal use strict":function () {
        "use strict";
        var circle = { radius:3 };
        Object.seal(circle);
        // シーリングすると削除できない
        assertException(function () {
            delete circle.radius;
        });
    },
    "test freeze":function () {
        var circle = { radius:3 };
        assertFalse(Object.isSealed(circle));
        Object.freeze(circle);
        // フリーズすると書き込みが無効に
        var desc = Object.getOwnPropertyDescriptor(circle, "radius");
        assertEquals(false, desc.writable);

        circle.radius = 2;
        assertEquals(3, circle.radius);
        assertTrue(Object.isSealed(circle));
    },
    "test getOwnPropertyNames":function () {
        var circle = { radius:3 };
        // すべてのプロパティ名が取得できる
        var properties = Object.getOwnPropertyNames(circle);
        assertEquals(1, properties.length);
        var desc = Object.getOwnPropertyDescriptor(circle, "radius");
        assertEquals(true, desc.configurable);
    },
    "test keys":function () {
        var circle = { radius:3, hoge:1 };
        // keysもすべてのプロパティが取得できる
        var properties = Object.keys(circle);
        assertEquals(2, properties.length);
    },
    "test es3 inheritance via constructors":function () {
        // es3の時の継承方法
        var circle = { radius:3 };
        function CircleProxy() {
        };
        CircleProxy.prototype = circle;
        var sphere = new CircleProxy();
        assert(circle.isPrototypeOf(sphere));
    },
    "test es3 inheritance, es5 style":function () {
        // es5の時の継承方法
        var circle = { radius:3};
        var sphere = Object.create(circle);

        assert(circle.isPrototypeOf(sphere));
        assertEquals(circle, Object.getPrototypeOf(sphere));
    },
    "test Object.create with properties":function () {
        var circle = { radius:1, hoge:1 };
        var sphere = Object.create(circle, {
            radius:{
                value:3,
                writable:false,
                configurable:false,
                enumerable:true
            }
        });

        assertEquals(3, sphere.radius);
        assertEquals(1, sphere.hoge);
    },
    "test get, set":function () {
        var r;
        var sphere = Object.create({}, {
            radius:{
                configurable:false,
                enumerable:true,
                set:function (val) {
                    r = val * 2;
                },
                get:function () {
                    return r;
                }
            }
        });
        sphere.radius = 99;
        assertEquals(99 * 2, sphere.radius);
    },
    "test keyにfunction":function () {
        var circle = { radius:1, hoge:1};
        var hoge = {};
        hoge[circle] = 1;
        assertEquals(1, hoge[circle]);
    },
    "test hasOwnProperty enumerable指定がない場合はhasOwnPropertyはtrue":function () {
        var hash = { a:1, b:2};
        var loopCount = 0;
        for (var prop in hash) {
            assertTrue(hash.hasOwnProperty(prop));
            loopCount++;
        }
        assertEquals(2, loopCount);
    },
    "test hasOwnPropertyにない列挙されないこと":function () {
        var sphere = Object.create({}, {
            radius:{
                value:3,
                writable:false,
                configurable:false,
                enumerable:false
            }
        });
        assertTrue(sphere.hasOwnProperty("radius"));
        var loopCount = 0;
        for (var prop in sphere) {
            loopCount++;
        }

        assertEquals(0, loopCount);
    }
});

