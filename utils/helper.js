export const imageValidator = (size , mime) => {
    if(bytesToMb(size) > 2){
        return "Image size should be greater than 2 MB"
    
    }
}

export const bytesToMb = (bytes) => {
    return bytes/ 1024 * 1024;
}