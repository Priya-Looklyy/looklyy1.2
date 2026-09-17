/**
 * Official Dun & Bradstreet D-U-N-S Registered seal.
 * Cid is the company identifier issued by D&B for this embed.
 */
const DNB_SEAL_SRC =
  'https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1';

export function DunBradstreetSeal() {
  return (
    <iframe
      id="Iframe1"
      src={DNB_SEAL_SRC}
      width={114}
      height={97}
      frameBorder={0}
      scrolling="no"
      allowTransparency
      title="Dun & Bradstreet D-U-N-S Registered Seal"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ border: 0, background: 'transparent', display: 'block' }}
    />
  );
}
