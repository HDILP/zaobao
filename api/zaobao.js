// 注意：移除了 'import fetch from 'node-fetch';' 这一行

// 从 Vercel 环境变量中读取 Token
const ALAPI_TOKEN = process.env.ALAPI_TOKEN;
const API_URL = 'https://v3.alapi.cn/api/zaobao';

export default async function handler(req, res) {
    if (!ALAPI_TOKEN) {
        res.status(500).json({ 
            success: false, 
            message: "Server configuration error: ALAPI_TOKEN is not set in environment variables." 
        });
        return;
    }

    try {
        // *** 核心修改：使用动态 import() 导入 node-fetch ***
        const { default: fetch } = await import('node-fetch');
        // *** node-fetch 变量现在可以使用了 ***

        // 1. 在服务器端调用外部 API
        const response = await fetch(`${API_URL}?token=${ALAPI_TOKEN}&format=json`);
        const data = await response.json();

        // 2. 将外部 API 的数据直接返回给客户端
        res.status(200).json(data);

    } catch (error) {
        console.error('API Fetch Error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch data from external API.", 
            error: error.message 
        });
    }
}
