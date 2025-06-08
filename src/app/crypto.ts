import CryptoJS from "crypto-js";

const SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161");
const SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a");

/**
 * 加密方法
 * @param data
 * @returns {string}
 */
// 将 any 类型替换为 unknown 类型
export const encrypt = (data: unknown, type: string = "default"): string => {
  if (typeof data === "object") {
    try {
      data = JSON.stringify(data);
    } catch (error) {
      console.error("encrypt error:", error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data as string);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return type === "default"
    ? encrypted.ciphertext.toString()
    : CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export const decrypt = (data: string): string => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};
