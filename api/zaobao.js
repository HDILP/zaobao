const ALAPI_TOKEN = process.env.ALAPI_TOKEN;
const API_URL = 'https://v3.alapi.cn/api/zaobao';

export default async function handler(req, res) {
    // 1. 设置 Vercel CDN 缓存策略 (核心修改)
    // s-maxage=7200: Vercel CDN 缓存 2 小时 (7200秒)
    // stale-while-revalidate=600: 缓存过期后的 10 分钟内，先给旧数据，后台更新缓存
    res.setHeader('Cache-Control', 's-maxage=7200, stale-while-revalidate=600');

    if (!ALAPI_TOKEN) {
        return res.status(500).json({ success: false, message: "Token missing" });
    }

    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(`${API_URL}?token=${ALAPI_TOKEN}&format=json`);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
