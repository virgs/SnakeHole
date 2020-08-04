import {UrlQueryHandler} from './url-query-handler';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const [dimensionWidth, dimensionHeight] = new UrlQueryHandler().getParameterByName('levelDimension', '25,25').split(',');

const borderThickness = 0.5;
const ratio = Math.min(windowHeight / dimensionHeight, windowWidth / dimensionWidth) - borderThickness;
export const scale: number = Math.min(ratio, 30);
console.log(scale);
