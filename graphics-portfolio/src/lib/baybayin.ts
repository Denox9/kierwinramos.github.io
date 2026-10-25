/*! RX09 Baybayin engine (TS port of window.RX09Baybayin v1.0)
 * Glyph outlines: angular derivative of Noto Sans Tagalog — SIL OFL 1.1 */

// Latin syllable key -> Unicode Baybayin (U+1700 block)
export const BB_UNICODE: Record<string, string> = {"a":"ᜀ","i":"ᜁ","u":"ᜂ","e":"ᜁ","o":"ᜂ","ka":"ᜃ","ki":"ᜃᜒ","ku":"ᜃᜓ","k":"ᜃ᜔","k_p":"ᜃ᜕","ke":"ᜃᜒ","ko":"ᜃᜓ","ga":"ᜄ","gi":"ᜄᜒ","gu":"ᜄᜓ","g":"ᜄ᜔","g_p":"ᜄ᜕","ge":"ᜄᜒ","go":"ᜄᜓ","nga":"ᜅ","ngi":"ᜅᜒ","ngu":"ᜅᜓ","ng":"ᜅ᜔","ng_p":"ᜅ᜕","nge":"ᜅᜒ","ngo":"ᜅᜓ","ta":"ᜆ","ti":"ᜆᜒ","tu":"ᜆᜓ","t":"ᜆ᜔","t_p":"ᜆ᜕","te":"ᜆᜒ","to":"ᜆᜓ","da":"ᜇ","di":"ᜇᜒ","du":"ᜇᜓ","d":"ᜇ᜔","d_p":"ᜇ᜕","de":"ᜇᜒ","do":"ᜇᜓ","na":"ᜈ","ni":"ᜈᜒ","nu":"ᜈᜓ","n":"ᜈ᜔","n_p":"ᜈ᜕","ne":"ᜈᜒ","no":"ᜈᜓ","pa":"ᜉ","pi":"ᜉᜒ","pu":"ᜉᜓ","p":"ᜉ᜔","p_p":"ᜉ᜕","pe":"ᜉᜒ","po":"ᜉᜓ","ba":"ᜊ","bi":"ᜊᜒ","bu":"ᜊᜓ","b":"ᜊ᜔","b_p":"ᜊ᜕","be":"ᜊᜒ","bo":"ᜊᜓ","ma":"ᜋ","mi":"ᜋᜒ","mu":"ᜋᜓ","m":"ᜋ᜔","m_p":"ᜋ᜕","me":"ᜋᜒ","mo":"ᜋᜓ","ya":"ᜌ","yi":"ᜌᜒ","yu":"ᜌᜓ","y":"ᜌ᜔","y_p":"ᜌ᜕","ye":"ᜌᜒ","yo":"ᜌᜓ","ra":"ᜍ","ri":"ᜍᜒ","ru":"ᜍᜓ","r":"ᜍ᜔","r_p":"ᜍ᜕","re":"ᜍᜒ","ro":"ᜍᜓ","la":"ᜎ","li":"ᜎᜒ","lu":"ᜎᜓ","l":"ᜎ᜔","l_p":"ᜎ᜕","le":"ᜎᜒ","lo":"ᜎᜓ","wa":"ᜏ","wi":"ᜏᜒ","wu":"ᜏᜓ","w":"ᜏ᜔","w_p":"ᜏ᜕","we":"ᜏᜒ","wo":"ᜏᜓ","sa":"ᜐ","si":"ᜐᜒ","su":"ᜐᜓ","s":"ᜐ᜔","s_p":"ᜐ᜕","se":"ᜐᜒ","so":"ᜐᜓ","ha":"ᜑ","hi":"ᜑᜒ","hu":"ᜑᜓ","h":"ᜑ᜔","h_p":"ᜑ᜕","he":"ᜑᜒ","ho":"ᜑᜓ","|":"᜵","||":"᜶"," ":" "};

const V = "aeiou";
const CONS = "kgtdnpbmyrlwsh";

export type BbOptions = { killer?: "krus" | "pamudpod" };

// Modern-chart convention for letters not native to Baybayin
function normalize(s: string) {
  return String(s).toLowerCase().normalize("NFC")
    .replace(/\u00f1/g, "ny")
    .replace(/c(?=[ei])/g, "s").replace(/c/g, "k").replace(/q/g, "k")
    .replace(/f/g, "p").replace(/v/g, "b").replace(/z/g, "s")
    .replace(/x/g, "ks").replace(/j/g, "dy");
}

/** Latin -> unit keys, e.g. "babala" -> ["ba","ba","la"] */
export function tokenize(text: string, opt: BbOptions = {}): string[] {
  const s = normalize(text);
  const out: string[] = [];
  const kill = opt.killer === "pamudpod" ? "_p" : "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    let c: string | null = null;
    if (s.substr(i, 2) === "ng") c = "ng";
    else if (CONS.indexOf(ch) > -1) c = ch;
    if (c) {
      const nx = s[i + c.length];
      if (nx && V.indexOf(nx) > -1) { out.push(c + nx); i += c.length + 1; }
      else { out.push(c + kill); i += c.length; }
    } else if (V.indexOf(ch) > -1) { out.push(ch); i++; }
    else if (/\s/.test(ch)) { if (out.length && out[out.length - 1] !== " ") out.push(" "); i++; }
    else if (".!?;".indexOf(ch) > -1) { out.push("||"); i++; }
    else if (",:".indexOf(ch) > -1) { out.push("|"); i++; }
    else i++;
  }
  return out;
}

/** Latin -> Unicode Baybayin. Display with the "RX09 Baybayin" font (.bb class). */
export function transliterate(text: string, opt: BbOptions = {}): string {
  return tokenize(text, opt).map((k) => BB_UNICODE[k] ?? "").join("");
}
