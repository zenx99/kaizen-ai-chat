
export interface ApiResponse {
  author: string;
  response: string;
}

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`https://kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(message)}&uid=1&webSearch=off&apikey=e62d60dd-8853-4233-bbcb-9466b4cbc265`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: ApiResponse = await response.json();
    return data.response || 'ขออภัย ไม่สามารถรับข้อมูลได้ในขณะนี้';
  } catch (error) {
    console.error('Error calling API:', error);
    return 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง';
  }
};
