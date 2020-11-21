'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary')
const Banlist = use('App/Models/Banlist')
const axios = use('axios')
const Token = use('App/Models/Token')
const Serviceprofile = use('App/Models/Serviceprofile')

class UserController {

    async login ({ request, response }) {
        try{
            const data = request.only(['type','token'])
    
            const rules = {
                type: 'required|string',
                token: 'string|required',
            }
    
            const messages = {
                required: 'Porfavor, llena los campos correctamente',
                string: 'Porfavor, llena los campos correctamente',
                }
    
    
            const validation = await validate(data, rules, messages)
    
            if(validation.fails()){
                console.log(error)
                const message = validation.messages()
                let error = message[0]
    
                return response.status(400).json({
                    status: 'wrong',
                    message: error
                })
            } else {
    
                let usuario = {response : false, email:'', name: '', username: '', token: '', id: ''}
                
                switch(data.type){
                    case 'go':
                        await axios.get('https://www.googleapis.com/userinfo/v2/me', {
                        headers: { Authorization: `Bearer ${data.token}` },
                        }).then(response =>{
                        usuario = {response : true, email:response.data.email != null ? response.data.email : 'Not email adress', 
                            name: response.data.name, username: response.data.given_name, token : data.token, id:response.data.id}
                        
                        })
                        break;
                    case 'fb':
                        await axios.get(`https://graph.facebook.com/me?access_token=${data.token}`)
                        .then(response =>{
                        usuario = {response : true, email: response.data.email != null ? response.data.email : 'Not email adress',
                        name: response.data.name, username: response.data.name, token : data.token, id:response.data.id}
                        
                        })
                    break;
                }
    
                const token = data.token
                let newtoken = await Token.findBy('session_id', data.type+usuario.id)
                const registerverify = await User.findBy('social_type', data.type+usuario.id)
    
                if(registerverify !== null && usuario.response == true){
                    const banverify = await Banlist.findBy('user_id', registerverify.id)
                    if(banverify == null){
                        if(newtoken !== null){
                            newtoken.user_id = registerverify.id
                            newtoken.session_id = data.type+usuario.id
                            newtoken.token = data.type+token
                            await newtoken.save()
        
                            return response.json({
                                status : 'sure',
                                token: newtoken.token,
                                user: registerverify
                            })
                        } else {
                            newtoken.user_id = registerverify.id
                            newtoken.session_id = data.type+usuario.id
                            newtoken.token = data.type+token
                            await newtoken.save()
        
                            return response.json({
                                status : 'sure',
                                token: newtoken.token,
                            })
                        }
                    } else {
                        return response.status(413).json({
                            status : 'ban',
                            message : `You're Banned for ${banverify.reason}`
                        })
                    }
                }else{
                    switch(usuario.response){
                        case true:
                         const user = await new User()
                         user.name = usuario.name
                         user.username = data.type+usuario.id
                         user.social_type = data.type+usuario.id
                         user.email = data.email
                         await user.save()
     
                         newtoken = await new Token()
                         newtoken.user_id = user.id
                         newtoken.session_id = data.type+usuario.id
                         newtoken.token = data.type+token
                         await newtoken.save()
    
                         return response.json({
                             status : 'sure',
                             token : newtoken.token,
                         })
     
                       case false:{
                         return response.status(413).json({
                             status : 'wrong',
                             message: 'Token unautorized'
                         })
                       }
                     }
                } 
            }

        } catch(error){
            console.log(error)
        }
    }


//Metodo "me"
    async me ({ request, response }) {
        const service = await Serviceprofile.findBy('user_id', request.user.id)
        if (service == null ){
            return response.json({
                status: 'sure',
                data: request.user,
                service: false
            })
        } else{
            return response.json({
                status: 'sure',
                data: request.user,
                service: service
            })
            
        }

    }

    async updateProfilePic({ request, auth, response }) {
        const user = request.user
        try{
            const userData = request.only(['avatar']);
            
            if(user.avatar !== 'https://res.cloudinary.com/dukgqrudk/image/upload/v1605969531/no-avatar-png-8_sbc3tp.png'){
            
            const image = user.avatarpublicid
            await Cloudinary.v2.uploader.destroy(image)

            }
            const avatar = userData['avatar'];
            const resultado = await Cloudinary.v2.uploader.upload(avatar);

            user.avatar = resultado.secure_url
            user.avatarpublicid = resultado.public_id
            await user.save()

            return response.json({
                status: 'success',
                data: user
            })
        }catch(error){
            console.log(error)
            return response.status(404).json({
                status: 'wrong',
                message: 'No puedes actualizar por ahora'
            })
        }
    }

    async editprofile({auth, request,response}){
        const data = request.only(['name', 'cumpleaños', 'wanttobeservice', 'bio', 'category', 'phonenumber', 'city'])
        let rules = undefined
        let messages = undefined

        if( typeof(data.wantobeservice) !== 'boolean' ){
            return response.status(401).json({
                status: 'wrong'
            })
        }

        if(data.wantobeservice == true){
        
            rules = {
                name: 'min:8|string|max:25|alpha|required',
                cumpleaños: 'min:8|string|max:8|required',       
                phonenumber: 'min:10|max:10|string|required',
                category: 'min:15|max:15|string|required',
                bio: 'min:15|max:200|required',
                wantobeservice: 'boolean|required',
                city: 'min:15|max:60|required',
            }

            messages = {
            required: 'Llenar todos los campos es requerido si quieres ofrecer un servicio',
            'name.min': 'Nombre debe tener al menos 8 caracteres',
            'name.max':'Nombre no debe exceder 25 caracteres',
            'name.alpha': 'Nombre no puede contener simbolos',
            'cumpleaños.min' : 'Llena tu fecha de nacimiento correctamente',
            'cumpleaños.max' : 'Llena tu fecha de nacimiento correctamente',
            'bio.max' : 'Biografia no debe exceder 100 caracteres'
            }

        } else{
        
            rules = {
                name: 'string|max:25|alpha',
                cumpleaños: 'string|max:8',       
                phonenumber: 'max:10' ,
                wantobeservice: 'boolean|required', 
                city: 'string|max:60'  
            }

        }

        const validation = await validate(data, rules, messages)
        if(validation.fails()){

            const message = validation.messages()
            let error = message[0]
            return response.status(400).json({
                status: 'wrong',
                message: error.message
            })
        }
        
        const user = request.user
        
        if(data.wantobeservice == true){
            let service  = await Serviceprofile.findBy('user_id', user.id)
            if(service == null){
                service = await new Serviceprofile()
                service.user_id = user.id
                service.category = data.category
                service.bio = data.bio
                await service.save()

            } else {
                service.user_id = user.id
                service.category = data.category
                service.bio = data.bio
                await service.save()
            }
        }
        
        user.name = data.name
        user.cumpleaños = data.cumpleaños
        user.phonenumber = data.phonenumber
        user.city = data.city
        user.is_Service = data.wantobeservice
        await user.save()
        
        return response.json({
            status: 'sure',
            data:user
        })



    }
  
    
}

module.exports = UserController

