// Fonts
export let gMainFont = null;
export let gMainFontStyleNormal = null;
export let gMainFontStyleSmall = null;
export let gMainFontStyleBig = null;


const FONT_FILENAME = 'Jersey10-Regular.ttf';


export async function LoadFonts() {


    gMainFont = await PIXI.Assets.load(`fonts/${FONT_FILENAME}`);


    gMainFontStyleNormal = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 14,
        fill: '#ffffff'
    });

    gMainFontStyleSmall = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 10,
        fill: '#ffffff'
    });

    gMainFontStyleBig = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 64,
        fill: '#ffffff'
    });
}

export function getMainFontStyleNormal() {
    return gMainFontStyleNormal;
}
export function getMainFontStyleSmall() {
    return gMainFontStyleSmall;
}
export function getMainFontStyleBig() {
    return gMainFontStyleBig;
}

