import { fonts } from "src/_layout";

type fontsNames = keyof typeof fonts;
let Fonts = {} as { [P in fontsNames]: P };

for (const font in fonts) {
  Object.assign(Fonts, { [font]: font });
}

export default Fonts;
