import { getPlaiceholder } from 'plaiceholder';

export default async function imageToBase64(src) {
  try {
    const buffer = await fetch(src).then(async res => Buffer.from(await res.arrayBuffer()));
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (err) {
    err;
  }
}
