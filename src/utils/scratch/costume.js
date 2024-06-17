const path = require('path')

module.exports = {
    createCostume: (name = "CostumeOne", res = 2, directoryImage, rotX = 0, rotY = 0, customType = "png") => {
        
        path.bas
        return {
            "assetId": directoryImage.replace(/\.[^.]+$/, ''),
            "name": name,
            "bitmapResolution": res,
            "md5ext": directoryImage,
            "dataFormat": customType,
            "rotationCenterX": rotX,
            "rotationCenterY": rotY
          }
          
    }
};