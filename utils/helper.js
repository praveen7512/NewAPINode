import { supportedMines } from "../config/filesystem.js";
import  {v4 as uuidv4} from "uuid";
import fs from "fs";

export const imageValidator = (size, mime) => {
    if (bytesToMb(size) >3 ) {
      return "Image size must be less than 2 MB";
    } else if (!supportedMines.includes(mime)) {
      return "Image must be type of png,jpg,jpeg,svg,webp,gif..";
    }
  
    return null;
  };

export const bytesToMb = (bytes) => {
    const mb = bytes / (1024 * 1024); // 1 MB = 1024 * 1024 bytes
    return mb.toFixed(2); 
}

export const generatorRandomNum = ()=> {
    return uuidv4();
}


export const getImageUrl = (imageName) => {
    return `${process.env.APP_URL}/images/${imageName}`
}


export const removeImage = (imageName) => {
    const path = process.cwd() + "/public/images/" + imageName;
    if(fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}



export const uploadImage = (image) => {
    const imgExt = image?.name.split(".");
    const imageName = generatorRandomNum() + "." + imgExt[1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;
    image.mv(uploadPath, (err) => {
      if (err) throw err;
    });
  
    return imageName;
  };