const { number } = require('joi');
const Joi=require('joi');
const adminUser=require('./../blog');

exports.blogPostValidation= async data =>{
    const regSchema=Joi.object({
        title:Joi.string().max(30).required(),
        description:Joi.string().min(40).max(144).required(),
        createdAt: Joi.date().required()
    })
    return await regSchema.validate(data);
};

