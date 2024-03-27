import axios from 'axios';
import cloudinary from "cloudinary/lib/cloudinary";


export const handleDeleteFile = (publicId) => {
    cloudinary.config({
        cloud_name: process.env.REACT_APP_CLOUD_NAME,
        api_key: process.env.REACT_APP_API_KEY,
        api_secret: process.env.REACT_APP_API_SECRET
    });
  
    cloudinary.v2.uploader.destroy(publicId, function(error,result) {
        console.log(result, error) });
  };

export function uploadProfileImage(image, setProgress) {
    const config = {
        onUploadProgress: (e) => {
            const {loaded, total} = e;
            setProgress((loaded/total)*100);
        }
    }

    image.append("upload_preset", process.env.REACT_APP_PROFILE_UPLOAD_PRESET);
    const instance = axios.create();
    return instance.post("https://api.cloudinary.com/v1_1/an-najah-national-university/image/upload", image, config);
}

export function uploadPdfFile(pdf, setProgress) {
    const config = {
        onUploadProgress: (e) => {
            const {loaded, total} = e;
            setProgress((loaded/total)*100);
        }
    }


    pdf.append("upload_preset", process.env.REACT_APP_PDF_UPLOAD_PRESET);
    const instance = axios.create();
    return instance.post("https://api.cloudinary.com/v1_1/an-najah-national-university/image/upload", pdf, config);
}

const exportedObject = {
    uploadProfileImage,
    handleDeleteFile,
    uploadPdfFile
};

export default exportedObject;