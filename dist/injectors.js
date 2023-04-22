"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlers = [
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Inject 
        const { providerId } = req.params;
        if (providerId) {
            try {
                const provider = parseInt(providerId, 10);
                if (!provider) {
                    return res.status(404).send(`Provider not found: ${providerId}`);
                }
                //req.provider = provider;
            }
            catch (e) {
                return res
                    .status(500)
                    .send(`Could not retrieve providers: ${providerId}`);
            }
        }
        else {
            return res
                .status(500)
                .send(`No providerId found: ${providerId}`);
        }
        if (next)
            next();
        return null;
    }),
    //Duplicate of above handler, just using explicit types
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Inject 
        const { providerId } = req.params;
        if (providerId) {
            try {
                const provider = parseInt(providerId, 10);
                if (!provider) {
                    return res.status(404).send(`Provider not found: ${providerId}`);
                }
                //req.provider = provider;
            }
            catch (e) {
                return res
                    .status(500)
                    .send(`Could not retrieve providers: ${providerId}`);
            }
        }
        else {
            return res
                .status(500)
                .send(`No providerId found: ${providerId}`);
        }
        if (next)
            next();
        return null;
    }),
];
exports.default = handlers;
