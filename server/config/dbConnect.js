import { Sequelize } from "sequelize";


const sequelize = new Sequelize(
    'smartballot',
    'root',
    'Sidd@07',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)


// Connection Testing
const ConnectDb = async()=>{
    try {

        await sequelize.authenticate();
        console.log('Database Connected Successfully ✅')

    } catch (error) {
        console.log('☠️ Unable to COnnect to Db',error)
    }
}

export {sequelize,ConnectDb}