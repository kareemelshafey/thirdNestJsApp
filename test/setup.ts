import { rm } from 'fs/promises'
import { join } from 'path'
import { getConnection } from 'typeorm'

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'))
    } catch (err) {}
})

// to run two signup after each other, you need to disconnect the database
global.afterEach(async () =>{
    const conn = await getConnection();
    await conn.close();
})