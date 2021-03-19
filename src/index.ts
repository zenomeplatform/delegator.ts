
export class Delegates<Prototype extends Object, Arguments extends any[]> {

    public proto: Prototype;

    constructor(proto: Prototype | { prototype: Prototype; new(...args: Arguments): Object; }) {
        if (typeof proto === "function") {
            this.proto = proto.prototype;
        } else {
            this.proto = proto;
        }
    }

    private define(name: string, descriptor: PropertyDescriptor) {
        Object.defineProperty(this.proto, name, {
            configurable: true,
            enumerable: false,
            ...descriptor,
        });
        return this;
    }

    public method(target: string | symbol, name: string, prop: string = name, rebind = false) {
        return this.define(name, {
            value(this: any) {
                const fn = this[target][prop];
                return fn.apply(this[target], arguments);
            }
        });
    }

    public access(target: string | symbol, name: string, prop: string = name) {
        return this.define(name, {
            get(this: any) {
                return this[target][prop];
            },
            set(this: any, val) {
                this[target][prop] = val;
            },
        });
    }

    public getter(target: string | symbol, name: string, prop: string = name) {
        return this.define(name, {
            get(this: any) {
                return this[target][prop];
            }
        });
    }

    public setter(target: string | symbol, name: string, prop: string = name) {
        return this.define(name, {
            set(this: any, val) {
                this[target][prop] = val;
            },
        });
    }

}
