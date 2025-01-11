import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text);
    return qrCodeDataURL;
  } catch (err) {
    console.error("Failed to generate QR Code:", err);
    throw err;
  }
};
