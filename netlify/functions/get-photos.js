// Netlify Function: 获取Cloudinary中的所有照片
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // 只允许GET请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '只允许GET请求' }),
    };
  }

  try {
    // 获取love-memory文件夹中的所有图片
    const result = await cloudinary.search
      .expression('folder:love-memory')
      .sort_by([['created_at', 'desc']]) // 按创建时间降序排列
      .max_results(50) // 最多返回50张图片
      .execute();

    // 处理图片数据
    const photos = result.resources.map(photo => ({
      id: photo.public_id,
      url: photo.secure_url,
      thumbnail: cloudinary.url(photo.public_id, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto:good',
      }),
      caption: photo.context?.caption || '美好回忆',
      uploadTime: photo.created_at,
      width: photo.width,
      height: photo.height,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        photos: photos,
        total: result.total_count,
      }),
    };

  } catch (error) {
    console.error('获取照片失败:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: '获取照片失败: ' + error.message,
      }),
    };
  }
};
