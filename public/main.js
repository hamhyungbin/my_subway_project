document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // 폼 자동 제출 방지

    const startStation = document.getElementById('start_station').value;
    const endStation = document.getElementById('end_station').value;
    const resultContainer = document.getElementById('result-container');

    resultContainer.innerHTML = '<p>경로를 검색 중입니다...</p>';

    try {
        // 우리 API(서버리스 함수) 호출
        const response = await fetch(`/api/search_route?start=${startStation}&end=${endStation}`);
        const data = await response.json();

        if (data.error) {
            resultContainer.innerHTML = `<p>오류: ${data.error.message || JSON.stringify(data.error)}</p>`;
            return;
        }

        const pathData = data.result;
        // 결과 표시 (result.html의 내용을 여기에 동적으로 생성)
        resultContainer.innerHTML = `
            <h3>요약 정보</h3>
            <p><strong>총 소요 시간:</strong> ${pathData.globalTravelTime}분</p>
            <p><strong>요금(카드):</strong> ${pathData.fareSet.fare[0].fare.toLocaleString()}원</p>
            <p><strong>총 이동 역 수:</strong> ${pathData.globalStationCount}개</p>
        `;

    } catch (error) {
        resultContainer.innerHTML = `<p>검색 중 오류가 발생했습니다: ${error.message}</p>`;
    }
});