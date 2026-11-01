import { randomBytes, scryptSync } from "node:crypto";

const password = process.env.ADMIN_PW;

if (!password) throw new Error("ADMIN_PW 가 필요합니다");

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`${salt}:${hash}`);
