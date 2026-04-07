import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ valid: false, error: 'Method Not Allowed' });
    }

    const { code, machine } = req.query;

    if (!code || !machine) {
        return res.status(200).json({ valid: false, error: '缺少参数' });
    }

    // 预先生成的 16 位授权码池（你可以在这里添加更多）
    const validCodes = new Set([
        "A1B2C3D4E5F6G7H8",
        "X9Y8Z7W6V5U4T3S2"
    ]);

    if (!validCodes.has(code)) {
        return res.status(200).json({ valid: false, error: '授权码无效' });
    }

    const key = `license:${code}`;
    let record = await kv.get(key);

    if (!record) {
        // 第一次激活：绑定机器码，设置一年后过期
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        const newRecord = {
            machineCode: machine,
            activatedAt: Date.now(),
            expireAt: expireDate.getTime()
        };
        await kv.set(key, JSON.stringify(newRecord));
        return res.status(200).json({ valid: true, expire: expireDate.toISOString().slice(0,10) });
    }

    // 已激活过：检查机器码和有效期
    const data = JSON.parse(record);
    if (data.machineCode !== machine) {
        return res.status(200).json({ valid: false, error: '该授权码已在其他设备上激活' });
    }
    if (Date.now() > data.expireAt) {
        return res.status(200).json({ valid: false, error: '授权码已过期' });
    }

    return res.status(200).json({ valid: true, expire: new Date(data.expireAt).toISOString().slice(0,10) });
}
