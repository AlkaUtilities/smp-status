"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var config_exports = {};
__export(config_exports, {
  default: () => config_default
});
module.exports = __toCommonJS(config_exports);
var config_default = {
  port: 8080,
  smp: {
    ip: "indihomeSMP.aternos.me",
    port: 36341
  },
  status: {
    channel: "1061088148286877748",
    updateInterval: 5
  },
  icons: {
    author: void 0,
    online: "https://cdn.discordapp.com/attachments/806420483184656404/1061272335220490301/WH6bvW0IMW7GQw4w.png",
    offline: "https://cdn.discordapp.com/attachments/806420483184656404/1061272334830415912/HP0UQKiN0OpNZQBd.png",
    preparing: "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
    loading: "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
    saving: "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
    unreachable: "https://cdn.discordapp.com/attachments/806420483184656404/1061272334830415912/HP0UQKiN0OpNZQBd.png"
  },
  colors: {
    unreachable: "f62424",
    offline: "f62424",
    online: "1fd78d",
    preparing: "a4a4a4",
    loading: "a4a4a4",
    saving: "a4a4a4"
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=config.js.map
