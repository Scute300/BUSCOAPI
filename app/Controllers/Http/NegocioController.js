'use strict'

const Negocio = use('App/Models/Negocio')
const Tag = use('App/Models/Tag')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary')
class NegocioController {
    async newnegocio({ request, response}){
        if(request.user.status !== '413'){
            const data = request.only(['logo', 'portada', 'nombre_negocio', 'categoria', 
            'descripcion', 'latitude', 'longitude', 'tags', 'telefono', 'tiposervicio'])
        
            const rules = {
                logo: 'required|string',
                portada: 'string|required',
                nombre_negocio: 'string|required|max:30|min:10',
                categoria:'string|required|max:20',
                descripcion: 'string|required|min:5|max:50',
                latitude: 'required|number',
                longitude: 'required|number',
                tags :'array',
                telefono: 'string|required|max:10|min:10',
                tiposervicio:'string|required|max:10'
            }
    
            const messages = {
                required: 'Porfavor, llena los campos correctamente',
                string: 'Porfavor, llena los campos correctamente',
                'nombre_negocio.max' : 'El nombre del negocio no puede sobrepasar los 30 caracteres',
                'nombre_negocio.min' : 'El nombre del negocio no puede sobrepasar los 20 caracteres',
                'descripcion.min': 'Descripción no puede ser menor a 5 caracteres',
                'descripcion.max': 'Descripcion no puede ser mayor a 20 caracteres',
            }


            const validation = await validate(data, rules, messages)
    
            if(validation.fails()){
                const message = validation.messages()
                console.log(message)
                let error = message[0]
                
                return response.status(400).json({
                    status: 'wrong',
                    message: error
                })
            } else {
                const logo = await Cloudinary.v2.uploader.upload(data['logo'])
                const portada = await Cloudinary.v2.uploader.upload(data['portada'])

                const negocio = new Negocio()
                negocio.user_id = request.user.message.id
                negocio.nombre_negocio = data.nombre_negocio
                negocio.logo = logo.secure_url
                negocio.portada = portada.secure_url
                negocio.categoria = data.categoria
                negocio.descripcion = data.descripcion
                negocio.latitude = data.latitude
                negocio.longitude = data.longitude
                negocio.telefono = data.telefono
                negocio.tiposervicio = data.tiposervicio
                negocio.logo_secureid = logo.public_id
                negocio.portada_secureid = portada.public_id
                negocio.aprobado = true
                await negocio.save()
                
                if(data.tags.length > 0){
                    for (let index = 0; index < data.tags.length; index++) {
                        const tag = new Tag()
                        tag.negocio_id = negocio.id
                        tag.etiqueta = data.tags[index]
                        await tag.save()
                    }
                }

                return response.json({
                    status: 'sure',
                })

            }
    
        } else{
            return response.status(413).json({
                status : 'unautorized',
                message: request.user.message,
            })
        }
    }


    async obtenernegocios({auth, request, response}){
        const data = request.only(['lat', 'lng'])
        let coords1 ={lat: data.lat + 1, lng : data.lng +1}
        let coords2 ={lat: data.lat - 1, lng : data.lng -1}

        const negocios = await Negocio.query()
        .where('latitude','<',coords1.lat)
        .orWhere('latitude', '>', coords2.lat )
        .andWhere('longitude','<', coords1.lng)
        .orWhere('longitude', '<', coords2.lng )
        .orWhere('latitude', '=', data.lat )
        .orWhere('longitude', '=', data.lng )
        .fetch()

        return response.json({
            status: 'sure',
            data: negocios
        })
        
    }
}

module.exports = NegocioController
