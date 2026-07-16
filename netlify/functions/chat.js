// netlify/functions/chat.js
exports.handler = async (event, context) => {
  // POST 요청만 허용합니다.
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 💡 Netlify 금고에 저장해둔 진짜 API 키를 서버 내부에서 안전하게 꺼냅니다.
    const apiKey = process.env.OPENAI_API_KEY; 
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API 키가 Netlify에 설정되지 않았습니다." })
      };
    }

    // Vue 화면에서 보낸 사용자의 질문과 1차 필터링된 데이터(dbContextItems)를 파싱합니다.
    const { userMessage, dbContextItems } = JSON.parse(event.body);

    // 네트리파이 백엔드 내부에서 OpenAI API를 비밀리에 호출합니다. (사용자 화면엔 절대 노출되지 않음)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `너는 지역 정보 추천 전문가야. 제공된 [지역 정보 데이터] 리스트를 기반으로 사용자의 질문에 연상 추론을 활용하여 답변해라.
예를 들어 사용자가 '쇼핑'을 물어봤다면, 데이터 중 이름에 '쇼핑'이 없더라도 '시장', '문구완구거리', '플래그십 스토어', '인사동길'처럼 쇼핑이나 물건 구매와 연관된 장소를 똑똑하게 추출해서 추천해 주어야 한다.

[⚠️ 출력 포맷 규칙 - 모바일 최적화]
1. 불필요한 미사여구, 긴 설명, 서론/결론은 모두 제거하고 최대 5개 장소만 골라 출력해라.
2. 각 추천 장소는 오직 아래 양식만을 칼같이 지켜서 한 줄씩 마크다운으로 깔끔하게 작성해라.

📍 **[장소명]**
🏠 주소: [주소]

(추천할 장소 세트 사이에는 한 줄씩 공백을 둬라.)
(조건에 맞는 연상 장소가 정말 단 하나도 없다면 "요청하신 조건에 일치하는 정보를 찾을 수 없습니다."라고만 짧게 대답해라.)`
          },
          {
            role: 'user',
            content: `사용자 질문: "${userMessage}"\n\n[지역 정보 데이터 (이 안에서만 골라라)]:\n${JSON.stringify(dbContextItems, null, 2)}`
          }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: errText };
    }

    const data = await response.json();
    
    // 성공 시 OpenAI 답변 텍스트를 프론트엔드로 돌려줍니다.
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "백엔드 연동 중 내부 오류가 발생했습니다." })
    };
  }
};