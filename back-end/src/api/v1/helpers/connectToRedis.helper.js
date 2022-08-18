const dotenv = require('dotenv')
dotenv.config()

const Redis = require('ioredis')
// Connect to Redis
const redis = new Redis(process.env.REDIS_URL)
redis.on('error', (err) => {
    console.error('Connect to Redis failed!', err)
})
redis.on('ready', () => {
    console.error('Connect to Redis successfully!')
})

async function getAllKeys() {
    let refreshTokens = {}
    const keys = await redis.keys('*')
    for (key in keys) {
        refreshToken = await redis.get(keys[key])
        refreshTokens[`${keys[key]}`] = refreshToken
    }
    return refreshTokens
}

async function delCache(key) {
    const success = await redis.del(key)
    if (success) {
        console.log(`Delete ${key} is successful!`)
        return key
    } else {
        console.log(`Can't delete! ${key} isn't in Redis cloud!`)
        return null
    }
}

module.exports = {
    redis,
    getAllKeys,
    delCache,
}
