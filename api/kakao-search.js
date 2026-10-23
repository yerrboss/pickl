// api/kakao-search.js
export default async function handler(req, res) {
  // CORS 허용 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // 아까 확인했던 REST API 키
  const KAKAO_REST_KEY = "6c8220ae803f3de90bb013768644ae99";

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "Authorization": `KakaoAK ${KAKAO_REST_KEY}`
        }
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}