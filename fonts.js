// Fonts
export let gMainFont = null;
export let gMainFontStyleNormal = null;
export let gMainFontStyleSmall = null;
export let gMainFontStyleBig = null;
export let gMainFontStyleTitle = null;

const FONT_FILENAME = 'Jersey10-Regular.ttf';


export async function LoadFonts() {


    gMainFont = await PIXI.Assets.load(`fonts/${FONT_FILENAME}`);


    gMainFontStyleNormal = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 20,
        fill: '#ffffff'
    });

    gMainFontStyleSmall = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 14,
        fill: '#ffffff'
    });

    gMainFontStyleBig = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 32,
        fill: '#ffffff'
    });

    gMainFontStyleTitle = new PIXI.TextStyle({
        fontFamily: gMainFont.family,
        fontSize: 96,
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
export function getMainFontStyleTitle() {
    return gMainFontStyleTitle;
}

