"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
const typeFormatter_1 = require("./formatters/typeFormatter");
const Formatter = (typesLookup) => {
    const typeFormatter = (0, typeFormatter_1.TypeFormatter)(typesLookup);
    return {
        typeFormatter
    };
};
exports.Formatter = Formatter;
