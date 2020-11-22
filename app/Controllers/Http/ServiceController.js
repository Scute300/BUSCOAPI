'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary')
const Banlist = use('App/Models/Banlist')
const axios = use('axios')
const Token = use('App/Models/Token')
const Serviceprofile = use('App/Models/Serviceprofile')

class ServiceController {
    async getallservices({auth, request, response}){
        const data = raquest.only(['city'])
        if(data.city == null){
            const services= await User.query()
            .with('serviceprofile')
    
            return response.json({
                data: services
            })

        } else{
            const services= await User.query()
            .where('city', data.city)
            .with('serviceprofile')
    
            return response.json({
                data: services
            })

        }
    }
}

module.exports = ServiceController
