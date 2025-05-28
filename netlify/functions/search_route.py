# netlify/functions/search_route.py
import os
import json
import requests

def handler(event, context):
    # API 키를 환경 변수에서 가져오는 것이 더 안전합니다.
    # Netlify 대시보드에서 설정 가능: Site settings > Build & deploy > Environment
    ODSAY_API_KEY = os.environ.get('ODSAY_API_KEY')
    
    # URL 쿼리 파라미터에서 역 정보를 가져옴
    params = event.get('queryStringParameters', {})
    start_station = params.get('start')
    end_station = params.get('end')

    if not start_station or not end_station:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': '출발역과 도착역 ID를 모두 입력해주세요.'})
        }

    search_url = f"https://api.odsay.com/v1/api/subwayPath?lang=0&CID=1000&SID={start_station}&EID={end_station}&apiKey={ODSAY_API_KEY}"

    try:
        response = requests.get(search_url)
        response.raise_for_status()
        data = response.json()

        return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': json.dumps(data)
        }
    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'API 요청 오류: {e}'})
        }