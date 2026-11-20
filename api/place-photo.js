// api/place-photo.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const name = (req.query.name || '').trim();
  const address = (req.query.address || '').trim();

  if (!name) {
    return res.status(400).json({ imageUrl: null, error: 'Place name is required' });
  }

  const areaHint = address.split(' ').filter(Boolean).slice(0, 3).join(' ');
  const query = `${name} ${areaHint}`.trim();
  const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY || '6c8220ae803f3de90bb013768644ae99';

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(query)}&size=6`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(200).json({ imageUrl: null });
    }

    const data = await response.json();
    const docs = Array.isArray(data.documents) ? data.documents : [];
    const bestDoc =
      docs.find((doc) => doc.thumbnail_url && doc.width >= doc.height) ||
      docs.find((doc) => doc.thumbnail_url);

    return res.status(200).json({ imageUrl: bestDoc?.thumbnail_url || null });
  } catch (error) {
    return res.status(200).json({ imageUrl: null, error: error.message });
  }
}