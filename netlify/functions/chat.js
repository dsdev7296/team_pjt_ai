// netlify/functions/chat.js

export default async (request) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'POST 요청만 허용됩니다.',
      }),
      {
        status: 405,
        headers: jsonHeaders,
      },
    )
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'OPENAI_API_KEY가 설정되지 않았습니다.',
        }),
        {
          status: 500,
          headers: jsonHeaders,
        },
      )
    }

    const body = await request.json()

    const userMessage = String(
      body.userMessage ?? '',
    ).trim()

    const dbContextItems = Array.isArray(
      body.dbContextItems,
    )
      ? body.dbContextItems
      : []

    if (!userMessage) {
      return new Response(
        JSON.stringify({
          error: '사용자 메시지가 없습니다.',
        }),
        {
          status: 400,
          headers: jsonHeaders,
        },
      )
    }

    const contextText = dbContextItems
      .map((item, index) => {
        return [
          `${index + 1}. ${item.title ?? '이름 없음'}`,
          `카테고리: ${item.originCat ?? '정보 없음'}`,
          `주소: ${item.addr1 ?? '정보 없음'}`,
          `전화번호: ${item.tel ?? '정보 없음'}`,
        ].join('\n')
      })
      .join('\n\n')

    const systemPrompt = `
당신은 서울 지역 정보를 안내하는 LocalHub AI 도우미입니다.

다음 원칙을 지켜 답변하세요.

1. 제공된 로컬 데이터를 우선 사용합니다.
2. 장소를 추천할 때 장소명과 주소를 함께 안내합니다.
3. 제공된 데이터에 없는 내용을 사실처럼 만들지 않습니다.
4. 답변은 자연스러운 한국어로 작성합니다.
5. 추천 결과는 읽기 쉽게 정리합니다.
`.trim()

    const userPrompt = `
사용자 질문:
${userMessage}

검색된 로컬 데이터:
${contextText || '관련 로컬 데이터가 없습니다.'}

위 데이터를 참고하여 사용자 질문에 답변하세요.
`.trim()

    const openAiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.7,
        }),
      },
    )

    const data = await openAiResponse.json()

    if (!openAiResponse.ok) {
      console.error('OpenAI API 오류:', data)

      return new Response(
        JSON.stringify({
          error:
            data?.error?.message ??
            'OpenAI API 요청에 실패했습니다.',
        }),
        {
          status: openAiResponse.status,
          headers: jsonHeaders,
        },
      )
    }

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: jsonHeaders,
      },
    )
  } catch (error) {
    console.error('Netlify chat 함수 오류:', error)

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : '서버 오류가 발생했습니다.',
      }),
      {
        status: 500,
        headers: jsonHeaders,
      },
    )
  }
}