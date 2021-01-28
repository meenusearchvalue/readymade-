'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const constants = require('../helpers/constants');
const code = constants.RESPONSE_STATUS_CODES;

exports.uploadProfileImage = async (req, res, next) => {
    if(!req.file) {
        return next();
    }

    AWS.config.update({
        accessKeyId: process.env.AWSACCESSKEYID,
        secretAccessKey: process.env.AWSSECRETACCESSKEY
    });

    const s3 = new AWS.S3();
    let folder = req.baseUrl.split('/');
    folder = folder[folder.length -1];
    //configuring parameters
    const params = {
        Bucket: process.env.S3BUCKETNAME,
        Body: fs.createReadStream(req.file.path),
        Key: `${folder}/${Date.now()}_${path.basename(req.file.originalname)}`,
        ACL:'public-read'
    };

    s3.upload(params, (err, data) => {
        //handle error
        if(err){
            res.status(code.STATUS500).send({status: code.STATUS500, msg: 'Error while uploading image!!', err});
        }

        //success
        if(data){
            req.profile_image_path = data.Location;
            if(folder !== 'withdrawal') {
                fs.unlink(req.file.path, (error) => { console.log(error);});
            }
            next();
        }
    });
};


var uploadFile = async(fileName, fileKey) => {
    return new Promise( function(resolve, reject) {
        const params = {
            Bucket: process.env.S3BUCKETNAME,
            Key: fileKey,
            ACL: 'public-read',
            Body: fs.createReadStream(fileName.path),
        };
        AWS.config.update({
            accessKeyId: process.env.AWSACCESSKEYID,
            secretAccessKey: process.env.AWSSECRETACCESSKEY
        });
        const s3 = new AWS.S3();
        s3.upload(params, (s3Err, data) => {
            if (s3Err){
                reject(s3Err);
            }
            fs.unlink(fileName.path, (err) => { console.log(err);});
            resolve(data.Location);
        });
    });
};

exports.upLoadImages = async(req, res, next) => {
    try {
        const uploadFilePromises = [];
        var dataLoc;
        const arr = Object.keys(req.files.profile_image_path);
        for(var i = 0;i < arr.length;i++) {
            const fileKey = `${arr[i]}/${arr[i]}_${req.userData.id}/${req.files[arr[i]][0].originalname}`;
            uploadFilePromises.push(uploadFile(req.files[arr[i]][0], fileKey));
        }
        await Promise.all(uploadFilePromises).then(async(location) => {
            dataLoc = location;
        },
        reason => {
            console.log(reason);
        });
        return dataLoc;
    } catch (error){
        console.log(error);
    }

};


exports.uploadMenuImages = async (req, res, next) => {
    try {
        if(!(req.body.type === 'file') && !(req.files)){
            next();
        }

        AWS.config.update({
            accessKeyId: process.env.AWSACCESSKEYID,
            secretAccessKey: process.env.AWSSECRETACCESSKEY
        });

        const s3 = new AWS.S3();

        let imageArr = req.files && req.files.item_image || req.files && req.files.link;
        imageArr = imageArr && imageArr.length > 0 ? imageArr : [];
        const delImageArr = Array.isArray(req.body.deletefiles) ? JSON.parse(req.body.deletefiles): [];
        /* delete S3 Images */
        const deleteParam = {
            Bucket: process.env.S3BUCKETNAME,
            Delete: { Objects: [], Quiet: false}
        };
        delImageArr.map(imgPath => {
            const fileKey = imgPath.split('amazonaws.com/')[1];
            deleteParam.Delete.Objects.push({Key: fileKey});
        });
        if(deleteParam.Delete.Objects.length > 0){
            await deleteS3Images(s3, deleteParam);
        }
        const uploadImgArr = [];
        /* Upload S3 Images */
        for(const image of imageArr){
            const fileKey = `${image.path}/${image.originalname}`;
            const params = {
                Bucket: process.env.S3BUCKETNAME,
                Key: fileKey,
                ACL: 'public-read',
                Body: fs.createReadStream(image.path),
            };

            uploadImgArr.push(
                new Promise((resolve, reject) => {
                    s3.upload(params, (err, data) => {
                        if(err){
                            reject(err);
                        }
                        resolve(data);
                    });
                })
            );
        }
        await Promise.all(uploadImgArr).then((response) => {
            const result = [];
            for(res of response){
                const imgpath = res.key.split('/').splice(0, res.key.split('/').length -1 ).join('/');
                fs.unlink(imgpath, (err) => console.log(err));
                result.push(res.Location);
            }
            req.imagearray = result;
            req.deletefiles = delImageArr;
            next();
        });
    } catch (error){
        throw new Error(error);
    }
};

exports.uploadMenu = async (req, res, next) => {
    if(!req.file) {
        return next();
    }



    AWS.config.update({
        accessKeyId: process.env.AWSACCESSKEYID,
        secretAccessKey: process.env.AWSSECRETACCESSKEY
    });

    const s3 = new AWS.S3();
    let folder = req.baseUrl.split('/');
    folder = folder[folder.length -1];
    //configuring parameters
    const params = {
        Bucket: process.env.S3BUCKETNAME,
        Body: fs.createReadStream(req.file.path),
        Key: `${folder}/${req.userData.id}/${path.basename(req.file.originalname)}`,
        ACL:'public-read'
    };

    s3.upload(params, (err, data) => {
        //handle error
        if(err){
            console.log('Error', err);
            res.status(code.STATUS500).send({status: code.STATUS500, msg: 'Error while uploading image!!', err});
        }

        //success
        if(data){
            req.menulink = data.Location;
            fs.unlink(req.file.path, (error) => { console.log(error);});
            next();
        }
    });
};


function deleteS3Images(S3, deleteParam){
    return new Promise((resolve, reject) => {
        S3.deleteObjects(deleteParam, (err, data) => {
            if(err){
                reject(err);
            }
            resolve(data);
        });
    });
}
