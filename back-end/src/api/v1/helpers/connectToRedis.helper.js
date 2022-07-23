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
    const keys = await redis.keys('*')
    console.log('keys', keys)
}

async function delCache(key) {
    const keys = await redis.del(key)
    console.log(`Delete ${key} is successful!`)
    getAllKeys()
}

// get all data and delete data from Redis Cloud
// getAllKeys()
// delCache('github93632688')

module.exports = {
    redis,
    getAllKeys,
    delCache,
}
