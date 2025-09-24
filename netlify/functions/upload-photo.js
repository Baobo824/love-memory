// Netlify Function: 处理图片上传到Cloudinary
const cloudinary = require('cloudinary').v2;

// 配置Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '只允许POST请求' }),
    };
  }

  try {
    // 解析请求体
    const { imageData, caption = '美好回忆' } = JSON.parse(event.body);

    if (!imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '缺少图片数据' }),
      };
    }

    // 上传到Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'love-memory', // 存储在love-memory文件夹中
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' }, // 限制最大尺寸
        { quality: 'auto:good' }, // 自动优化质量
      ],
    });

    // 返回成功结果
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
        caption: caption,
        uploadTime: new Date().toISOString(),
      }),
    };

  } catch (error) {
    console.error('上传失败:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: '图片上传失败: ' + error.message,
      }),
    };
  }
};
