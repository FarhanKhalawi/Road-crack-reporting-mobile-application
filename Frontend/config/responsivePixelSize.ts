// Responsive font size function. Takes in a font size and returns a font size that is scaled based on the screen size.
import {Dimensions} from "react-native";

export const responsivePixelSize = (pixelSize: number) => {
    const {width, height} = Dimensions.get('window');
    let scaleFactor: number;

    if (width <= height) {
        scaleFactor = width / 393; // 393 is the width of Figma design mockup.
    } else {
        scaleFactor = height / 852; // 852 is the height of Figma design mockup.
    }

    if (scaleFactor >= 2) {
        scaleFactor = 1.2;
    }
    return Math.round(pixelSize * scaleFactor);
}