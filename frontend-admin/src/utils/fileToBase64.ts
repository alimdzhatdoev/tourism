const convertFile = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const fileToBase64 = async (file: File): Promise<string> => {
  try {
    const result = await convertFile(file);
    return result as string;
  } catch (error) {
    console.error(error);
    return '';
  }
};
