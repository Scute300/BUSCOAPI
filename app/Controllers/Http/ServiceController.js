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
        const data = request.only(['city'])
        if(data.city == null){
            const services= await User.query()
            .with('serviceprofile')
            .fetch()
    
            return response.json({
                data: services
            })

        } else{
            const services= await User.query()
            .where('city', data.city)
            .with('serviceprofile')
            .fetch()
    
            return response.json({
                data: services
            })

        }
    }

    async findservices({request, response}){
        const data = request.only(['city', 'category'])
        if(data.city == null ){
            const services= await User.query()
            .where('category', data.categoty)
            .with('serviceprofile')
            .fetch()
    
            return response.json({
                data: services
            })

        } else {
            const services= await User.query()
            .where('category', data.categoty)
            .where('city', data.city)
            .with('serviceprofile')
            .fetch()
    
            return response.json({
                data: services
            })

        }
    }
}

module.exports = ServiceController
