export default function extractColors(str) {

    let re =/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
    return { r: parseInt(re[1], 16), g: parseInt(re[2], 16), b: parseInt(re[3], 16) };
}