const { ethers } = require('ethers');

// 从环境变量获取私钥
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
    console.error('错误: 未找到 PRIVATE_KEY 环境变量');
    process.exit(1);
}

try {
    // 确保私钥格式正确（添加 0x 前缀如果没有的话）
    const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
    
    // 从私钥创建钱包
    const wallet = new ethers.Wallet(formattedPrivateKey);
    
    // 获取地址
    const address = wallet.address;
    
    // console.log('私钥:', formattedPrivateKey);
    console.log('地址:', address);
    
} catch (error) {
    console.error('错误: 无效的私钥格式');
    console.error(error.message);
    process.exit(1);
}