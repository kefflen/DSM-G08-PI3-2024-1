import mongoose from 'mongoose'
import './configs/websockets'
import { env } from './configs/env'

import app from './configs/server'
import { employeeModel } from './models/EmployeeModel'
import { RoleEnum } from './types/RoleEnum'
import { userModel } from './models/UserModel'

mongoose.connect('mongodb://localhost:27017/saudeOn')
  .then(async () => {
    const hasAdmin = await employeeModel.findOne({
      role: RoleEnum.ADMIN
    })

    if (!hasAdmin) {
      const adminUser = await userModel.create({
        cpf: 'undefined',
        data_nascimento: new Date(),
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        gender: 'undefined',
        lastName: 'ADMIN',
        name: 'Admin',
        address: {
          cep: 'undefined',
          street: 'undefined',
          num: 0,
          city: 'undefined',
          uf: 'undefined'
        }
      })

      await employeeModel.create({
        role: RoleEnum.ADMIN,
        user: adminUser._id
      })
    }


    app.listen(env.PORT, () => console.log(`Server runing at: http://localhost:${env.PORT}`))
  })
  .catch(err => {
    console.log(err)
  })