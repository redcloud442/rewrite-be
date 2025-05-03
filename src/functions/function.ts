import * as mammoth from "mammoth";
import * as pdfParse from "pdf-parse";

export const textParser = async (file: Express.Multer.File) => {
  let content = "";

  if (file.originalname.endsWith(".pdf")) {
    content = await extractTextFromPdf(file);
  } else if (file.originalname.endsWith(".docx")) {
    content = await extractTextFromDocx(file);
  }

  return content;
};

export const extractTextFromPdf = async (
  file: Express.Multer.File
): Promise<string> => {
  const arrayBuffer = file.buffer;

  if (!arrayBuffer) {
    throw new Error("No array buffer found");
  }

  const data = await pdfParse(arrayBuffer);

  return data.text;
};

export const extractTextFromDocx = async (
  file: Express.Multer.File
): Promise<string> => {
  const data = await mammoth.extractRawText({ buffer: file.buffer });

  return data.value;
};
